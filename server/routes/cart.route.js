import express from 'express';
import authUser from '../middleware/authUser.middleware.js';
import { getCartProducts, updateCart } from '../controllers/cart.controller.js';

const cartRouter = express.Router();

cartRouter.post('/update', authUser, updateCart);
cartRouter.post('/cart-products', getCartProducts);

export default cartRouter;
