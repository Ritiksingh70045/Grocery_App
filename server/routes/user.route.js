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

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/is-auth', authUser, isAuth);
userRouter.get('/logout', authUser, logout);
userRouter.post('/update-password', authUser, updatePassword);
userRouter.post('/forgot-password', changePassword);

export default userRouter;
