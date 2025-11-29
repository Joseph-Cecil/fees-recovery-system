/**
 * Queue configuration
 */
export const queueConfig = {
  redisUrl: process.env.QUEUE_REDIS_URL || process.env.REDIS_URL || 'redis://localhost:6379',
  defaultAttempts: parseInt(process.env.QUEUE_DEFAULT_ATTEMPTS || '3', 10),
  defaultBackoff: parseInt(process.env.QUEUE_DEFAULT_BACKOFF || '1000', 10),
};

