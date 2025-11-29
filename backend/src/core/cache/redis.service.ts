/**
 * Redis service
 */
import Redis from 'ioredis';
import { redisConfig } from '@/config';

class RedisService {
  private client: Redis | null = null;

  /**
   * Get or create Redis client
   */
  getClient(): Redis {
    if (!this.client) {
      this.client = new Redis(redisConfig.url, {
        password: redisConfig.password,
        db: redisConfig.db,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      });

      this.client.on('error', (err) => {
        console.error('Redis error:', err);
      });
    }

    return this.client;
  }

  /**
   * Disconnect from Redis
   */
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const client = this.getClient();
      await client.ping();
      return true;
    } catch {
      return false;
    }
  }
}

export const redisService = new RedisService();

