/**
 * Server initialization
 */
import { createApp } from './app';
import { appConfig } from './config';
import { logger } from './core/logger/logger.service';
import { prismaService } from './core/database/prisma.service';
import { redisService } from './core/cache/redis.service';

/**
 * Start the server
 */
export async function startServer(): Promise<void> {
  try {
    // Health checks
    const dbHealthy = await prismaService.healthCheck();
    if (!dbHealthy) {
      throw new Error('Database connection failed');
    }

    const redisHealthy = await redisService.healthCheck();
    if (!redisHealthy) {
      logger.warn('Redis connection failed - caching disabled');
    }

    // Create app
    const app = createApp();

    // Start server
    const server = app.listen(appConfig.port, () => {
      logger.info(`Server running on port ${appConfig.port}`, {
        env: appConfig.env,
        apiPrefix: appConfig.apiPrefix,
      });
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received - shutting down gracefully`);
      server.close(async () => {
        await prismaService.disconnect();
        await redisService.disconnect();
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

