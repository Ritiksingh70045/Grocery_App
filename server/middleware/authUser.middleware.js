import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const authUser = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.json({ success: false, message: 'Not Authorized' });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      req.user = { id: tokenDecode.id }; // ✅ THIS IS CORRECT
    } else {
      return res.json({ success: false, message: 'Not Authorized' });
    }

    next();
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export default authUser;
