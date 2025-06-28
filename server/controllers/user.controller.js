import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register User : /api/user/register

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: 'Missing Details' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });

    res.cookie('token', token, {
      httpOnly: true, // Prevent JS to access cookie
      secure: process.env.NODE_ENV === 'production', // use secure cookie in production
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // 
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Login user : /api/user/login

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });

    res.cookie('token', token, {
      httpOnly: true, // Prevent JS to access cookie
      secure: process.env.NODE_ENV === 'production', // use secure cookie in production
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ success: false, message: error.message });
  }
};

export const isAuth = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ use req.user.id from middleware
    const user = await User.findById(userId).select('-password');

    return res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    return res
      .status(404)
      .json({ success: false, message: 'User not Authorized' });
  }
};


export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
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

export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id; // ✅ use req.user.id from middleware

    if (!oldPassword || !newPassword) {
      return res.json({ success: false, message: 'Missing Details' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: 'Old password is incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ success: false, message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.json({ success: false, message: 'Missing Details' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ success: false, message: error.message });
  }
}