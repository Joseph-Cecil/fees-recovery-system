/**
 * Configuration exports
 */
export { appConfig } from './app.config';
export { databaseConfig } from './database.config';
export { authConfig } from './auth.config';
export { redisConfig } from './redis.config';
export { storageConfig } from './storage.config';
export { paymentConfig } from './payment.config';
export { messagingConfig } from './messaging.config';
export { queueConfig } from './queue.config';

/**
 * Combined config object
 */
export const config = {
  app: require('./app.config').appConfig,
  database: require('./database.config').databaseConfig,
  auth: require('./auth.config').authConfig,
  redis: require('./redis.config').redisConfig,
  storage: require('./storage.config').storageConfig,
  payment: require('./payment.config').paymentConfig,
  messaging: require('./messaging.config').messagingConfig,
  queue: require('./queue.config').queueConfig,
};

