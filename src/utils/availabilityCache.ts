// High-Performance LRU Cache for Availability Calculations
export interface CacheEntry<T = any> {
  value: T;
  expires: number;
  accessCount: number;
  lastAccessed: number;
  size: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
  currentSize: number;
  maxSize: number;
  itemCount: number;
  hitRate: number;
  averageAccessTime: number;
}

export class AvailabilityCache {
  private cache: Map<string, CacheEntry>;
  private maxSize: number;
  private currentSize: number;
  private stats: CacheStats;
  private accessTimes: number[];
  private evictionPolicy: 'LRU' | 'LFU' | 'FIFO';

  constructor(
    maxSizeMB: number = 50,
    evictionPolicy: 'LRU' | 'LFU' | 'FIFO' = 'LRU'
  ) {
    this.cache = new Map();
    this.maxSize = maxSizeMB * 1024 * 1024; // Convert to bytes
    this.currentSize = 0;
    this.evictionPolicy = evictionPolicy;
    this.accessTimes = [];

    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      currentSize: 0,
      maxSize: this.maxSize,
      itemCount: 0,
      hitRate: 0,
      averageAccessTime: 0
    };

    // Periodic cleanup of expired entries
    setInterval(() => this.cleanupExpired(), 60000); // Every minute
  }

  /**
   * Get value from cache
   */
  get<T>(key: string): T | null {
    const startTime = performance.now();
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      this.updateStats();
      return null;
    }

    // Check expiration
    if (entry.expires < Date.now()) {
      this.delete(key);
      this.stats.misses++;
      this.updateStats();
      return null;
    }

    // Update access info
    entry.accessCount++;
    entry.lastAccessed = Date.now();

    // Move to end for LRU
    if (this.evictionPolicy === 'LRU') {
      this.cache.delete(key);
      this.cache.set(key, entry);
    }

    this.stats.hits++;
    this.recordAccessTime(performance.now() - startTime);
    this.updateStats();

    return entry.value as T;
  }

  /**
   * Set value in cache with TTL
   */
  set<T>(key: string, value: T, ttlMs: number = 300000): void {
    const size = this.estimateSize(value);
    const now = Date.now();

    // Check if we need to evict items
    if (this.currentSize + size > this.maxSize) {
      this.evict(size);
    }

    const entry: CacheEntry<T> = {
      value,
      expires: now + ttlMs,
      accessCount: 1,
      lastAccessed: now,
      size
    };

    // Remove old entry if exists
    if (this.cache.has(key)) {
      const oldEntry = this.cache.get(key)!;
      this.currentSize -= oldEntry.size;
    }

    this.cache.set(key, entry);
    this.currentSize += size;
    this.updateStats();
  }

  /**
   * Delete entry from cache
   */
  delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (entry) {
      this.currentSize -= entry.size;
      this.cache.delete(key);
      this.updateStats();
      return true;
    }
    return false;
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear();
    this.currentSize = 0;
    this.stats.evictions = 0;
    this.stats.hits = 0;
    this.stats.misses = 0;
    this.accessTimes = [];
    this.updateStats();
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Preload multiple entries
   */
  preload<T>(entries: Array<{ key: string; value: T; ttl?: number }>): void {
    entries.forEach(({ key, value, ttl }) => {
      this.set(key, value, ttl);
    });
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (entry.expires < Date.now()) {
      this.delete(key);
      return false;
    }
    return true;
  }

  /**
   * Get all keys matching a pattern
   */
  keys(pattern?: string): string[] {
    const keys = Array.from(this.cache.keys());
    if (!pattern) return keys;

    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return keys.filter(key => regex.test(key));
  }

  /**
   * Batch get multiple values
   */
  mget<T>(keys: string[]): Map<string, T | null> {
    const result = new Map<string, T | null>();
    keys.forEach(key => {
      result.set(key, this.get<T>(key));
    });
    return result;
  }

  /**
   * Batch set multiple values
   */
  mset<T>(entries: Array<{ key: string; value: T; ttl?: number }>): void {
    entries.forEach(({ key, value, ttl }) => {
      this.set(key, value, ttl);
    });
  }

  // Private methods

  private evict(requiredSpace: number): void {
    let freedSpace = 0;
    const entries = Array.from(this.cache.entries());

    // Sort based on eviction policy
    switch (this.evictionPolicy) {
      case 'LRU':
        entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
        break;
      case 'LFU':
        entries.sort((a, b) => a[1].accessCount - b[1].accessCount);
        break;
      case 'FIFO':
        // Map maintains insertion order, so no sorting needed
        break;
    }

    // Evict until we have enough space
    for (const [key, entry] of entries) {
      if (freedSpace >= requiredSpace) break;

      freedSpace += entry.size;
      this.delete(key);
      this.stats.evictions++;
    }
  }

  private cleanupExpired(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    this.cache.forEach((entry, key) => {
      if (entry.expires < now) {
        expiredKeys.push(key);
      }
    });

    expiredKeys.forEach(key => this.delete(key));
  }

  private estimateSize(value: any): number {
    // Rough estimation of object size in bytes
    const str = JSON.stringify(value);
    return str.length * 2; // 2 bytes per character (UTF-16)
  }

  private updateStats(): void {
    this.stats.currentSize = this.currentSize;
    this.stats.itemCount = this.cache.size;

    const totalAccess = this.stats.hits + this.stats.misses;
    this.stats.hitRate = totalAccess > 0
      ? (this.stats.hits / totalAccess) * 100
      : 0;
  }

  private recordAccessTime(time: number): void {
    this.accessTimes.push(time);

    // Keep only last 1000 access times
    if (this.accessTimes.length > 1000) {
      this.accessTimes.shift();
    }

    // Calculate average
    const sum = this.accessTimes.reduce((a, b) => a + b, 0);
    this.stats.averageAccessTime = sum / this.accessTimes.length;
  }

  /**
   * Warm up cache with predicted data
   */
  async warmup(
    predictions: Array<() => Promise<{ key: string; value: any; ttl?: number }>>
  ): Promise<void> {
    const results = await Promise.allSettled(
      predictions.map(fn => fn())
    );

    results.forEach(result => {
      if (result.status === 'fulfilled') {
        const { key, value, ttl } = result.value;
        this.set(key, value, ttl);
      }
    });
  }

  /**
   * Export cache state for persistence
   */
  export(): string {
    const data = {
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        value: entry.value,
        expires: entry.expires,
        accessCount: entry.accessCount
      })),
      stats: this.stats
    };
    return JSON.stringify(data);
  }

  /**
   * Import cache state from persistence
   */
  import(data: string): void {
    try {
      const parsed = JSON.parse(data);
      this.clear();

      parsed.entries.forEach((item: any) => {
        const ttl = item.expires - Date.now();
        if (ttl > 0) {
          this.set(item.key, item.value, ttl);
        }
      });

      // Restore stats
      if (parsed.stats) {
        this.stats.hits = parsed.stats.hits || 0;
        this.stats.misses = parsed.stats.misses || 0;
        this.stats.evictions = parsed.stats.evictions || 0;
      }
    } catch (error) {
      console.error('Failed to import cache:', error);
    }
  }

  /**
   * Monitor cache performance
   */
  startMonitoring(intervalMs: number = 10000): () => void {
    const interval = setInterval(() => {
      const stats = this.getStats();
      console.log('Cache Performance:', {
        hitRate: `${stats.hitRate.toFixed(2)}%`,
        avgAccessTime: `${stats.averageAccessTime.toFixed(3)}ms`,
        size: `${(stats.currentSize / 1024 / 1024).toFixed(2)}MB / ${(stats.maxSize / 1024 / 1024).toFixed(2)}MB`,
        items: stats.itemCount,
        evictions: stats.evictions
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }
}

// Singleton instance for global use
let globalCache: AvailabilityCache | null = null;

export function getGlobalCache(): AvailabilityCache {
  if (!globalCache) {
    globalCache = new AvailabilityCache(100, 'LRU'); // 100MB cache
  }
  return globalCache;
}

// Cache key generators
export const CacheKeys = {
  availability: (practitionerId: string, date: string, duration: number) =>
    `availability:${practitionerId}:${date}:${duration}`,

  practitioner: (practitionerId: string) =>
    `practitioner:${practitionerId}`,

  schedule: (practitionerId: string, week: string) =>
    `schedule:${practitionerId}:${week}`,

  bookings: (date: string) =>
    `bookings:${date}`,

  conflicts: (practitionerId: string, dateTime: string) =>
    `conflicts:${practitionerId}:${dateTime}`,

  optimization: (practitionerId: string, date: string) =>
    `optimization:${practitionerId}:${date}`
};

export default AvailabilityCache;