import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

//@desc   Fetch all products
//@route  GET /api/products
//@access Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  return res.json(products);
});

//@desc   Fetch a product
//@route  GET /api/products/:id
//@access Public
const getProductById = asyncHandler(async (req, res) => {
  console.log(req.params);
  const { id: productId } = req.params;
  const selectedProduct = await Product.findById(productId);
  if (selectedProduct) {
    return res.json(selectedProduct);
  }
  res.status(404);
  throw new Error('Resource not found');
});

//@desc   Create a product, user click product then automatically create default product
//@route  POST /api/products
//@access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    user: req.user._id,
    name: 'sample name',
    image: '/images/sample.jpg',
    brand: 'sample brand',
    category: 'sample category',
    description: 'sample description',
  });
  const newProduct = await product.save();
  return res.status(201).json(newProduct);
});

//@desc   Update a product
//@route  PUT /api/products/:id
//@access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;
  console.log(req.body);
  const { name, brand, category, image, description, price, countInStock } =
    req.body;

  const product = await Product.findById(productId);

  if (product) {
    product.name = name;
    product.brand = brand;
    product.category = category;
    // product.image = image;
    product.description = description;
    product.price = price;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    return res.status(200).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

export { getProducts, getProductById, createProduct, updateProduct };
