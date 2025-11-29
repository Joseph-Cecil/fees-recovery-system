/**
 * Custom Fetch Client
 * A fully-featured HTTP client built on top of the native fetch API.
 */
import {
  HttpMethod,
  RequestConfig,
  ApiResponse,
  FetchClientConfig,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
  ApiErrorResponse,
} from './types';
import {
  FetchError,
  NetworkError,
  TimeoutError,
  AbortError,
  createHttpError,
  isFetchError,
} from './errors';
import { withRetry, DEFAULT_RETRY_CONFIG } from './retry';
import { requestCache } from './cache';
import {
  authRequestInterceptor,
  loggingRequestInterceptor,
  loggingResponseInterceptor,
  loggingErrorInterceptor,
  authErrorInterceptor,
  runRequestInterceptors,
  runResponseInterceptors,
  runErrorInterceptors,
} from './interceptors';

class FetchClient {
  private baseUrl: string;
  private defaultTimeout: number;
  private defaultHeaders: Record<string, string>;
  private defaultRetries: number;
  private defaultRetryDelay: number;
  private enableLogging: boolean;
  private requestInterceptors: RequestInterceptor[];
  private responseInterceptors: ResponseInterceptor[];
  private errorInterceptors: ErrorInterceptor[];

  constructor(config: FetchClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.defaultTimeout = config.timeout || 30000;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...config.defaultHeaders,
    };
    this.defaultRetries = config.retries ?? DEFAULT_RETRY_CONFIG.maxRetries;
    this.defaultRetryDelay = config.retryDelay ?? DEFAULT_RETRY_CONFIG.baseDelay;
    this.enableLogging = config.enableLogging ?? (typeof process !== 'undefined' && process.env.NODE_ENV === 'development');

    this.requestInterceptors = [
      authRequestInterceptor,
      ...(this.enableLogging ? [loggingRequestInterceptor] : []),
      ...(config.requestInterceptors || []),
    ];

    this.responseInterceptors = [
      ...(this.enableLogging ? [loggingResponseInterceptor] : []),
      ...(config.responseInterceptors || []),
    ];

