import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

const restaurantCreateSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  address: Joi.string().min(5).max(200).required(),
  rating: Joi.number().min(0).max(5).required(),
  cuisine: Joi.string().min(2).max(50).required(),
  menuId: Joi.string().required(),
  hours: Joi.string().min(5).max(100).required(),
});

export function validateRestaurantCreate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { error } = restaurantCreateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}
