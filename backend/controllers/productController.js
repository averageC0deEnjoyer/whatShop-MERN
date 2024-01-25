import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
//@desc   Fetch all products
//@route  GET /api/products
//@access Public
const getProducts = asyncHandler(async (req, res) => {
  //how many product showed at page
  // console.log(req.query);
  const pageSize = Number(req.query.pageSize) || 2;
  //which page
  const page = Number(req.query.pageNumber) || 1;

  const options = {};

  if (req.query.searchKeyword) {
    options.name = { $regex: req.query.searchKeyword, $options: 'i' };
  }
  if (req.query.categoryName) {
    options.category = req.query.categoryName;
  }

  // console.log(options);
  const countAllDocuments = await Product.countDocuments(options);

  const products = await Product.find(options)
    .limit(pageSize)
    .skip((page - 1) * pageSize);
  return res
    .status(200)
    .json({ products, page, pages: Math.ceil(countAllDocuments / pageSize) });
});

//@desc   Fetch a product
//@route  GET /api/products/:id
//@access Public
const getProductById = asyncHandler(async (req, res) => {
  // console.log(req.params);
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
  // console.log(req.body);
  const { name, brand, category, image, description, price, countInStock } =
    req.body;
  // console.log(req.body);
  const product = await Product.findById(productId);

  if (product) {
    product.name = name;
    product.brand = brand;
    product.category = category;
    product.image = image;
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

//@desc   Delete a product
//@route  DELETE /api/products/:id
//@access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  // await Product.findByIdAndDelete(req.params.id);
  // return res.status(200).json({ message: 'Product deleted' });

  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    return res.status(200).json({ message: 'Product deleted' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

//since this is 'create' maybe we can use POST instead of PUT.
//@desc   Create a review
//@route  POST /api/products/:id/reviews
//@access Private
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  //check if product exist
  const product = await Product.findById(req.params.id);
  // console.log(product);
  //REF1:check if user ever bought item
  const orders = await Order.find({ user: req.user._id });
  const everBuyProduct = orders.some((order) =>
    order.orderItems.some((item) => item.product.equals(req.params.id))
  );
  // console.log(everBuyProduct);
  if (!everBuyProduct) {
    res.status(404);
    throw new Error('You never bought this item');
  }
  if (product) {
    //cant create a review if a user already make it once
    const productAlreadyReviewedByUser = product.reviews.find((review) =>
      review.user.equals(req.user._id)
    );
    if (productAlreadyReviewedByUser) {
      res.status(404);
      throw new Error('User Already Reviewed this Product');
    }
    //have to update reviews, rating, numReviews
    //create review from input
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((a, i) => a + Number(i.rating), 0) /
      product.reviews.length;

    await product.save();
    return res.status(201).json({ message: 'Review Added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc  Get top rated products
// @route GET /api/products/top
// @access Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  // console.log(products);
  res.status(200).json(products);
});

// @desc  Get all categories (for header)
// @route GET /api/products/categories
// @access Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.find({}, { category: 1 });
  // console.log(categories);
  const allCategories = categories.map((item) => item.category);
  const uniqueCategory = Array.from(new Set(allCategories));
  return res.status(200).json(uniqueCategory);
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createReview,
  getTopProducts,
  getCategories,
};
