/**
 * 导航服务
 * 提供全局导航方法
 */

import { router } from 'expo-router';
import { logger } from '../logger';

/**
 * 导航服务类
 */
class NavigationService {
  /**
   * 导航到指定路由
   */
  navigate(path: string, params?: any): void {
    try {
      logger.debug(`Navigating to: ${path}`, params, 'NavigationService');
      router.push({ pathname: path as any, params });
    } catch (error) {
      logger.error('Navigation failed', error, 'NavigationService');
    }
  }

  /**
   * 替换当前路由
   */
  replace(path: string, params?: any): void {
    try {
      logger.debug(`Replacing with: ${path}`, params, 'NavigationService');
      router.replace({ pathname: path as any, params });
    } catch (error) {
      logger.error('Replace navigation failed', error, 'NavigationService');
    }
  }

  /**
   * 返回上一页
   */
  goBack(): void {
    try {
      if (router.canGoBack()) {
        logger.debug('Going back', undefined, 'NavigationService');
        router.back();
      } else {
        logger.warn('Cannot go back, already at root', undefined, 'NavigationService');
      }
    } catch (error) {
      logger.error('Go back failed', error, 'NavigationService');
    }
  }

  /**
   * 判断是否可以返回
   */
  canGoBack(): boolean {
    return router.canGoBack();
  }

  /**
   * 导航到登录页
   */
  navigateToLogin(returnUrl?: string): void {
    const params = returnUrl ? { returnUrl } : undefined;
    this.replace('/(auth)/login', params);
  }

  /**
   * 导航到首页
   */
  navigateToHome(): void {
    this.replace('/(tabs)');
  }

  /**
   * 获取当前路由路径
   */
  getCurrentPath(): string {
    try {
      // Expo Router 的 segments 提供当前路径
      return router.segments?.join('/') || '/';
    } catch (error) {
      logger.error('Failed to get current path', error, 'NavigationService');
      return '/';
    }
  }
}

/**
 * 导出单例实例
 */
export const navigationService = new NavigationService();

