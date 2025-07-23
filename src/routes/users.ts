import express from 'express';
import {
  validateUserRegistration,
  validateUserUpdate,
  validateUserLogin,
} from '../controllers/users/schema';
import {
  registerUser,
  updateUserProfile,
  loginUserController,
  getUserProfile,
} from '../controllers/users';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Public routes (no authentication required)
router.post('/', validateUserRegistration, registerUser);
router.post('/login', validateUserLogin, loginUserController);

// Protected routes (authentication required)
router.get('/:userId', authenticateToken, getUserProfile);
router.patch(
  '/:userId',
  authenticateToken,
  validateUserUpdate,
  updateUserProfile
);

export default router;
