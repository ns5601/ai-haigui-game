// 存储相关类型定义

// IndexedDB 数据库架构
export interface DBSchema {
  name: string;
  version: number;
  stores: {
    [storeName: string]: {
      keyPath: string;
      indexes?: {
        name: string;
        keyPath: string | string[];
        unique?: boolean;
        multiEntry?: boolean;
      }[];
    };
  };
}

// 存储操作结果
export interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

// 缓存项
export interface CacheItem {
  key: string;
  value: any;
  timestamp: number;
  expires?: number; // 过期时间戳
  metadata?: Record<string, any>;
}

// 同步状态
export interface SyncStatus {
  lastSync: number;
  pendingChanges: number;
  syncState: 'idle' | 'syncing' | 'error';
  error?: string;
}