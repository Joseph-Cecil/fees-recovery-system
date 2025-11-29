/**
 * Auth routes
 */
import { Router } from 'express';
import { authController } from './auth.controller';
import { loginSchema, requestOtpSchema, verifyOtpSchema, refreshTokenSchema } from './auth.dto';
import { validateBody } from '@/shared/middleware/validation.middleware';

const router = Router();

router.post('/login', validateBody(loginSchema), authController.login);
router.post('/otp/request', validateBody(requestOtpSchema), authController.requestOtp);
router.post('/otp/verify', validateBody(verifyOtpSchema), authController.verifyOtp);
router.post('/refresh', validateBody(refreshTokenSchema), authController.refreshToken);

export { router as authRoutes };

