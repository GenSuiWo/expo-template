/**
 * 应用配置管理
 * 管理应用级别的配置项
 */

import { isDevelopment } from './env';

/**
 * 应用主题配置
 */
export const APP_THEME = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5AC8FA',
};

/**
 * 分页配置
 */
export const PAGINATION = {
  pageSize: 20,        // 每页数量
  maxPageSize: 100,    // 最大每页数量
};

/**
 * 缓存配置（毫秒）
 */
export const CACHE_TIME = {
  short: 5 * 60 * 1000,      // 5 分钟
  medium: 30 * 60 * 1000,    // 30 分钟
  long: 24 * 60 * 60 * 1000, // 24 小时
};

/**
 * 日志配置
 */
export const LOG_CONFIG = {
  enabled: isDevelopment(),           // 是否启用日志
  level: isDevelopment() ? 'debug' : 'error', // 日志级别
  maxSize: 100,                       // 最大日志条数
  uploadInterval: 60000,              // 上传间隔（毫秒）
};

/**
 * 图片上传配置
 */
export const IMAGE_UPLOAD = {
  maxSize: 5 * 1024 * 1024,  // 最大 5MB
  quality: 0.8,              // 压缩质量
  maxWidth: 1920,            // 最大宽度
  maxHeight: 1920,           // 最大高度
  allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
};

/**
 * 表单验证配置
 */
export const VALIDATION = {
  password: {
    minLength: 6,
    maxLength: 20,
    requireNumber: true,
    requireLetter: true,
    requireSpecial: false,
  },
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
  },
  phone: {
    pattern: /^1[3-9]\d{9}$/,  // 中国手机号
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
};

/**
 * 防抖/节流配置（毫秒）
 */
export const THROTTLE_TIME = {
  search: 500,       // 搜索防抖
  click: 1000,       // 点击节流
  scroll: 200,       // 滚动节流
};

/**
 * Feature Flags（功能开关）
 * 用于控制功能的开启/关闭
 */
export const FEATURE_FLAGS = {
  enableNotifications: true,     // 启用通知
  enableAnalytics: !isDevelopment(), // 启用分析（生产环境）
  enableBiometrics: true,        // 启用生物识别
  enableDarkMode: true,          // 启用深色模式
  enableOfflineMode: true,       // 启用离线模式
};

/**
 * 存储键前缀
 * 避免与其他应用冲突
 */
export const STORAGE_PREFIX = '@ExpoTemplate:';

/**
 * 导出完整的应用配置
 */
export const appConfig = {
  theme: APP_THEME,
  pagination: PAGINATION,
  cache: CACHE_TIME,
  log: LOG_CONFIG,
  imageUpload: IMAGE_UPLOAD,
  validation: VALIDATION,
  throttle: THROTTLE_TIME,
  features: FEATURE_FLAGS,
  storagePrefix: STORAGE_PREFIX,
} as const;

