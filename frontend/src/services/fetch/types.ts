/**
 * TypeScript types for fetch service
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestConfig<TBody = unknown> {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: TBody;
  params?: Record<string, string | number | boolean | undefined | null>;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  signal?: AbortSignal;
  skipErrorHandling?: boolean;
  skipAuth?: boolean;
  cacheKey?: string;
  cacheTTL?: number;
  responseType?: 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData';
  credentials?: RequestCredentials;
  fetch?: typeof fetch;
}

export interface ApiResponse<TData> {
  data: TData;
  status: number;
  statusText: string;
  headers: Headers;
  duration: number;
  cached: boolean;
}

export type RequestInterceptor = (
  url: string,
  config: RequestConfig
) => Promise<{ url: string; config: RequestConfig }> | { url: string; config: RequestConfig };

export type ResponseInterceptor<T = unknown> = (
  response: ApiResponse<T>
) => Promise<ApiResponse<T>> | ApiResponse<T>;

export type ErrorInterceptor = (error: FetchError) => Promise<FetchError> | FetchError;

export interface FetchClientConfig {
  baseUrl: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
  retries?: number;
  retryDelay?: number;
  enableLogging?: boolean;
  requestInterceptors?: RequestInterceptor[];
  responseInterceptors?: ResponseInterceptor[];
  errorInterceptors?: ErrorInterceptor[];
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiErrorResponse {
  message: string;
  code: string;
  details?: Record<string, string[]>;
  stack?: string;
}

import { FetchError } from './errors';

