/**
 * Request/response interceptors
 */
import {
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
  RequestConfig,
  ApiResponse,
} from './types';
import { FetchError, UnauthorizedError } from './errors';

export const authRequestInterceptor: RequestInterceptor = (url, config) => {
  if (config.skipAuth) {
    return { url, config };
  }

  const token = getAuthToken();

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return { url, config };
};

export const loggingRequestInterceptor: RequestInterceptor = (url, config) => {
  if (process.env.NEXT_PUBLIC_ENABLE_REQUEST_LOGGING === 'true') {
    console.log(`🚀 [${config.method || 'GET'}] ${url}`, {
      headers: config.headers,
      body: config.body,
      params: config.params,
    });
  }

  return { url, config };
};

export const loggingResponseInterceptor: ResponseInterceptor = (response) => {
  if (process.env.NEXT_PUBLIC_ENABLE_REQUEST_LOGGING === 'true') {
    console.log(`✅ [${response.status}] Response received in ${response.duration}ms`, {
      data: response.data,
      cached: response.cached,
    });
  }

  return response;
};

export const loggingErrorInterceptor: ErrorInterceptor = (error) => {
  if (process.env.NEXT_PUBLIC_ENABLE_REQUEST_LOGGING === 'true') {
    console.error(`❌ Request failed:`, error.toJSON());
  }

  return error;
};

export const authErrorInterceptor: ErrorInterceptor = (error) => {
  if (error instanceof UnauthorizedError) {
    clearAuthToken();

    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        sessionStorage.setItem('redirectAfterLogin', currentPath);
        window.location.href = '/login';
      }
    }
  }

  return error;
};

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

function clearAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
}

export function runRequestInterceptors(
  interceptors: RequestInterceptor[],
  url: string,
  config: RequestConfig
): Promise<{ url: string; config: RequestConfig }> {
  return interceptors.reduce(
    async (promise, interceptor) => {
      const result = await promise;
      return interceptor(result.url, result.config);
    },
    Promise.resolve({ url, config })
  );
}

export function runResponseInterceptors<T>(
  interceptors: ResponseInterceptor<T>[],
  response: ApiResponse<T>
): Promise<ApiResponse<T>> {
  return interceptors.reduce(
    async (promise, interceptor) => {
      const result = await promise;
      return interceptor(result) as Promise<ApiResponse<T>>;
    },
    Promise.resolve(response)
  );
}

export function runErrorInterceptors(interceptors: ErrorInterceptor[], error: FetchError): Promise<FetchError> {
  return interceptors.reduce(
    async (promise, interceptor) => {
      const result = await promise;
      return interceptor(result);
    },
    Promise.resolve(error)
  );
}

