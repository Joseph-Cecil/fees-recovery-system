/**
 * Logger service using Pino
 */
import pino from 'pino';
import { appConfig } from '@/config';

const isDevelopment = appConfig.isDevelopment;
const logLevel = process.env.LOG_LEVEL || 'info';
const logFormat = process.env.LOG_FORMAT || 'pretty';

const pinoLogger = pino({
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
    pinoLogger.debug(data || {}, message);
  }

  /**
   * Log info message
   */
  info(message: string, data?: Record<string, unknown>): void {
    pinoLogger.info(data || {}, message);
  }

  /**
   * Log warning message
   */
  warn(message: string, data?: Record<string, unknown>): void {
    pinoLogger.warn(data || {}, message);
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error | unknown, data?: Record<string, unknown>): void {
    if (error instanceof Error) {
      pinoLogger.error({ ...data, err: error, stack: error.stack }, message);
    } else {
      pinoLogger.error(data || {}, message);
    }
  }
}

export const logger = new LoggerService();

