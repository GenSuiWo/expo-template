/**
 * 缓存存储服务
 * 用于存储非敏感数据和缓存
 * 使用 AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { CACHE_TIME } from '../config/app-config';
import type { StorageKey } from './storage-keys';

/**
 * 缓存项接口
 */
interface CacheItem<T = any> {
  value: T;
  expireTime?: number;  // 过期时间戳
}

/**
 * 缓存存储服务类
 */
class CacheStorageService {
  /**
   * 保存数据到缓存
   */
  async setItem(key: StorageKey, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`[CacheStorage] Error saving ${key}:`, error);
      throw error;
    }
  }

  /**
   * 从缓存读取数据
   */
  async getItem(key: StorageKey): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`[CacheStorage] Error reading ${key}:`, error);
      return null;
    }
  }

  /**
   * 从缓存删除数据
   */
  async removeItem(key: StorageKey): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`[CacheStorage] Error removing ${key}:`, error);
      throw error;
    }
  }

  /**
   * 保存对象到缓存（自动序列化）
   */
  async setObject<T = any>(key: StorageKey, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await this.setItem(key, jsonValue);
    } catch (error) {
      console.error(`[CacheStorage] Error saving object ${key}:`, error);
      throw error;
    }
  }

  /**
   * 从缓存读取对象（自动反序列化）
   */
  async getObject<T = any>(key: StorageKey): Promise<T | null> {
    try {
      const jsonValue = await this.getItem(key);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`[CacheStorage] Error reading object ${key}:`, error);
      return null;
    }
  }

  /**
   * 保存带过期时间的缓存
   */
  async setCached<T = any>(
    key: StorageKey,
    value: T,
    ttl: number = CACHE_TIME.medium
  ): Promise<void> {
    try {
      const cacheItem: CacheItem<T> = {
        value,
        expireTime: Date.now() + ttl,
      };
      await this.setObject(key, cacheItem);
    } catch (error) {
      console.error(`[CacheStorage] Error saving cached ${key}:`, error);
      throw error;
    }
  }

  /**
   * 读取带过期时间的缓存
   * 如果过期则自动删除并返回 null
   */
  async getCached<T = any>(key: StorageKey): Promise<T | null> {
    try {
      const cacheItem = await this.getObject<CacheItem<T>>(key);
      
      if (!cacheItem) {
        return null;
      }

      // 检查是否过期
      if (cacheItem.expireTime && Date.now() > cacheItem.expireTime) {
        await this.removeItem(key);
        return null;
      }

      return cacheItem.value;
    } catch (error) {
      console.error(`[CacheStorage] Error reading cached ${key}:`, error);
      return null;
    }
  }

  /**
   * 批量保存
   */
  async multiSet(pairs: Array<[StorageKey, string]>): Promise<void> {
    try {
      await AsyncStorage.multiSet(pairs);
    } catch (error) {
      console.error('[CacheStorage] Error in multiSet:', error);
      throw error;
    }
  }

  /**
   * 批量读取
   */
  async multiGet(keys: StorageKey[]): Promise<readonly [string, string | null][]> {
    try {
      return await AsyncStorage.multiGet(keys);
    } catch (error) {
      console.error('[CacheStorage] Error in multiGet:', error);
      throw error;
    }
  }

  /**
   * 批量删除
   */
  async multiRemove(keys: StorageKey[]): Promise<void> {
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('[CacheStorage] Error in multiRemove:', error);
      throw error;
    }
  }

  /**
   * 获取所有键
   */
  async getAllKeys(): Promise<readonly string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('[CacheStorage] Error getting all keys:', error);
      return [];
    }
  }

  /**
   * 清除所有缓存
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('[CacheStorage] Error clearing storage:', error);
      throw error;
    }
  }

  /**
   * 清除过期的缓存
   */
  async clearExpired(): Promise<void> {
    try {
      const allKeys = await this.getAllKeys();
      const keysToRemove: string[] = [];

      for (const key of allKeys) {
        const cacheItem = await this.getObject<CacheItem>(key);
        if (cacheItem?.expireTime && Date.now() > cacheItem.expireTime) {
          keysToRemove.push(key);
        }
      }

      if (keysToRemove.length > 0) {
        await this.multiRemove(keysToRemove);
        console.log(`[CacheStorage] Cleared ${keysToRemove.length} expired items`);
      }
    } catch (error) {
      console.error('[CacheStorage] Error clearing expired cache:', error);
    }
  }
}

/**
 * 导出单例实例
 */
export const cacheStorage = new CacheStorageService();

