import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

// Helper
const sendResponse = (user, statusCode, res, message) => {
  const token = generateToken(user);

  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: {
      id: user._id,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    }
  });
};

// Register
export const registerUser = async (req, res, next) => {
  try {
    const { name, firstName, lastName, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const resolvedName =
      name || [firstName, lastName].filter(Boolean).join(' ').trim();

    const user = await User.create({
      name: resolvedName,
      firstName,
      lastName,
      email,
      password,
    });

    sendResponse(user, 201, res, 'Registered successfully');
  } catch (error) {
    next(error);
  }
};

// Login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    sendResponse(user, 200, res, 'Login successful');
  } catch (error) {
    next(error);
  }
};

// Profile
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};