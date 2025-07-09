import express from 'express';
import { upload } from '../configs/multer.js';
import authSeller from '../middleware/authSeller.middleware.js';
import {
  addProduct,
  changeStock,
  productById,
  productList,
} from '../controllers/product.controller.js';
const productRouter = express.Router();

productRouter.post('/add', upload.array(["images"]), authSeller, addProduct);
productRouter.get('/list', authSeller, productList); 
productRouter.get('/id', productById);
productRouter.post('/stock', authSeller, changeStock);

export default productRouter;
