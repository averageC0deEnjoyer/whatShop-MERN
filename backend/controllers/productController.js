import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

//@desc Fetch all products
//@route GET /api/products
//@access public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  return res.json(products);
});

//@desc Fetch a product
//@route GET /api/products/:id
//@access public
const getProductById = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;
  const selectedProduct = await Product.findById(productId);
  if (selectedProduct) {
    return res.json(selectedProduct);
  }
  res.status(404);
  throw new Error('Resource not found');
});

export { getProducts, getProductById };