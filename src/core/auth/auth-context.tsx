/**
 * 认证 Context
 * 提供全局的认证状态和方法
 */

import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authService } from './auth-service';
import { authStorage } from './auth-storage';
import type { User, LoginParams, RegisterParams, AuthState, AuthActions, AuthStatus } from './types';
import { logger } from '../logger';

/**
 * 认证 Context 类型
 */
export type AuthContextType = AuthState & AuthActions;

/**
 * 创建 Context
 */
export const AuthContext = createContext<AuthContextType | null>(null);

/**
 * 认证 Provider Props
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * 认证 Provider 组件
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [status, setStatus] = useState<AuthStatus>('idle' as AuthStatus);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  /**
   * 初始化认证状态
   */
  const initAuth = useCallback(async () => {
    try {
      setStatus('loading' as AuthStatus);
      logger.debug('Initializing auth state', undefined, 'AuthContext');

      // 从存储中恢复认证状态
      const [savedToken, savedUser] = await Promise.all([
        authStorage.getAccessToken(),
        authStorage.getUser(),
      ]);

      if (savedToken && savedUser) {
        // 检查 Token 是否有效
        const isAuthenticated = await authService.checkAuth();
        
        if (isAuthenticated) {
          setToken(savedToken);
          setUser(savedUser);
          setStatus('authenticated' as AuthStatus);
          logger.info('Auth state restored', { userId: savedUser.id }, 'AuthContext');
        } else {
          // Token 无效，清除数据
          await authStorage.clearAll();
          setStatus('unauthenticated' as AuthStatus);
          logger.info('Stored token invalid, cleared', undefined, 'AuthContext');
        }
      } else {
        setStatus('unauthenticated' as AuthStatus);
        logger.debug('No stored auth data found', undefined, 'AuthContext');
      }
    } catch (error) {
      logger.error('Failed to initialize auth', error, 'AuthContext');
      setStatus('unauthenticated' as AuthStatus);
    }
  }, []);

  /**
   * 登录
   */
  const login = useCallback(async (params: LoginParams) => {
    try {
      setStatus('loading' as AuthStatus);
      logger.info('Login initiated', { username: params.username }, 'AuthContext');

      const loggedInUser = await authService.login(params);
      const newToken = await authStorage.getAccessToken();

      setUser(loggedInUser);
      setToken(newToken);
      setStatus('authenticated' as AuthStatus);

      logger.info('Login successful', { userId: loggedInUser.id }, 'AuthContext');
    } catch (error) {
      setStatus('unauthenticated' as AuthStatus);
      logger.error('Login failed', error, 'AuthContext');
      throw error;
    }
  }, []);

  /**
   * 登出
   */
  const logout = useCallback(async () => {
    try {
      logger.info('Logout initiated', undefined, 'AuthContext');

      await authService.logout();

      setUser(null);
      setToken(null);
      setStatus('unauthenticated' as AuthStatus);

      logger.info('Logout successful', undefined, 'AuthContext');
    } catch (error) {
      logger.error('Logout failed', error, 'AuthContext');
      // 即使登出失败，也清除本地状态
      setUser(null);
      setToken(null);
      setStatus('unauthenticated' as AuthStatus);
      throw error;
    }
  }, []);

  /**
   * 注册
   */
  const register = useCallback(async (params: RegisterParams) => {
    try {
      setStatus('loading' as AuthStatus);
      logger.info('Registration initiated', { username: params.username }, 'AuthContext');

      const registeredUser = await authService.register(params);
      const newToken = await authStorage.getAccessToken();

      setUser(registeredUser);
      setToken(newToken);
      setStatus('authenticated' as AuthStatus);

      logger.info('Registration successful', { userId: registeredUser.id }, 'AuthContext');
    } catch (error) {
      setStatus('unauthenticated' as AuthStatus);
      logger.error('Registration failed', error, 'AuthContext');
      throw error;
    }
  }, []);

  /**
   * 刷新 Token
   */
  const refreshToken = useCallback(async () => {
    try {
      logger.debug('Token refresh initiated', undefined, 'AuthContext');
      
      await authService.refreshToken();
      const newToken = await authStorage.getAccessToken();
      
      setToken(newToken);
      logger.info('Token refreshed successfully', undefined, 'AuthContext');
    } catch (error) {
      logger.error('Token refresh failed', error, 'AuthContext');
      // Token 刷新失败，清除状态
      setUser(null);
      setToken(null);
      setStatus('unauthenticated' as AuthStatus);
      throw error;
    }
  }, []);

  /**
   * 更新用户信息
   */
  const updateUser = useCallback(async (updates: Partial<User>) => {
    try {
      logger.debug('User update initiated', undefined, 'AuthContext');
      
      const updatedUser = await authService.updateUser(updates);
      setUser(updatedUser);
      
      logger.info('User updated successfully', { userId: updatedUser.id }, 'AuthContext');
    } catch (error) {
      logger.error('User update failed', error, 'AuthContext');
      throw error;
    }
  }, []);

  /**
   * 检查认证状态
   */
  const checkAuth = useCallback(async () => {
    await initAuth();
  }, [initAuth]);

  /**
   * 组件挂载时初始化
   */
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  /**
   * Context 值
   */
  const value = useMemo<AuthContextType>(
    () => ({
      // 状态
      status,
      user,
      token,
      isAuthenticated: status === ('authenticated' as AuthStatus),
      isLoading: status === ('loading' as AuthStatus),
      
      // 操作
      login,
      logout,
      register,
      refreshToken,
      updateUser,
      checkAuth,
    }),
    [status, user, token, login, logout, register, refreshToken, updateUser, checkAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

