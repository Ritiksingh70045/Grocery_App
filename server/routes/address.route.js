import express from 'express';
import authUser from '../middleware/authUser.middleware.js';
import { addAddress, getAddress } from '../controllers/address.controller.js';

const addressRouter = express.Router();

addressRouter.post('/add', authUser, addAddress);
addressRouter.get('/get', authUser, getAddress);

export default addressRouter;
