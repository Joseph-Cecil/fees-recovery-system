/**
 * Global error handling middleware
 */
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors';
import { logger } from '@/core/logger/logger.service';

/**
 * Error handling middleware
 */
export function errorMiddleware(
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log error
  if (error instanceof AppError) {
    logger.error('Application error', error, {
      path: req.path,
      method: req.method,
      statusCode: error.statusCode,
    });
  } else {
    logger.error('Unexpected error', error, {
      path: req.path,
      method: req.method,
    });
  }

  // Send error response
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    });
  } else {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : error.message,
      },
    });
  }
}

