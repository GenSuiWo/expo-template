/**
 * 安全存储服务
 * 用于存储敏感数据（Token、密码等）
 * 使用 expo-secure-store 加密存储
 */

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import type { StorageKey } from './storage-keys';

/**
 * 安全存储选项
 */
interface SecureStorageOptions {
  keychainService?: string;
  keychainAccessible?: number;
}

/**
 * 安全存储服务类
 */
class SecureStorageService {
  /**
   * 保存数据到安全存储
   */
  async setItem(
    key: StorageKey,
    value: string,
    options?: SecureStorageOptions
  ): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        // Web 平台使用 localStorage（注意：不加密）
        localStorage.setItem(key, value);
        return;
      }
      
      await SecureStore.setItemAsync(key, value, options);
    } catch (error) {
      console.error(`[SecureStorage] Error saving ${key}:`, error);
      throw error;
    }
  }

  /**
   * 从安全存储读取数据
   */
  async getItem(
    key: StorageKey,
    options?: SecureStorageOptions
  ): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        // Web 平台使用 localStorage
        return localStorage.getItem(key);
      }
      
      return await SecureStore.getItemAsync(key, options);
    } catch (error) {
      console.error(`[SecureStorage] Error reading ${key}:`, error);
      return null;
    }
  }

  /**
   * 从安全存储删除数据
   */
  async removeItem(
    key: StorageKey,
    options?: SecureStorageOptions
  ): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
        return;
      }
      
      await SecureStore.deleteItemAsync(key, options);
    } catch (error) {
      console.error(`[SecureStorage] Error removing ${key}:`, error);
      throw error;
    }
  }

  /**
   * 保存对象到安全存储（自动序列化）
   */
  async setObject<T = any>(
    key: StorageKey,
    value: T,
    options?: SecureStorageOptions
  ): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await this.setItem(key, jsonValue, options);
    } catch (error) {
      console.error(`[SecureStorage] Error saving object ${key}:`, error);
      throw error;
    }
  }

  /**
   * 从安全存储读取对象（自动反序列化）
   */
  async getObject<T = any>(
    key: StorageKey,
    options?: SecureStorageOptions
  ): Promise<T | null> {
    try {
      const jsonValue = await this.getItem(key, options);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`[SecureStorage] Error reading object ${key}:`, error);
      return null;
    }
  }

  /**
   * 清除所有安全存储数据（谨慎使用）
   */
  async clear(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.clear();
        return;
      }
      
      // 注意：expo-secure-store 没有清除所有的 API
      // 需要手动删除已知的键
      console.warn('[SecureStorage] Clear all is not fully supported on native platforms');
    } catch (error) {
      console.error('[SecureStorage] Error clearing storage:', error);
      throw error;
    }
  }
}

/**
 * 导出单例实例
 */
export const secureStorage = new SecureStorageService();

