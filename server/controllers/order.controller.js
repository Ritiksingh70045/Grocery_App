import dotenv from 'dotenv';
dotenv.config();
import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import Stripe from 'stripe';
import { request, response } from 'express';
import User from '../models/user.model.js';
import Seller from '../models/seller.model.js';

// COD
export const placeOrderCOD = async (req, res) => {
  try {
    const { items, address } = req.body;
    const userId = req.user.id;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: 'Invalid data' });
    }

    // Calculate total amount
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    amount += Math.floor(amount * 0.02); // Add 2% platform/service fee

    const productInfo = await Product.findById(items[0].product);
    const sellerId = productInfo.sellerId;

    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: 'COD',
      sellerId,
    });

    // Empty user's cart
    await User.findByIdAndUpdate(userId, {
      cartItems: {},
      $push: { orders: order._id },
    });

    // Push order to seller
    await Seller.findByIdAndUpdate(sellerId, {
      $push: { orders: order._id },
    });

    return res.json({
      success: true,
      message: 'Order Placed Successfully',
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ONLINE (Stripe)
export const placeOrderStripe = async (req, res) => {
  try {
    const { items, address } = req.body;
    const userId = req.user.id;
    const { origin } = req.headers;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: 'Invalid data' });
    }

    const productData = [];
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    amount += Math.floor(amount * 0.02); // Add 2% service/platform fee

    // 🛑 Minimum Stripe Checkout amount check
    if (amount < 50) {
      return res.status(400).json({
        success: false,
        message:
          'Minimum order amount for online payment must be ₹50. Please choose Cash on Delivery instead.',
      });
    }

    const productInfo = await Product.findById(items[0].product);
    const sellerId = productInfo.sellerId;

    // Create order
    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: 'Online',
      sellerId,
    });

    // Push to user and seller
    await User.findByIdAndUpdate(userId, {
      $push: { orders: order._id },
    });

    await Seller.findByIdAndUpdate(sellerId, {
      $push: { orders: order._id },
    });

    // Stripe Checkout
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = productData.map((item) => ({
      price_data: {
        currency: 'inr', // ✅ Use INR
        product_data: { name: item.name },
        unit_amount: Math.floor(item.price * 1.02 * 100), // ₹ → paise
      },
      quantity: item.quantity,
    }));

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${origin}/loader?next=my-orders&success=true`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    return res.json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Stripe Webhooks
export const stripeWebhooks = async (request, response) => {
  const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = request.headers['stripe-signature'];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return response.status(400).send(`Webhook Error : ${error.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntent.id,
      });

      const { orderId, userId } = session.data[0].metadata;

      await Order.findByIdAndUpdate(orderId, { isPaid: true });

      await User.findByIdAndUpdate(userId, {
        cartItems: {},
        $push: { orders: orderId },
      });

      const order = await Order.findById(orderId);
      await Seller.findByIdAndUpdate(order.sellerId, {
        $push: { orders: orderId },
      });

      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntent.id,
      });

      const { orderId } = session.data[0].metadata;
      await Order.findById(orderId);
      break;
    }

    default:
      console.error(`Unhandled event type ${event.type}`);
  }

  response.json({ received: true });
};

// get order by userId
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Fetching orders for user:', req.user.id);

    const orders = await Order.find({
      userId,
      $or: [{ paymentType: 'COD' }, { isPaid: true }],
    })
      .populate('items.product address sellerId')
      .sort({ createdAt: -1 });

    console.log('Found orders:', orders.length);

    return res.json({ success: true, orders });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Get all orders (for seller or admin)
export const getAllOrders = async (req, res) => {
  try {
    const sellerId = req.seller.id;
    const orders = await Order.find({
      sellerId,
      $or: [{ paymentType: 'COD' }, { isPaid: true }],
    })
      .populate('items.product address')
      .sort({ createdAt: -1 });

    return res.json({ success: true, orders });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
