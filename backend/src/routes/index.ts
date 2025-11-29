/**
 * Route aggregator
 */
import { Router } from 'express';
import { authMiddleware } from '@/shared/middleware/auth.middleware';
import { authRoutes } from '@/modules/auth/auth.routes';

const router = Router();

// Health check (public)
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Public routes
router.use('/auth', authRoutes);

// Protected routes (require authentication)
router.use(authMiddleware);

// TODO: Add other protected routes here
// import { usersRoutes } from '@/modules/users/users.routes';
// import { studentsRoutes } from '@/modules/students/students.routes';
// etc.
// router.use('/users', usersRoutes);
// router.use('/students', studentsRoutes);

export { router as apiRoutes };

