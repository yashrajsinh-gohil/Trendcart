import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { validateCategoryCreate, validateMongoIdParam } from '../utils/validation.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getAllCategories);
router.get('/:id', validateMongoIdParam('id'), validate, getCategoryById);

// Admin routes
router.post('/', protect, authorize('admin'), validateCategoryCreate, validate, createCategory);
router.put('/:id', protect, authorize('admin'), validateMongoIdParam('id'), validateCategoryCreate, validate, updateCategory);
router.delete('/:id', protect, authorize('admin'), validateMongoIdParam('id'), validate, deleteCategory);

export default router;
