/**
 * Custom error classes for fetch service
 */
import { ApiErrorResponse } from './types';

export class FetchError extends Error {
  public readonly name = 'FetchError';
  public readonly timestamp: Date;

  constructor(
    message: string,
    public readonly code: string,
    public readonly status?: number,
    public readonly details?: Record<string, string[]>,
    public readonly originalError?: Error
  ) {
    super(message);
    this.timestamp = new Date();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      status: this.status,
      details: this.details,
      timestamp: this.timestamp.toISOString(),
    };
  }
}

export class NetworkError extends FetchError {
  public readonly name = 'NetworkError';

  constructor(message = 'Network error. Please check your internet connection.', originalError?: Error) {
    super(message, 'NETWORK_ERROR', undefined, undefined, originalError);
  }
}

export class TimeoutError extends FetchError {
  public readonly name = 'TimeoutError';

  constructor(timeout: number, originalError?: Error) {
    super(`Request timed out after ${timeout}ms`, 'TIMEOUT_ERROR', undefined, undefined, originalError);
  }
}

export class AbortError extends FetchError {
  public readonly name = 'AbortError';

  constructor(message = 'Request was cancelled', originalError?: Error) {
    super(message, 'ABORT_ERROR', undefined, undefined, originalError);
  }
}

export class HttpError extends FetchError {
  public readonly name = 'HttpError';

  constructor(
    message: string,
    code: string,
    public readonly status: number,
    public readonly statusText: string,
    details?: Record<string, string[]>,
    public readonly responseBody?: unknown
  ) {
    super(message, code, status, details);
  }

  isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  isServerError(): boolean {
    return this.status >= 500;
  }
}

export class UnauthorizedError extends HttpError {
  public readonly name = 'UnauthorizedError';

  constructor(message = 'Unauthorized. Please log in again.', details?: Record<string, string[]>) {
    super(message, 'UNAUTHORIZED', 401, 'Unauthorized', details);
  }
}

export class ForbiddenError extends HttpError {
  public readonly name = 'ForbiddenError';

  constructor(message = 'You do not have permission to perform this action.', details?: Record<string, string[]>) {
    super(message, 'FORBIDDEN', 403, 'Forbidden', details);
  }
}

export class NotFoundError extends HttpError {
  public readonly name = 'NotFoundError';

  constructor(message = 'The requested resource was not found.', details?: Record<string, string[]>) {
    super(message, 'NOT_FOUND', 404, 'Not Found', details);
  }
}

export class ValidationError extends HttpError {
  public readonly name = 'ValidationError';

  constructor(
    message = 'Validation failed. Please check your input.',
    public readonly validationErrors: Record<string, string[]>
  ) {
    super(message, 'VALIDATION_ERROR', 422, 'Unprocessable Entity', validationErrors);
  }

  getFieldErrors(field: string): string[] {
    return this.validationErrors[field] || [];
  }

  hasFieldError(field: string): boolean {
    return this.getFieldErrors(field).length > 0;
  }
}

export class RateLimitError extends HttpError {
  public readonly name = 'RateLimitError';

  constructor(message = 'Too many requests. Please try again later.', public readonly retryAfter?: number) {
    super(message, 'RATE_LIMIT', 429, 'Too Many Requests');
  }
}

export class ServerError extends HttpError {
  public readonly name = 'ServerError';

  constructor(message = 'An unexpected server error occurred. Please try again later.') {
    super(message, 'SERVER_ERROR', 500, 'Internal Server Error');
  }
}

export function createHttpError(
  status: number,
  statusText: string,
  body?: ApiErrorResponse
): HttpError {
  const message = body?.message || statusText;
  const code = body?.code || 'HTTP_ERROR';
  const details = body?.details;

  switch (status) {
    case 401:
      return new UnauthorizedError(message, details);
    case 403:
      return new ForbiddenError(message, details);
    case 404:
      return new NotFoundError(message, details);
    case 422:
      return new ValidationError(message, details || {});
    case 429:
      return new RateLimitError(message);
    case 500:
      return new ServerError(message);
    default:
      return new HttpError(message, code, status, statusText, details, body);
  }
}

export function isFetchError(error: unknown): error is FetchError {
  return error instanceof FetchError;
}

export function isRetryableError(error: unknown): boolean {
  if (error instanceof NetworkError) return true;
  if (error instanceof TimeoutError) return true;
  if (error instanceof HttpError) {
    return error.status >= 500 || error.status === 429;
  }
  return false;
}

