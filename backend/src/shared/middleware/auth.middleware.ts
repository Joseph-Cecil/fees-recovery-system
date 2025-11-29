/**
 * Authentication middleware
 */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authConfig } from '@/config';
import { prisma } from '@/core/database/prisma.client';
import { UnauthorizedError } from '../errors';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: string;
  schoolId: string;
  school: {
    id: string;
    name: string;
    slug: string;
  };
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      schoolId?: string;
    }
  }
}

/**
 * Extract JWT token from Authorization header
 */
function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const [type, token] = authHeader.split(' ');
  if (type !== 'Bearer' || !token) return null;

  return token;
}

/**
 * Authentication middleware
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractToken(req);

    if (!token) {
      throw new UnauthorizedError('No authentication token provided');
    }

    // Verify token
    const payload = jwt.verify(token, authConfig.accessSecret) as {
      sub: string;
      email: string;
      role: string;
      schoolId: string;
      type: string;
    };

    if (payload.type !== 'access') {
      throw new UnauthorizedError('Invalid token type');
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedError('User not found or inactive');
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      schoolId: user.schoolId,
      school: user.school,
    };
    req.schoolId = user.schoolId;

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional auth - doesn't fail if no token
 */
export async function optionalAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractToken(req);
    if (token) {
      await authMiddleware(req, res, () => {});
    }
    next();
  } catch {
    // Ignore auth errors for optional auth
    next();
  }
}

