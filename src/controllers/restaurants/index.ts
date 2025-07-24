import { Request, Response, NextFunction } from 'express';
import {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
} from '../../services/restaurants';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

export const fetchRestaurants = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { location, cuisine, page = 1, limit = 10 } = req.query;
    const filters: any = {};
    if (location) {
      filters.location = location;
    }
    if (cuisine) {
      filters.cuisine = cuisine;
    }
    const result = await getRestaurants(filters, Number(page), Number(limit));
    res.json({
      total: result.count,
      restaurants: result.rows,
    });
  } catch (err) {
    next(err);
  }
};

export const fetchRestaurantById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { restaurantId } = req.params;
    const restaurant = await getRestaurantById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (err) {
    next(err);
  }
};

export const addRestaurant = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const restaurantData = req.body;
    const newRestaurant = await createRestaurant(restaurantData);
    res.status(201).json(newRestaurant);
  } catch (err) {
    next(err);
  }
};
