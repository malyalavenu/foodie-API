import express from 'express';
import {
  fetchRestaurants,
  fetchRestaurantById,
  addRestaurant,
} from '../controllers/restaurants/index';
import { authenticateToken } from '../middleware/auth';
import { validateRestaurantCreate } from '../controllers/restaurants/schema';

const router = express.Router();

// Protect all restaurant routes with authentication
router.use(authenticateToken);

router.get('/', fetchRestaurants);
router.get('/:restaurantId', fetchRestaurantById);
router.post('/', validateRestaurantCreate, addRestaurant);

export default router;
