import express from 'express';
import {
  changePassword,
  isSellerAuth,
  sellerLogin,
  sellerLogout,
  sellerRegister,
} from '../controllers/seller.controller.js';
import authSeller from '../middleware/authSeller.middleware.js';

const sellerRouter = express.Router();
sellerRouter.post('/login', sellerLogin);
sellerRouter.post('/register', sellerRegister);
sellerRouter.get('/is-auth', authSeller, isSellerAuth);
sellerRouter.get('/logout', sellerLogout);
sellerRouter.post('/forgot-password-seller', changePassword);
export default sellerRouter;
