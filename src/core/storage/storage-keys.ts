/**
 * 存储键统一管理
 * 集中管理所有存储键，避免硬编码和重复
 */

import { STORAGE_PREFIX } from '../config/app-config';

/**
 * 生成带前缀的存储键
 */
const createKey = (key: string): string => `${STORAGE_PREFIX}${key}`;

/**
 * 存储键常量
 */
export const STORAGE_KEYS = {
  // 认证相关
  AUTH_TOKEN: createKey('auth_token'),
  REFRESH_TOKEN: createKey('refresh_token'),
  TOKEN_EXPIRE_TIME: createKey('token_expire_time'),
  
  // 用户相关
  USER_INFO: createKey('user_info'),
  USER_SETTINGS: createKey('user_settings'),
  USER_PREFERENCES: createKey('user_preferences'),
  
  // 应用设置
  THEME_MODE: createKey('theme_mode'),
  LANGUAGE: createKey('language'),
  FIRST_LAUNCH: createKey('first_launch'),
  APP_VERSION: createKey('app_version'),
  
  // 缓存相关
  CACHE_PREFIX: createKey('cache_'),
  
  // 其他
  LAST_SYNC_TIME: createKey('last_sync_time'),
  DEVICE_ID: createKey('device_id'),
} as const;

/**
 * 生成缓存键
 */
export const createCacheKey = (key: string): string => {
  return `${STORAGE_KEYS.CACHE_PREFIX}${key}`;
};

/**
 * 存储键类型
 */
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS] | string;

