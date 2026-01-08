/**
 * 认证服务
 * 提供登录、登出、注册、Token 刷新等功能
 */

import { http } from '../network/http-client';
import { API_ENDPOINTS } from '../config/api-config';
import { authStorage } from './auth-storage';
import { setTokenGetter, setTokenRefresher, setLogoutHandler } from '../network/interceptors';
import type { LoginParams, LoginResponse, RegisterParams, User, TokenInfo } from './types';
import { logger } from '../logger';
import { errorTracker } from '../logger/error-tracker';

/**
 * 认证服务类
 */
class AuthService {
  constructor() {
    // 初始化网络拦截器的 Token 处理
    this.setupNetworkInterceptors();
  }

  /**
   * 设置网络拦截器
   */
  private setupNetworkInterceptors(): void {
    // 设置 Token 获取器
    setTokenGetter(async () => {
      return await authStorage.getAccessToken();
    });

    // 设置 Token 刷新器
    setTokenRefresher(async () => {
      await this.refreshToken();
    });

    // 设置登出处理器
    setLogoutHandler(async () => {
      await this.logout();
    });
  }

  /**
   * 登录
   */
  async login(params: LoginParams): Promise<User> {
    try {
      logger.info('Attempting login', { username: params.username }, 'AuthService');
      
      // 调用登录 API
      const response = await http.post<LoginResponse>(
        API_ENDPOINTS.auth.login,
        params
      );

      // 保存 Token 和用户信息
      await authStorage.saveToken(response.token);
      await authStorage.saveUser(response.user);

      logger.info('Login successful', { userId: response.user.id }, 'AuthService');
      
      return response.user;
    } catch (error) {
      logger.error('Login failed', error, 'AuthService');
      errorTracker.trackApiError('登录失败', error as Error);
      throw error;
    }
  }

  /**
   * 登出
   */
  async logout(): Promise<void> {
    try {
      logger.info('Attempting logout', undefined, 'AuthService');
      
      // 调用登出 API（可选，根据后端要求）
      try {
        await http.post(API_ENDPOINTS.auth.logout);
      } catch (error) {
        // 登出 API 失败不影响本地清理
        logger.warn('Logout API call failed, continuing with local cleanup', error, 'AuthService');
      }

      // 清除本地认证数据
      await authStorage.clearAll();

      logger.info('Logout successful', undefined, 'AuthService');
    } catch (error) {
      logger.error('Logout failed', error, 'AuthService');
      errorTracker.trackApiError('登出失败', error as Error);
      throw error;
    }
  }

  /**
   * 注册
   */
  async register(params: RegisterParams): Promise<User> {
    try {
      logger.info('Attempting registration', { username: params.username }, 'AuthService');
      
      // 调用注册 API
      const response = await http.post<LoginResponse>(
        API_ENDPOINTS.auth.register,
        params
      );

      // 保存 Token 和用户信息
      await authStorage.saveToken(response.token);
      await authStorage.saveUser(response.user);

      logger.info('Registration successful', { userId: response.user.id }, 'AuthService');
      
      return response.user;
    } catch (error) {
      logger.error('Registration failed', error, 'AuthService');
      errorTracker.trackApiError('注册失败', error as Error);
      throw error;
    }
  }

  /**
   * 刷新 Token
   */
  async refreshToken(): Promise<void> {
    try {
      logger.info('Attempting to refresh token', undefined, 'AuthService');
      
      const refreshToken = await authStorage.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // 调用刷新 Token API
      const response = await http.post<TokenInfo>(
        API_ENDPOINTS.auth.refreshToken,
        { refreshToken }
      );

      // 保存新的 Token
      await authStorage.saveToken(response);

      logger.info('Token refreshed successfully', undefined, 'AuthService');
    } catch (error) {
      logger.error('Token refresh failed', error, 'AuthService');
      errorTracker.trackApiError('Token刷新失败', error as Error);
      
      // Token 刷新失败，清除所有认证数据
      await authStorage.clearAll();
      
      throw error;
    }
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      // 先从本地获取
      const localUser = await authStorage.getUser();
      if (!localUser) {
        return null;
      }

      // 可选：从服务器获取最新用户信息
      try {
        const serverUser = await http.get<User>(API_ENDPOINTS.user.profile);
        await authStorage.saveUser(serverUser);
        return serverUser;
      } catch (error) {
        // 获取服务器用户信息失败，使用本地缓存
        logger.warn('Failed to fetch user from server, using cached data', error, 'AuthService');
        return localUser;
      }
    } catch (error) {
      logger.error('Failed to get current user', error, 'AuthService');
      return null;
    }
  }

  /**
   * 更新用户信息
   */
  async updateUser(updates: Partial<User>): Promise<User> {
    try {
      logger.info('Attempting to update user', undefined, 'AuthService');
      
      // 调用更新 API
      const updatedUser = await http.put<User>(
        API_ENDPOINTS.user.update,
        updates
      );

      // 更新本地用户信息
      await authStorage.saveUser(updatedUser);

      logger.info('User updated successfully', { userId: updatedUser.id }, 'AuthService');
      
      return updatedUser;
    } catch (error) {
      logger.error('User update failed', error, 'AuthService');
      errorTracker.trackApiError('用户信息更新失败', error as Error);
      throw error;
    }
  }

  /**
   * 检查认证状态
   */
  async checkAuth(): Promise<boolean> {
    try {
      const token = await authStorage.getAccessToken();
      if (!token) {
        return false;
      }

      // 检查 Token 是否过期
      const isExpired = await authStorage.isTokenExpired();
      if (isExpired) {
        // 尝试刷新 Token
        try {
          await this.refreshToken();
          return true;
        } catch (error) {
          return false;
        }
      }

      return true;
    } catch (error) {
      logger.error('Auth check failed', error, 'AuthService');
      return false;
    }
  }

  /**
   * 重置密码
   */
  async resetPassword(params: {
    email?: string;
    phone?: string;
    code?: string;
    newPassword: string;
  }): Promise<void> {
    try {
      logger.info('Attempting password reset', undefined, 'AuthService');
      
      await http.post(API_ENDPOINTS.auth.resetPassword, params);
      
      logger.info('Password reset successful', undefined, 'AuthService');
    } catch (error) {
      logger.error('Password reset failed', error, 'AuthService');
      errorTracker.trackApiError('密码重置失败', error as Error);
      throw error;
    }
  }
}

/**
 * 导出单例实例
 */
export const authService = new AuthService();

