/**
 * Configuration exports
 */
import { appConfig } from './app.config';
import { databaseConfig } from './database.config';
import { authConfig } from './auth.config';
import { redisConfig } from './redis.config';
import { storageConfig } from './storage.config';
import { paymentConfig } from './payment.config';
import { messagingConfig } from './messaging.config';
import { queueConfig } from './queue.config';

export { appConfig, databaseConfig, authConfig, redisConfig, storageConfig, paymentConfig, messagingConfig, queueConfig };

/**
 * Combined config object
 */
export const config = {
  app: appConfig,
  database: databaseConfig,
  auth: authConfig,
  redis: redisConfig,
  storage: storageConfig,
  payment: paymentConfig,
  messaging: messagingConfig,
  queue: queueConfig,
};

