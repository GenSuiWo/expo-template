/**
 * 错误追踪服务
 * 用于捕获和上报应用错误
 */

import { isDevelopment } from '../config/env';
import { logger } from './logger';

/**
 * 错误类型
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  RUNTIME = 'RUNTIME',
  RENDER = 'RENDER',
  API = 'API',
  STORAGE = 'STORAGE',
  PERMISSION = 'PERMISSION',
  UNKNOWN = 'UNKNOWN',
}

/**
 * 错误信息接口
 */
export interface ErrorInfo {
  type: ErrorType;
  message: string;
  error?: Error;
  context?: any;
  timestamp: number;
  userId?: string;
  deviceInfo?: any;
}

/**
 * 错误追踪服务类
 */
class ErrorTracker {
  private errors: ErrorInfo[] = [];
  private maxErrors = 50;
  private errorCallbacks: Array<(errorInfo: ErrorInfo) => void> = [];

  /**
   * 初始化错误追踪
   */
  init(): void {
    // 在生产环境可以集成第三方错误追踪服务
    // 例如：Sentry, Bugsnag 等
    if (!isDevelopment()) {
      // TODO: 集成错误追踪服务
      logger.info('Error tracker initialized for production');
    }
  }

  /**
   * 追踪错误
   */
  trackError(
    type: ErrorType,
    message: string,
    error?: Error,
    context?: any
  ): void {
    const errorInfo: ErrorInfo = {
      type,
      message,
      error,
      context,
      timestamp: Date.now(),
    };

    // 添加到错误队列
    this.errors.push(errorInfo);
    
    // 限制错误数量
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // 记录到日志
    logger.error(`[${type}] ${message}`, error, 'ErrorTracker');

    // 触发错误回调
    this.errorCallbacks.forEach(callback => {
      try {
        callback(errorInfo);
      } catch (e) {
        console.error('Error in error callback:', e);
      }
    });

    // 在生产环境上报错误
    if (!isDevelopment()) {
      this.reportError(errorInfo);
    }
  }

  /**
   * 追踪网络错误
   */
  trackNetworkError(message: string, error?: Error, context?: any): void {
    this.trackError(ErrorType.NETWORK, message, error, context);
  }

  /**
   * 追踪运行时错误
   */
  trackRuntimeError(message: string, error?: Error, context?: any): void {
    this.trackError(ErrorType.RUNTIME, message, error, context);
  }

  /**
   * 追踪渲染错误
   */
  trackRenderError(message: string, error?: Error, context?: any): void {
    this.trackError(ErrorType.RENDER, message, error, context);
  }

  /**
   * 追踪 API 错误
   */
  trackApiError(message: string, error?: Error, context?: any): void {
    this.trackError(ErrorType.API, message, error, context);
  }

  /**
   * 追踪存储错误
   */
  trackStorageError(message: string, error?: Error, context?: any): void {
    this.trackError(ErrorType.STORAGE, message, error, context);
  }

  /**
   * 追踪权限错误
   */
  trackPermissionError(message: string, error?: Error, context?: any): void {
    this.trackError(ErrorType.PERMISSION, message, error, context);
  }

  /**
   * 上报错误（生产环境）
   */
  private async reportError(errorInfo: ErrorInfo): Promise<void> {
    try {
      // TODO: 实现错误上报逻辑
      // 可以发送到自己的服务器或第三方服务
      logger.debug('Reporting error:', errorInfo, 'ErrorTracker');
    } catch (e) {
      console.error('Failed to report error:', e);
    }
  }

  /**
   * 注册错误回调
   */
  onError(callback: (errorInfo: ErrorInfo) => void): () => void {
    this.errorCallbacks.push(callback);
    
    // 返回取消订阅函数
    return () => {
      const index = this.errorCallbacks.indexOf(callback);
      if (index > -1) {
        this.errorCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * 获取所有错误
   */
  getErrors(): ErrorInfo[] {
    return [...this.errors];
  }

  /**
   * 清除错误
   */
  clearErrors(): void {
    this.errors = [];
  }

  /**
   * 导出错误（用于调试）
   */
  exportErrors(): string {
    return JSON.stringify(this.errors, null, 2);
  }
}

/**
 * 导出单例实例
 */
export const errorTracker = new ErrorTracker();

/**
 * 便捷方法
 */
export const trackError = {
  network: (message: string, error?: Error, context?: any) => 
    errorTracker.trackNetworkError(message, error, context),
  runtime: (message: string, error?: Error, context?: any) => 
    errorTracker.trackRuntimeError(message, error, context),
  render: (message: string, error?: Error, context?: any) => 
    errorTracker.trackRenderError(message, error, context),
  api: (message: string, error?: Error, context?: any) => 
    errorTracker.trackApiError(message, error, context),
  storage: (message: string, error?: Error, context?: any) => 
    errorTracker.trackStorageError(message, error, context),
  permission: (message: string, error?: Error, context?: any) => 
    errorTracker.trackPermissionError(message, error, context),
};

