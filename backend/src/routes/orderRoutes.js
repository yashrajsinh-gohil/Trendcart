import express from 'express';
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/orderController.js';
import { validateOrderCreate, validateOrderStatusUpdate, validateMongoIdParam } from '../utils/validation.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// Private routes (User)
router.post('/', protect, validateOrderCreate, validate, createOrder);
router.get('/user/my-orders', protect, getUserOrders);
router.get('/:id', protect, validateMongoIdParam('id'), validate, getOrderById);
router.delete('/:id', protect, validateMongoIdParam('id'), validate, cancelOrder);

// Admin routes
router.get('/', protect, authorize('admin'), getAllOrders);
router.put('/:id/status', protect, authorize('admin'), validateMongoIdParam('id'), validateOrderStatusUpdate, validate, updateOrderStatus);

export default router;
