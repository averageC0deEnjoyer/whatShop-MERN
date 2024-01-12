import express from 'express';
const router = express.Router();
import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const products = await Product.find({});
    return res.json(products);
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id: productId } = req.params;
    const selectedProduct = await Product.findById(productId);
    if (selectedProduct) {
      return res.json(selectedProduct);
    }
    res.status(404);
    throw new Error('Resource not found');
  })
);

export default router;
