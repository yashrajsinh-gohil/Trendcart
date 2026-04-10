import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
} from '../controllers/productController.js';
import { validateProductCreate, validateProductUpdate, validateMongoIdParam } from '../utils/validation.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/category/:categoryId', validateMongoIdParam('categoryId'), validate, getProductsByCategory);
router.get('/:id', validateMongoIdParam('id'), validate, getProductById);

// Admin routes
router.post('/', protect, authorize('admin'), validateProductCreate, validate, createProduct);
router.put('/:id', protect, authorize('admin'), validateMongoIdParam('id'), validateProductUpdate, validate, updateProduct);
router.delete('/:id', protect, authorize('admin'), validateMongoIdParam('id'), validate, deleteProduct);

export default router;
