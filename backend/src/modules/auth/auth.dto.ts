/**
 * Auth DTOs
 */
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const requestOtpSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
}).refine((data) => data.email || data.phone, {
  message: 'Either email or phone is required',
});

export const verifyOtpSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  otp: z.string().length(6),
}).refine((data) => data.email || data.phone, {
  message: 'Either email or phone is required',
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export type LoginDto = z.infer<typeof loginSchema>;
export type RequestOtpDto = z.infer<typeof requestOtpSchema>;
export type VerifyOtpDto = z.infer<typeof verifyOtpSchema>;
export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;

export interface AuthResponse {
  user: {
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
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

