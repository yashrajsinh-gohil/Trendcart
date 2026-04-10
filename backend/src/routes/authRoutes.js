import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile
} from '../controllers/authController.js';

import { protect } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/role.js';
import { validateAuthRegister, validateAuthLogin } from '../utils/validation.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validateAuthRegister, validate, registerUser);
router.post('/login', validateAuthLogin, validate, loginUser);

// Protected route
router.get('/profile', protect, getUserProfile);

// Admin route
router.get('/admin', protect, requireAdmin, (req, res) => {
  res.json({
    success: true,
    message: 'Admin access granted',
    user: req.user
  });
});

export default router;