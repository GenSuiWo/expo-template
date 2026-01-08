/**
 * 请求/响应拦截器
 * 统一处理请求头、Token、错误等
 */

import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { logger } from '../logger';
import { handleNetworkError, shouldReLogin } from './error-handler';
import type { ApiResponse } from './types';

/**
 * Token 获取器类型
 * 由认证模块提供
 */
type TokenGetter = () => Promise<string | null> | string | null;

/**
 * Token 刷新器类型
 * 由认证模块提供
 */
type TokenRefresher = () => Promise<void>;

/**
 * 登出处理器类型
 * 由认证模块提供
 */
type LogoutHandler = () => Promise<void> | void;

let tokenGetter: TokenGetter | null = null;
let tokenRefresher: TokenRefresher | null = null;
let logoutHandler: LogoutHandler | null = null;

/**
 * 设置 Token 获取器
 */
export const setTokenGetter = (getter: TokenGetter) => {
  tokenGetter = getter;
};

/**
 * 设置 Token 刷新器
 */
export const setTokenRefresher = (refresher: TokenRefresher) => {
  tokenRefresher = refresher;
};

/**
 * 设置登出处理器
 */
export const setLogoutHandler = (handler: LogoutHandler) => {
  logoutHandler = handler;
};

/**
 * 安装请求拦截器
 */
export const setupRequestInterceptor = (axios: AxiosInstance): void => {
  axios.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // 添加请求时间戳（用于计算请求耗时）
      (config as any).requestStartTime = Date.now();

      // 添加 Token
      const token = tokenGetter ? await tokenGetter() : null;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // 添加通用请求头
      if (config.headers) {
        config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';
        // 可以添加其他通用请求头，如设备信息、应用版本等
        // config.headers['X-Device-Id'] = getDeviceId();
        // config.headers['X-App-Version'] = getAppVersion();
      }

      // 记录请求日志
      logger.debug(
        `Request: ${config.method?.toUpperCase()} ${config.url}`,
        {
          params: config.params,
          data: config.data,
        },
        'NetworkInterceptor'
      );

      return config;
    },
    (error) => {
      logger.error('Request interceptor error:', error, 'NetworkInterceptor');
      return Promise.reject(error);
    }
  );
};

/**
 * 安装响应拦截器
 */
export const setupResponseInterceptor = (axios: AxiosInstance): void => {
  axios.interceptors.response.use(
    (response: AxiosResponse) => {
      // 计算请求耗时
      const requestStartTime = (response.config as any).requestStartTime;
      if (requestStartTime) {
        const duration = Date.now() - requestStartTime;
        logger.debug(
          `Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`,
          {
            status: response.status,
            data: response.data,
          },
          'NetworkInterceptor'
        );
      }

      // 检查业务状态码
      const apiResponse = response.data as ApiResponse;
      
      // 如果后端返回的 code 不是成功状态，作为错误处理
      // 这里假设 code 为 0 或 200 表示成功，可根据实际情况调整
      if (apiResponse.code !== undefined && apiResponse.code !== 0 && apiResponse.code !== 200) {
        logger.warn(
          `API Error: ${apiResponse.code} - ${apiResponse.message}`,
          {
            url: response.config.url,
            data: apiResponse.data,
          },
          'NetworkInterceptor'
        );
        
        // 返回业务错误（不进入 catch，但包含错误信息）
        // 或者可以选择 reject，让调用方统一处理
        // return Promise.reject(new Error(apiResponse.message));
      }

      return response;
    },
    async (error) => {
      // 处理错误
      const networkError = handleNetworkError(error);

      // 如果是 401 未授权错误，尝试刷新 Token
      if (shouldReLogin(networkError)) {
        logger.info('Token expired, attempting to refresh...', undefined, 'NetworkInterceptor');
        
        try {
          // 尝试刷新 Token
          if (tokenRefresher) {
            await tokenRefresher();
            // Token 刷新成功，重试原请求
            logger.info('Token refreshed, retrying request...', undefined, 'NetworkInterceptor');
            return axios.request(error.config);
          }
        } catch (refreshError) {
          logger.error('Token refresh failed:', refreshError, 'NetworkInterceptor');
          // Token 刷新失败，执行登出
          if (logoutHandler) {
            await logoutHandler();
          }
        }
      }

      return Promise.reject(networkError);
    }
  );
};

/**
 * 安装所有拦截器
 */
export const setupInterceptors = (axios: AxiosInstance): void => {
  setupRequestInterceptor(axios);
  setupResponseInterceptor(axios);
};

