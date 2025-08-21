import Product from '../models/product.model.js';
import User from '../models/user.model.js';

export const updateCart = async (req, res) => {
  try {
    const { cartItems } = req.body;
    const userId = req.user.id; // ✅ Use from auth middleware

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { cartItems },
      { new: true }
    );

    res.json({ success: true, message: 'Cart Updated', user: updatedUser });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const getCartProducts = async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!productIds || productIds.length === 0) {
      return res.json({ success: true, products: [] });
    }

    const products = await Product.find({ _id: { $in: productIds } });

    res.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching cart products:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