    this.errorInterceptors = [
      ...(this.enableLogging ? [loggingErrorInterceptor] : []),
      authErrorInterceptor,
      ...(config.errorInterceptors || []),
    ];
  }

  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined | null>): string {
    const url = new URL(
      endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`
    );

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private createAbortController(
    timeout: number,
    externalSignal?: AbortSignal
  ): { controller: AbortController; timeoutId: ReturnType<typeof setTimeout> } {
    const controller = new AbortController();

    if (externalSignal) {
      externalSignal.addEventListener('abort', () => {
        controller.abort();
      });
    }

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    return { controller, timeoutId };
  }

  private prepareBody(body: unknown): BodyInit | undefined {
    if (body === undefined || body === null) {
      return undefined;
    }

    if (body instanceof FormData || body instanceof Blob || typeof body === 'string') {
      return body as BodyInit;
    }

    return JSON.stringify(body);
  }

  private async parseResponse<T>(
    response: Response,
    responseType?: 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData'
  ): Promise<T> {
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return undefined as T;
    }

    if (responseType) {
      switch (responseType) {
        case 'json':
          return response.json();
        case 'text':
          return response.text() as Promise<T>;
        case 'blob':
          return response.blob() as Promise<T>;
        case 'arrayBuffer':
          return response.arrayBuffer() as Promise<T>;
        case 'formData':
          return response.formData() as Promise<T>;
      }
    }

    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      return response.json();
    }

    if (contentType.includes('text/')) {
      return response.text() as Promise<T>;
    }

    try {
      return await response.json();
    } catch {
      return response.text() as Promise<T>;
    }
  }

  private async request<TResponse, TBody = unknown>(
    endpoint: string,
    config: RequestConfig<TBody> = {}
  ): Promise<ApiResponse<TResponse>> {
    const startTime = Date.now();

    const mergedConfig: RequestConfig<TBody> = {
      method: 'GET',
      timeout: this.defaultTimeout,
      retries: this.defaultRetries,
      retryDelay: this.defaultRetryDelay,
      credentials: 'include',
      ...config,
      headers: {
        ...this.defaultHeaders,
        ...config.headers,
      },
    };

    if (mergedConfig.body instanceof FormData) {
      delete mergedConfig.headers!['Content-Type'];
    }

    let url = this.buildUrl(endpoint, mergedConfig.params);

    const interceptedRequest = await runRequestInterceptors(this.requestInterceptors, url, mergedConfig);
    url = interceptedRequest.url;
    const finalConfig = interceptedRequest.config;

    const cacheKey = finalConfig.cacheKey || RequestCache.generateKey(url, finalConfig.params);
    if (finalConfig.method === 'GET' && finalConfig.cacheTTL) {
      const cached = requestCache.get<TResponse>(cacheKey);
      if (cached) {
        return {
          data: cached,
          status: 200,
          statusText: 'OK (Cached)',
          headers: new Headers(),
          duration: Date.now() - startTime,
          cached: true,
        };
      }

      const pending = requestCache.getPendingRequest<ApiResponse<TResponse>>(cacheKey);
      if (pending) {
        return pending;
      }
    }

    const executeRequest = async (): Promise<ApiResponse<TResponse>> => {
      const { controller, timeoutId } = this.createAbortController(finalConfig.timeout!, finalConfig.signal);

      try {
        const response = await fetch(url, {
          method: finalConfig.method,
          headers: finalConfig.headers,
          body: this.prepareBody(finalConfig.body),
          signal: controller.signal,
          credentials: finalConfig.credentials,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          let errorBody: ApiErrorResponse | undefined;
          try {
            errorBody = await response.json();
          } catch {
            // Response body is not JSON
          }

          const httpError = createHttpError(response.status, response.statusText, errorBody);
          const processedError = await runErrorInterceptors(this.errorInterceptors, httpError);
          throw processedError;
        }

        const data = await this.parseResponse<TResponse>(response, finalConfig.responseType);
        const duration = Date.now() - startTime;

        let apiResponse: ApiResponse<TResponse> = {
          data,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          duration,
          cached: false,
        };

        apiResponse = await runResponseInterceptors(
          this.responseInterceptors as ResponseInterceptor<TResponse>[],
          apiResponse
        );

        if (finalConfig.method === 'GET' && finalConfig.cacheTTL) {
          requestCache.set(cacheKey, apiResponse.data, finalConfig.cacheTTL);
        }

        return apiResponse;
      } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            if (finalConfig.signal?.aborted) {
              throw new AbortError('Request was cancelled by user');
            }
            throw new TimeoutError(finalConfig.timeout!);
          }

          if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new NetworkError(undefined, error);
          }

          if (isFetchError(error)) {
            throw error;
          }

          const fetchError = new FetchError(
            error.message || 'An unexpected error occurred',
            'UNKNOWN_ERROR',
            undefined,
            undefined,
            error
          );
          const processedError = await runErrorInterceptors(this.errorInterceptors, fetchError);
          throw processedError;
        }

        throw error;
      }
    };

    const requestPromise = withRetry(executeRequest, {
      maxRetries: finalConfig.retries!,
      baseDelay: finalConfig.retryDelay!,
    });

    if (finalConfig.method === 'GET' && finalConfig.cacheTTL) {
      requestCache.setPendingRequest(cacheKey, requestPromise);
    }

    return requestPromise;
  }

  async get<TResponse>(
    endpoint: string,
    config?: Omit<RequestConfig, 'method' | 'body'>
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse>(endpoint, { ...config, method: 'GET' });
  }

  async post<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    config?: Omit<RequestConfig<TBody>, 'method' | 'body'>
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse, TBody>(endpoint, { ...config, method: 'POST', body });
  }

  async put<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    config?: Omit<RequestConfig<TBody>, 'method' | 'body'>
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse, TBody>(endpoint, { ...config, method: 'PUT', body });
  }

  async patch<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    config?: Omit<RequestConfig<TBody>, 'method' | 'body'>
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse, TBody>(endpoint, { ...config, method: 'PATCH', body });
  }

  async delete<TResponse>(endpoint: string, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse>(endpoint, { ...config, method: 'DELETE' });
  }

  async upload<TResponse>(
    endpoint: string,
    files: File | File[] | FormData,
    config?: Omit<RequestConfig, 'method' | 'body'>
  ): Promise<ApiResponse<TResponse>> {
    let formData: FormData;

    if (files instanceof FormData) {
      formData = files;
    } else {
      formData = new FormData();
      const fileArray = Array.isArray(files) ? files : [files];
      fileArray.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });
    }

    return this.request<TResponse, FormData>(endpoint, {
      ...config,
      method: 'POST',
      body: formData,
    });
  }

  async download(endpoint: string, config?: Omit<RequestConfig, 'method' | 'responseType'>): Promise<Blob> {
    const response = await this.request<Blob>(endpoint, {
      ...config,
      method: 'GET',
      responseType: 'blob',
    });
    return response.data;
  }

  invalidateCache(pattern?: string): void {
    if (pattern) {
      requestCache.clear();
    } else {
      requestCache.clear();
    }
  }
}

// Static method for cache key generation
class RequestCache {
  static generateKey(url: string, params?: Record<string, unknown>): string {
    const sortedParams = params
      ? JSON.stringify(
          Object.keys(params)
            .sort()
            .reduce((acc, key) => {
              acc[key] = params[key];
              return acc;
            }, {} as Record<string, unknown>)
        )
      : '';
    return `${url}:${sortedParams}`;
  }
}

export const fetchClient = new FetchClient({
  baseUrl: (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_API_URL : undefined) || 'http://localhost:8000/api/v1',
  timeout: parseInt(
    (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_API_TIMEOUT : undefined) || '30000'
  ),
  enableLogging:
    typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_ENABLE_REQUEST_LOGGING === 'true' : false,
});

export { FetchClient };

