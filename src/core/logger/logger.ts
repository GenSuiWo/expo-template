/**
 * 日志系统
 * 提供统一的日志记录功能
 * 开发环境输出到控制台，生产环境可接入日志服务
 */

import { LOG_CONFIG } from '../config/app-config';

/**
 * 日志级别
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

/**
 * 日志级别优先级
 */
const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
};

/**
 * 日志条目接口
 */
export interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: number;
  module?: string;
}

/**
 * 日志服务类
 */
class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = LOG_CONFIG.maxSize;
  private currentLevel: LogLevel;

  constructor() {
    this.currentLevel = LOG_CONFIG.level === 'debug' ? LogLevel.DEBUG : LogLevel.ERROR;
  }

  /**
   * 设置日志级别
   */
  setLevel(level: LogLevel): void {
    this.currentLevel = level;
  }

  /**
   * 检查是否应该记录该级别的日志
   */
  private shouldLog(level: LogLevel): boolean {
    if (!LOG_CONFIG.enabled) {
      return false;
    }
    return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[this.currentLevel];
  }

  /**
   * 格式化日志消息
   */
  private formatMessage(level: LogLevel, message: string, module?: string): string {
    const timestamp = new Date().toISOString();
    const moduleTag = module ? `[${module}]` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${moduleTag} ${message}`;
  }

  /**
   * 记录日志
   */
  private log(level: LogLevel, message: string, data?: any, module?: string): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const logEntry: LogEntry = {
      level,
      message,
      data,
      timestamp: Date.now(),
      module,
    };

    // 添加到日志队列
    this.logs.push(logEntry);
    
    // 限制日志数量
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // 输出到控制台
    const formattedMessage = this.formatMessage(level, message, module);
    
    switch (level) {
      case LogLevel.DEBUG:
        console.log(formattedMessage, data || '');
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, data || '');
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, data || '');
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage, data || '');
        break;
    }
  }

  /**
   * Debug 日志
   */
  debug(message: string, data?: any, module?: string): void {
    this.log(LogLevel.DEBUG, message, data, module);
  }

  /**
   * Info 日志
   */
  info(message: string, data?: any, module?: string): void {
    this.log(LogLevel.INFO, message, data, module);
  }

  /**
   * Warning 日志
   */
  warn(message: string, data?: any, module?: string): void {
    this.log(LogLevel.WARN, message, data, module);
  }

  /**
   * Error 日志
   */
  error(message: string, error?: Error | any, module?: string): void {
    const errorData = error instanceof Error 
      ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        }
      : error;
    
    this.log(LogLevel.ERROR, message, errorData, module);
  }

  /**
   * 获取所有日志
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * 清除日志
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * 导出日志（用于上报）
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * 创建模块日志器
   * 返回一个绑定了模块名的日志器
   */
  createModuleLogger(moduleName: string) {
    return {
      debug: (message: string, data?: any) => this.debug(message, data, moduleName),
      info: (message: string, data?: any) => this.info(message, data, moduleName),
      warn: (message: string, data?: any) => this.warn(message, data, moduleName),
      error: (message: string, error?: Error | any) => this.error(message, error, moduleName),
    };
  }
}

/**
 * 导出单例实例
 */
export const logger = new Logger();

/**
 * 导出便捷方法
 */
export const log = {
  debug: (message: string, data?: any, module?: string) => logger.debug(message, data, module),
  info: (message: string, data?: any, module?: string) => logger.info(message, data, module),
  warn: (message: string, data?: any, module?: string) => logger.warn(message, data, module),
  error: (message: string, error?: Error | any, module?: string) => logger.error(message, error, module),
  module: (moduleName: string) => logger.createModuleLogger(moduleName),
};

