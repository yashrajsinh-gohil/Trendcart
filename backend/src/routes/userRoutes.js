import express from 'express';
import {
  updateUserProfile,
  getAllUsers,
  getUserById,
  deleteUser,
} from '../controllers/userController.js';
import {
  registerUser,
  loginUser,
  getUserProfile,
} from '../controllers/authController.js';
import { validateUserRegister, validateUserLogin, validateMongoIdParam } from '../utils/validation.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validateUserRegister, validate, registerUser);
router.post('/login', validateUserLogin, validate, loginUser);

// Private routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Admin routes
router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, authorize('admin'), validateMongoIdParam('id'), validate, getUserById);
router.delete('/:id', protect, authorize('admin'), validateMongoIdParam('id'), validate, deleteUser);

export default router;
