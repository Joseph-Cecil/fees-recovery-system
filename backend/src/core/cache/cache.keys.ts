/**
 * Cache key generators
 */
export const cacheKeys = {
  user: (id: string) => `user:${id}`,
  school: (id: string) => `school:${id}`,
  student: (id: string) => `student:${id}`,
  invoice: (id: string) => `invoice:${id}`,
  payment: (id: string) => `payment:${id}`,
  otp: (identifier: string, type: string) => `otp:${identifier}:${type}`,
  rateLimit: (key: string) => `ratelimit:${key}`,
};

