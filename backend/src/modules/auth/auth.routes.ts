/**
 * Auth routes
 */
import { Router } from 'express';
import { authController, loginSchema, requestOtpSchema, verifyOtpSchema, refreshTokenSchema, validateBody } from './auth.controller';

const router: Router = Router();

router.post('/login', validateBody(loginSchema), authController.login);
router.post('/otp/request', validateBody(requestOtpSchema), authController.requestOtp);
router.post('/otp/verify', validateBody(verifyOtpSchema), authController.verifyOtp);
router.post('/refresh', validateBody(refreshTokenSchema), authController.refreshToken);

export { router as authRoutes };

