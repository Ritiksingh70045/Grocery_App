import dotenv from 'dotenv';
dotenv.config();
import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import Stripe from 'stripe';
import { request, response } from 'express';
import User from '../models/user.model.js';
// COD
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    if (!address || items.length == 0) {
      return res.json({ success: false, message: 'Invalid data' });
    }

    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    amount += Math.floor(amount * 0.02);

    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: 'COD',
    });

    await User.findByIdAndUpdate(userId, { cartItems: {} });
    return res.json({
      success: true,
      message: 'Order Placed Successfully',
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    const { origin } = req.headers;

    if (!address || items.length == 0) {
      return res.json({ success: false, message: 'Invalid data' });
    }

    let productData = [];

    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    amount += Math.floor(amount * 0.02);

    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: 'Online',
    });

    // Stripe Gateway Initialise
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = productData.map((item) => {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.floor(item.price * 1.02 * 100),
        },
        quantity: item.quantity,
      };
    });

    //* Create Session

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    await User.findByIdAndUpdate(userId, { cartItems: {} });

    return res.json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Stripe Webhooks to verify Payments Action

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
    response.status(400).send(`Webhook Error : ${error.message}`);
  }

  //Handle the event

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      //Getting Session Metadata
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { orderId, userId } = session.data[0].metadata;

      // Mark Payement as Paid
      await Order.findByIdAndUpdate(orderId, { isPaid: true });

      //Clear User Cart
      await User.findByIdAndUpdate(userId, { cartItems: {} });
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      //Getting Session Metadata
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { orderId } = session.data[0].metadata;
      await Order.findById(orderId);
      break;
    }
    default: {
      consol.error(`Unhandled event type ${event.type}`);
      break;
    }
  }
  response.json({ received: true });
};

// get order by userId

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: 'COD' }, { isPaid: true }],
    })
      .populate('items.product address')
      .sort({ createdAt: -1 });
    return res.json({ success: true, orders });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Get all orders (for seller or admin) : /api/order/seller
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: 'COD' }, { isPaid: true }],
    })
      .populate('items.product address')
      .sort({ createdAt: -1 });
    return res.json({ success: true, orders });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
