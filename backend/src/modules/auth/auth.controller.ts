/**
 * Auth controller
 */
import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { loginSchema, requestOtpSchema, verifyOtpSchema, refreshTokenSchema } from './auth.dto';
import { validateBody } from '@/shared/middleware/validation.middleware';

// Export schemas for use in routes
export { loginSchema, requestOtpSchema, verifyOtpSchema, refreshTokenSchema };
export { validateBody };

export class AuthController {
  /**
   * Login
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ipAddress = req.ip || req.socket.remoteAddress || '';
      const userAgent = req.get('user-agent') || '';

      const result = await authService.login(req.body, ipAddress, userAgent);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Request OTP
   */
  requestOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await authService.requestOtp(req.body);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Verify OTP
   */
  verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ipAddress = req.ip || req.socket.remoteAddress || '';
      const userAgent = req.get('user-agent') || '';

      const result = await authService.verifyOtp(req.body, ipAddress, userAgent);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Refresh token
   */
  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await authService.refreshToken(req.body);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();

