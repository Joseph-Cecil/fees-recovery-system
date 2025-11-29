/**
 * Authentication configuration
 */
export const authConfig = {
  accessSecret: process.env.JWT_ACCESS_SECRET || '',
  refreshSecret: process.env.JWT_REFRESH_SECRET || '',
  accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
  refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
  otpExpirationMinutes: parseInt(process.env.OTP_EXPIRATION_MINUTES || '10', 10),
  otpLength: parseInt(process.env.OTP_LENGTH || '6', 10),
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  accessExpirationSeconds: 15 * 60, // 15 minutes in seconds
  refreshExpirationSeconds: 7 * 24 * 60 * 60, // 7 days in seconds
  otpExpirationMs: parseInt(process.env.OTP_EXPIRATION_MINUTES || '10', 10) * 60 * 1000,
};

