import { Request, Response, NextFunction } from 'express';
import winston from 'winston';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  winston.error(err.stack || err.message);
  res.status((err as any).status || 500).json({
    error: err.message || 'Internal Server Error',
  });
}
