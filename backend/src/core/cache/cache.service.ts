/**
 * Cache service using Redis
 */
import { redisService } from './redis.service';

export class CacheService {
  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const client = redisService.getClient();
      const value = await client.get(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch {
      return null;
    }
  }

  /**
   * Set value in cache with TTL
   */
  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    try {
      const client = redisService.getClient();
      await client.setex(key, ttlSeconds, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<void> {
    try {
      const client = redisService.getClient();
      await client.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  /**
   * Delete multiple keys matching pattern
   */
  async deletePattern(pattern: string): Promise<void> {
    try {
      const client = redisService.getClient();
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(...keys);
      }
    } catch (error) {
      console.error('Cache delete pattern error:', error);
    }
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    try {
      const client = redisService.getClient();
      await client.flushdb();
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }
}

export const cacheService = new CacheService();

