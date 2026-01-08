/**
 * 认证存储服务
 * 管理 Token 和用户信息的持久化
 */

import { logger } from '../logger';
import { cacheStorage } from '../storage/cache-storage';
import { secureStorage } from '../storage/secure-storage';
import { STORAGE_KEYS } from '../storage/storage-keys';
import type { TokenInfo, User } from './types';

/**
 * 认证存储服务类
 */
class AuthStorage {
  /**
   * 保存 Token 信息
   */
  async saveToken(tokenInfo: TokenInfo): Promise<void> {
    try {
      // Access Token 使用安全存储
      await secureStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, tokenInfo.accessToken);
      
      // Refresh Token（如果有）使用安全存储
      if (tokenInfo.refreshToken) {
        await secureStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokenInfo.refreshToken);
      }
      
      // 保存过期时间
      if (tokenInfo.expiresIn) {
        const expireTime = Date.now() + tokenInfo.expiresIn * 1000;
        await cacheStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRE_TIME, expireTime.toString());
      }
      
      logger.debug('Token saved successfully', undefined, 'AuthStorage');
    } catch (error) {
      logger.error('Failed to save token', error, 'AuthStorage');
      throw error;
    }
  }

  /**
   * 获取 Access Token
   */
  async getAccessToken(): Promise<string | null> {
    try {
      return await secureStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      logger.error('Failed to get access token', error, 'AuthStorage');
      return null;
    }
  }

  /**
   * 获取 Refresh Token
   */
  async getRefreshToken(): Promise<string | null> {
    try {
      return await secureStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      logger.error('Failed to get refresh token', error, 'AuthStorage');
      return null;
    }
  }

  /**
   * 检查 Token 是否过期
   */
  async isTokenExpired(): Promise<boolean> {
    try {
      const expireTimeStr = await cacheStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRE_TIME);
      if (!expireTimeStr) {
        return false; // 没有过期时间信息，假设未过期
      }
      
      const expireTime = parseInt(expireTimeStr, 10);
      const now = Date.now();
      
      // 提前 5 分钟判定为过期（预留刷新时间）
      const bufferTime = 5 * 60 * 1000;
      return now >= expireTime - bufferTime;
    } catch (error) {
      logger.error('Failed to check token expiration', error, 'AuthStorage');
      return false;
    }
  }

  /**
   * 清除 Token
   */
  async clearToken(): Promise<void> {
    try {
      await secureStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await secureStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      await cacheStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRE_TIME);
      logger.debug('Token cleared successfully', undefined, 'AuthStorage');
    } catch (error) {
      logger.error('Failed to clear token', error, 'AuthStorage');
      throw error;
    }
  }

  /**
   * 保存用户信息
   */
  async saveUser(user: User): Promise<void> {
    try {
      await cacheStorage.setObject(STORAGE_KEYS.USER_INFO, user);
      logger.debug('User info saved successfully', { userId: user.id }, 'AuthStorage');
    } catch (error) {
      logger.error('Failed to save user info', error, 'AuthStorage');
      throw error;
    }
  }

  /**
   * 获取用户信息
   */
  async getUser(): Promise<User | null> {
    try {
      return await cacheStorage.getObject<User>(STORAGE_KEYS.USER_INFO);
    } catch (error) {
      logger.error('Failed to get user info', error, 'AuthStorage');
      return null;
    }
  }

  /**
   * 更新用户信息
   */
  async updateUser(updates: Partial<User>): Promise<void> {
    try {
      const currentUser = await this.getUser();
      if (!currentUser) {
        throw new Error('No user info found');
      }
      
      const updatedUser = { ...currentUser, ...updates };
      await this.saveUser(updatedUser);
      logger.debug('User info updated successfully', { userId: updatedUser.id }, 'AuthStorage');
    } catch (error) {
      logger.error('Failed to update user info', error, 'AuthStorage');
      throw error;
    }
  }

  /**
   * 清除用户信息
   */
  async clearUser(): Promise<void> {
    try {
      await cacheStorage.removeItem(STORAGE_KEYS.USER_INFO);
      logger.debug('User info cleared successfully', undefined, 'AuthStorage');
    } catch (error) {
      logger.error('Failed to clear user info', error, 'AuthStorage');
      throw error;
    }
  }

  /**
   * 清除所有认证数据
   */
  async clearAll(): Promise<void> {
    try {
      await Promise.all([
        this.clearToken(),
        this.clearUser(),
      ]);
      logger.info('All auth data cleared', undefined, 'AuthStorage');
    } catch (error) {
      logger.error('Failed to clear all auth data', error, 'AuthStorage');
      throw error;
    }
  }
}

/**
 * 导出单例实例
 */
export const authStorage = new AuthStorage();

