import { Request, Response, NextFunction } from 'express';
import winston from 'winston';

export function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  winston.info(`${req.method} ${req.url}`);
  next();
}
