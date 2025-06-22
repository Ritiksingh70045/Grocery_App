import express from 'express';
import authUser from '../middleware/authUser.middleware.js';
import { updateCart } from '../controllers/cart.controller.js';

const cartRouter = express.Router();

cartRouter.post('/update', authUser, updateCart);

export default cartRouter;
