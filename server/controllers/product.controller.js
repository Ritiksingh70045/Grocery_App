import { v2 as cloudinary } from 'cloudinary';
import Product from '../models/product.model.js';
import Seller from '../models/seller.model.js';

export const addProduct = async (req, res) => {
  try {
    let productData;
    try {
      productData = JSON.parse(req.body.productData);
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

    const newProduct = await Product.create({
      ...productData,
      image: imagesUrl,
      sellerId: req.seller.id,
    });
    await Seller.findByIdAndUpdate(
      req.seller.id,
      { $push: { products: newProduct._id } },
      { new: true }
    );
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

export const sellerProducts = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const products = await Product.find({ sellerId });
    res.json({ success: true, products });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
