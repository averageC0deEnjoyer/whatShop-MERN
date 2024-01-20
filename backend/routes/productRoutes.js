import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.get('/', getProducts);

router.post('/', protect, admin, createProduct);

router.get('/:id', getProductById);

//router.route('/').get(getProducts);
//router.route('/:id').get(getProductById);

export default router;
