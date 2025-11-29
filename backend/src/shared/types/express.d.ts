/**
 * Express type extensions
 */
import { AuthenticatedUser } from '../middleware/auth.middleware';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      schoolId?: string;
      requestId?: string;
    }
  }
}

