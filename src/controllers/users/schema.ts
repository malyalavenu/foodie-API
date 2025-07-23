import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

const userRegistrationSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().min(8).max(20).required(),
});

export function validateUserRegistration(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { error } = userRegistrationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}

const userUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  phone: Joi.string().min(8).max(20),
}).min(1);

export function validateUserUpdate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { error } = userUpdateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export function validateUserLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { error } = userLoginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}
