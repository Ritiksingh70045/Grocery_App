import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import Seller from '../models/seller.model.js';
import bcrypt from 'bcryptjs';

export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: 'Missing Credentials' });
    }

    const seller = await Seller.findOne({ email });

    if (!seller) {
      return res.json({ success: false, message: 'Seller not found' });
    }

    const isMatch = await bcrypt.compare(password, seller.password);

    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid password' });
    }

    const token = jwt.sign({ id: seller._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('sellerToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      seller: {
        _id: seller._id,
        name: seller.name,
        email: seller.email,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const sellerRegister = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password || !phone || !address) {
      return res.json({ success: false, message: 'Missing required fields' });
    }

    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.json({ success: false, message: 'Seller already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const seller = await Seller.create({
      sellerName: name,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    const token = jwt.sign({ id: seller._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });

    res.cookie('sellerToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      success: true,
      seller: {
        name: seller.sellerName, // name will be used to access seller's name
        email: seller.email,
        phone: seller.phone,
        address: seller.address,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

export const isSellerAuth = async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller.id).select('-password');
    if (!seller) {
      return res.json({ success: false, message: 'Seller not found' });
    }

    return res.json({ success: true, seller }); // ✅ send seller back
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const sellerLogout = async (req, res) => {
  try {
    res.clearCookie('sellerToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });
    
    return res.json({ success: true, message: 'Logged Out Successfully' });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

export const sellerList = async (req, res) => {
  try {
    const sellers = await Seller.find({}).select('-password'); // find() retrieves all sellers, and select('-password') excludes the password field from the result.
    return res.json({ success: true, sellers });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};


export const changePassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.json({ success: false, message: 'Missing Details' });
    }

    const seller = await Seller.findOne({ email });

    if (!seller) {
      return res.json({ success: false, message: 'Seller not found' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    seller.password = hashedNewPassword;
    await seller.save();

    return res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ success: false, message: error.message });
  }
}