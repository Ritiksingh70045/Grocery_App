import express from 'express';
import {
  changePassword,
  isAuth,
  login,
  logout,
  register,
  updatePassword,
} from '../controllers/user.controller.js';
import authUser from '../middleware/authUser.middleware.js';
import { sellerList } from '../controllers/seller.controller.js';
import { sellerProducts } from '../controllers/product.controller.js';

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/is-auth', authUser, isAuth);
userRouter.get('/logout', authUser, logout);
userRouter.post('/update-password', authUser, updatePassword);
userRouter.post('/forgot-password', changePassword);
userRouter.get('/seller-list', sellerList);
userRouter.get('/:sellerId/products', sellerProducts);

export default userRouter;
