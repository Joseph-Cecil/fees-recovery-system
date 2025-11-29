/**
 * Retry logic with exponential backoff
 */
import { isRetryableError, RateLimitError } from './errors';

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  jitterFactor: number;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 30000,
  jitterFactor: 0.2,
};

export function calculateRetryDelay(attempt: number, config: RetryConfig = DEFAULT_RETRY_CONFIG): number {
  const exponentialDelay = config.baseDelay * Math.pow(2, attempt);
  const cappedDelay = Math.min(exponentialDelay, config.maxDelay);
  const jitter = cappedDelay * config.jitterFactor * Math.random();
  return Math.floor(cappedDelay + jitter);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withRetry<T>(fn: () => Promise<T>, config: Partial<RetryConfig> = {}): Promise<T> {
  const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (!isRetryableError(error)) {
        throw error;
      }

      if (attempt >= retryConfig.maxRetries) {
        throw error;
      }

      let delay: number;
      if (error instanceof RateLimitError && error.retryAfter) {
        delay = error.retryAfter * 1000;
      } else {
        delay = calculateRetryDelay(attempt, retryConfig);
      }

      console.warn(
        `Request failed, retrying in ${delay}ms (attempt ${attempt + 1}/${retryConfig.maxRetries})`,
        error
      );

      await sleep(delay);
    }
  }

  throw lastError;
}

