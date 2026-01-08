/**
 * API 配置管理
 * 根据不同环境配置不同的 API 地址
 */

import { Environment, getCurrentEnvironment, getEnvVar } from './env';

/**
 * API 配置接口
 */
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  retryCount: number;
  retryDelay: number;
}

/**
 * 各环境的 API 基础地址配置
 */
const API_BASE_URLS: Record<Environment, string> = {
  [Environment.DEVELOPMENT]: getEnvVar('API_BASE_URL', 'https://dev-api.example.com'),
  [Environment.STAGING]: getEnvVar('API_BASE_URL', 'https://staging-api.example.com'),
  [Environment.PRODUCTION]: getEnvVar('API_BASE_URL', 'https://api.example.com'),
};

/**
 * 获取当前环境的 API 基础地址
 */
export const getApiBaseUrl = (): string => {
  const env = getCurrentEnvironment();
  return API_BASE_URLS[env];
};

/**
 * API 超时配置（毫秒）
 */
export const API_TIMEOUT = {
  default: 30000,      // 默认 30 秒
  upload: 60000,       // 上传 60 秒
  download: 120000,    // 下载 120 秒
};

/**
 * API 重试配置
 */
export const API_RETRY = {
  count: 3,            // 重试次数
  delay: 1000,         // 重试延迟（毫秒）
  statusCodes: [408, 429, 500, 502, 503, 504], // 需要重试的状态码
};

/**
 * 获取完整的 API 配置
 */
export const getApiConfig = (): ApiConfig => ({
  baseURL: getApiBaseUrl(),
  timeout: API_TIMEOUT.default,
  retryCount: API_RETRY.count,
  retryDelay: API_RETRY.delay,
});

/**
 * API 端点路径
 * 集中管理所有 API 路径，便于维护
 */
export const API_ENDPOINTS = {
  // 认证相关
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    register: '/auth/register',
    refreshToken: '/auth/refresh-token',
    resetPassword: '/auth/reset-password',
  },
  
  // 用户相关
  user: {
    profile: '/user/profile',
    update: '/user/update',
    avatar: '/user/avatar',
  },
  
  // 示例：产品相关
  product: {
    list: '/products',
    detail: (id: string) => `/products/${id}`,
    create: '/products',
    update: (id: string) => `/products/${id}`,
    delete: (id: string) => `/products/${id}`,
  },
} as const;

/**
 * 构建完整的 API URL
 */
export const buildApiUrl = (endpoint: string): string => {
  const baseURL = getApiBaseUrl();
  return `${baseURL}${endpoint}`;
};

