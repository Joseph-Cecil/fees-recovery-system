/**
 * Base DAL class
 */
import { fetchClient, ApiResponse, RequestConfig } from '@/services/fetch';
import { PaginatedResponse, PaginationMeta } from '@/dto/common.dto';

export abstract class BaseDAL {
  protected readonly endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  }

  protected path(id?: string, suffix?: string): string {
    let path = this.endpoint;
    if (id) path += `/${id}`;
    if (suffix) path += `/${suffix}`;
    return path;
  }

  protected async get<T>(path: string, config?: Omit<RequestConfig, 'method'>): Promise<T> {
    const response = await fetchClient.get<T>(path, config);
    return response.data;
  }

  protected async post<T, B = unknown>(
    path: string,
    body?: B,
    config?: Omit<RequestConfig<B>, 'method' | 'body'>
  ): Promise<T> {
    const response = await fetchClient.post<T, B>(path, body, config);
    return response.data;
  }

  protected async patch<T, B = unknown>(
    path: string,
    body?: B,
    config?: Omit<RequestConfig<B>, 'method' | 'body'>
  ): Promise<T> {
    const response = await fetchClient.patch<T, B>(path, body, config);
    return response.data;
  }

  protected async put<T, B = unknown>(
    path: string,
    body?: B,
    config?: Omit<RequestConfig<B>, 'method' | 'body'>
  ): Promise<T> {
    const response = await fetchClient.put<T, B>(path, body, config);
    return response.data;
  }

  protected async delete<T = void>(path: string, config?: Omit<RequestConfig, 'method'>): Promise<T> {
    const response = await fetchClient.delete<T>(path, config);
    return response.data;
  }

  protected toPaginatedResponse<T>(
    response: { data: T[]; pagination: PaginationMeta } | { items: T[]; meta: PaginationMeta }
  ): PaginatedResponse<T> {
    if ('data' in response) {
      return {
        data: response.data,
        pagination: response.pagination,
      };
    }
    return {
      data: response.items,
      pagination: response.meta,
    };
  }
}

