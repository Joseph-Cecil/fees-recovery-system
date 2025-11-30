/**
 * Auth service
 */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '@/core/database/prisma.client';
import { authConfig } from '@/config';
import { UnauthorizedError, BadRequestError } from '@/shared/errors';
import { LoginDto, RequestOtpDto, VerifyOtpDto, RefreshTokenDto, AuthResponse } from './auth.dto';
import { AuthenticatedUser } from '@/shared/middleware/auth.middleware';

export class AuthService {
  /**
   * Login with email and password
   */
  async login(dto: LoginDto, ipAddress: string, userAgent: string): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: {
        school: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.password) {
      throw new BadRequestError('Please use OTP login for this account');
    }

    const isValidPassword = await bcrypt.compare(dto.password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const authUser: AuthenticatedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      schoolId: user.schoolId,
      school: user.school,
    };

    const accessToken = this.generateAccessToken(authUser);
    const refreshToken = this.generateRefreshToken(authUser);

    await this.storeRefreshToken(user.id, refreshToken, ipAddress, userAgent);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress,
      },
    });

    return {
      user: authUser,
      accessToken,
      refreshToken,
      expiresIn: authConfig.accessExpirationSeconds,
    };
  }

  /**
   * Request OTP
   */
  async requestOtp(dto: RequestOtpDto): Promise<{ message: string }> {
    const identifier = dto.email || dto.phone;
    if (!identifier) {
      throw new BadRequestError('Email or phone is required');
    }

    // TODO: Implement OTP generation and sending
    return { message: 'OTP sent successfully' };
  }

  /**
   * Verify OTP and login
   */
  async verifyOtp(_dto: VerifyOtpDto, _ipAddress: string, _userAgent: string): Promise<AuthResponse> {
    // TODO: Implement OTP verification
    throw new BadRequestError('OTP verification not yet implemented');
  }

  /**
   * Refresh access token
   */
  async refreshToken(dto: RefreshTokenDto): Promise<{ accessToken: string; expiresIn: number }> {
    const payload = jwt.verify(dto.refreshToken, authConfig.refreshSecret) as {
      sub: string;
      type: string;
    };

    if (payload.type !== 'refresh') {
      throw new UnauthorizedError('Invalid token type');
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        school: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedError('User not found or inactive');
    }

    const authUser: AuthenticatedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      schoolId: user.schoolId,
      school: user.school,
    };

    const accessToken = this.generateAccessToken(authUser);

    return {
      accessToken,
      expiresIn: authConfig.accessExpirationSeconds,
    };
  }

  /**
   * Generate access token
   */
  private generateAccessToken(user: AuthenticatedUser): string {
    if (!authConfig.accessSecret) {
      throw new Error('JWT_ACCESS_SECRET is not configured');
    }
    return jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        schoolId: user.schoolId,
        type: 'access',
      },
      authConfig.accessSecret,
      { expiresIn: authConfig.accessExpiration } as jwt.SignOptions
    );
  }

  /**
   * Generate refresh token
   */
  private generateRefreshToken(user: AuthenticatedUser): string {
    if (!authConfig.refreshSecret) {
      throw new Error('JWT_REFRESH_SECRET is not configured');
    }
    return jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        schoolId: user.schoolId,
        type: 'refresh',
      },
      authConfig.refreshSecret,
      { expiresIn: authConfig.refreshExpiration } as jwt.SignOptions
    );
  }

  /**
   * Store refresh token
   */
  private async storeRefreshToken(
    userId: string,
    token: string,
    ipAddress: string,
    userAgent: string
  ): Promise<void> {
    const payload = jwt.decode(token) as { exp: number };
    const expiresAt = new Date(payload.exp * 1000);

    await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
        ipAddress,
        userAgent,
      },
    });
  }
}

export const authService = new AuthService();

