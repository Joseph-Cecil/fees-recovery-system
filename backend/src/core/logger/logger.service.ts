/**
 * Logger service using Pino
 */
import pino from 'pino';
import { appConfig } from '@/config';

const isDevelopment = appConfig.isDevelopment;
const logLevel = process.env.LOG_LEVEL || 'info';
const logFormat = process.env.LOG_FORMAT || 'pretty';

const logger = pino({
  level: logLevel,
  transport: isDevelopment && logFormat === 'pretty' ? { target: 'pino-pretty' } : undefined,
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
});

export class LoggerService {
  /**
   * Log debug message
   */
  debug(message: string, data?: Record<string, unknown>): void {
    logger.debug(data || {}, message);
  }

  /**
   * Log info message
   */
  info(message: string, data?: Record<string, unknown>): void {
    logger.info(data || {}, message);
  }

  /**
   * Log warning message
   */
  warn(message: string, data?: Record<string, unknown>): void {
    logger.warn(data || {}, message);
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error | unknown, data?: Record<string, unknown>): void {
    if (error instanceof Error) {
      logger.error({ ...data, err: error, stack: error.stack }, message);
    } else {
      logger.error(data || {}, message);
    }
  }
}

export const logger = new LoggerService();

