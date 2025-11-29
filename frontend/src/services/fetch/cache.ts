/**
 * Request cache for deduplication
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class RequestCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private pendingRequests = new Map<string, Promise<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  getPendingRequest<T>(key: string): Promise<T> | null {
    return this.pendingRequests.get(key) as Promise<T> | null;
  }

  setPendingRequest<T>(key: string, promise: Promise<T>): void {
    this.pendingRequests.set(key, promise);

    promise.finally(() => {
      this.pendingRequests.delete(key);
    });
  }

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

export const requestCache = new RequestCache();

if (typeof window !== 'undefined') {
  setInterval(() => {
    requestCache.clearExpired();
  }, 60000);
}

