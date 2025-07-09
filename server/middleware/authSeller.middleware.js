import jwt from 'jsonwebtoken';
import Seller from '../models/seller.model.js'; // ✅ import the model
import dotenv from 'dotenv';
dotenv.config();

const authSeller = async (req, res, next) => {
  const { sellerToken } = req.cookies;

  if (!sellerToken) {
    return res.json({ success: false, message: 'Not Authorized' });
  }

  try {
    const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);

    // ✅ Check if seller with decoded.id exists
    const seller = await Seller.findById(decoded.id).select('-password');
    if (!seller) {
      return res.json({ success: false, message: 'Seller not found' });
    }

    // ✅ Attach seller data to request if needed in controllers
    req.seller = { id: seller._id };

    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export default authSeller;
