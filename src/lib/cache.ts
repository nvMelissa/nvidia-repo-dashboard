// Simple cache utility for GitHub data
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class DataCache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  isStale(key: string, staleTime: number = 60000): boolean {
    const entry = this.cache.get(key);
    if (!entry) return true;
    return Date.now() - entry.timestamp > staleTime;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const dataCache = new DataCache();

// Cache keys
export const CACHE_KEYS = {
  ISSUES: (repo: string) => `issues:${repo}`,
  METRICS: (repo: string) => `metrics:${repo}`,
  COMBINED_METRICS: 'combined:metrics',
  PROGRESSION_DATA: 'progression:data'
} as const;