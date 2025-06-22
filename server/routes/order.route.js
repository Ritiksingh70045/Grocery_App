import express from 'express';
import authUser from '../middleware/authUser.middleware.js';
import {
  getAllOrders,
  getUserOrders,
  placeOrderCOD,
  placeOrderStripe,
} from '../controllers/order.controller.js';
import authSeller from '../middleware/authSeller.middleware.js';
const orderRouter = express.Router();

orderRouter.post('/cod', authUser, placeOrderCOD);
orderRouter.get('/user', authUser, getUserOrders);
orderRouter.get('/seller', authSeller, getAllOrders);
orderRouter.post('/stripe', authUser, placeOrderStripe);

export default orderRouter;
