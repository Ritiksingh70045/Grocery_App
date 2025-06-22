import { v2 as cloudinary } from 'cloudinary';
import Product from '../models/product.model.js';

export const addProduct = async (req, res) => {
  try {
    let productData;
    try {
      productData = JSON.parse(req.body.productData);
      // console.log('PRODUCT DATA :', productData);
    } catch (err) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid productData JSON' });
    }

    const images = req.files;

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: 'image',
        });
        return result.secure_url;
      })
    );

    // console.log('productData: ', productData);
    // console.log('imagesUrl: ', imagesUrl);

    await Product.create({ ...productData, image: imagesUrl });
    res.json({ success: true, message: 'Product Added' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const productList = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const productById = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    await Product.findByIdAndUpdate(id, { inStock });
    res.json({ success: true, message: 'Stock Updated' });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
