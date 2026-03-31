import { AnswerType } from '../../types/game';

export interface CacheItem {
  key: string;
  answer: AnswerType;
  timestamp: number;
  expires?: number;
  metadata?: Record<string, any>;
}

export class AnswerCache {
  private cache = new Map<string, CacheItem>();
  private maxSize = 1000; // 最大缓存项数
  private defaultTTL = 24 * 60 * 60 * 1000; // 默认24小时

  /**
   * 获取缓存回答
   */
  get(key: string): AnswerType | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // 检查是否过期
    if (item.expires && Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }

    return item.answer;
  }

  /**
   * 设置缓存回答
   */
  set(key: string, answer: AnswerType, ttl?: number): void {
    // 如果缓存已满，删除最旧的项
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.findOldestKey();
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    const expires = ttl ? Date.now() + ttl : Date.now() + this.defaultTTL;
    this.cache.set(key, {
      key,
      answer,
      timestamp: Date.now(),
      expires,
      metadata: { source: 'cache' }
    });
  }

  /**
   * 删除缓存项
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * 清空缓存
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * 获取缓存统计信息
   */
  getStats(): { size: number; hitRate: number } {
    // 简单统计，实际实现可以更复杂
    return {
      size: this.cache.size,
      hitRate: 0 // 需要记录命中率
    };
  }

  /**
   * 查找最旧的缓存键
   */
  private findOldestKey(): string | null {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (item.timestamp < oldestTime) {
        oldestTime = item.timestamp;
        oldestKey = key;
      }
    }

    return oldestKey;
  }

  /**
   * 批量获取缓存
   */
  bulkGet(keys: string[]): Map<string, AnswerType> {
    const results = new Map<string, AnswerType>();
    for (const key of keys) {
      const answer = this.get(key);
      if (answer) {
        results.set(key, answer);
      }
    }
    return results;
  }

  /**
   * 批量设置缓存
   */
  bulkSet(items: Array<{ key: string; answer: AnswerType; ttl?: number }>): void {
    for (const item of items) {
      this.set(item.key, item.answer, item.ttl);
    }
  }
}