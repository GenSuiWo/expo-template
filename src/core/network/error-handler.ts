/**
 * 网络错误处理
 * 统一处理 HTTP 错误和网络异常
 */

import { AxiosError } from 'axios';
import { NetworkError, NetworkErrorType } from './types';
import { logger } from '../logger';

/**
 * HTTP 状态码错误消息映射
 */
const HTTP_ERROR_MESSAGES: Record<number, string> = {
  400: '请求参数错误',
  401: '未授权，请重新登录',
  403: '拒绝访问',
  404: '请求的资源不存在',
  405: '请求方法不允许',
  408: '请求超时',
  409: '数据冲突',
  429: '请求过于频繁，请稍后再试',
  500: '服务器内部错误',
  501: '服务未实现',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
};

/**
 * 获取错误类型
 */
const getErrorType = (error: AxiosError): NetworkErrorType => {
  if (!error.response) {
    // 没有响应，可能是网络错误或请求被取消
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return NetworkErrorType.TIMEOUT;
    }
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      return NetworkErrorType.NO_NETWORK;
    }
    if (error.message.includes('cancel')) {
      return NetworkErrorType.CANCEL;
    }
    return NetworkErrorType.UNKNOWN;
  }

  const status = error.response.status;

  if (status === 401) {
    return NetworkErrorType.UNAUTHORIZED;
  }
  if (status === 403) {
    return NetworkErrorType.FORBIDDEN;
  }
  if (status === 404) {
    return NetworkErrorType.NOT_FOUND;
  }
  if (status >= 400 && status < 500) {
    return NetworkErrorType.CLIENT_ERROR;
  }
  if (status >= 500) {
    return NetworkErrorType.SERVER_ERROR;
  }

  return NetworkErrorType.UNKNOWN;
};

/**
 * 获取错误消息
 */
const getErrorMessage = (error: AxiosError): string => {
  // 优先使用后端返回的错误消息
  const responseData: any = error.response?.data;
  if (responseData?.message) {
    return responseData.message;
  }

  // 使用预定义的错误消息
  const status = error.response?.status;
  if (status && HTTP_ERROR_MESSAGES[status]) {
    return HTTP_ERROR_MESSAGES[status];
  }

  // 使用 Axios 错误消息
  if (error.message) {
    if (error.message.includes('timeout')) {
      return '请求超时，请检查网络连接';
    }
    if (error.message.includes('Network Error')) {
      return '网络连接失败，请检查网络设置';
    }
    return error.message;
  }

  return '未知错误';
};

/**
 * 处理网络错误
 * 将 AxiosError 转换为统一的 NetworkError
 */
export const handleNetworkError = (error: any): NetworkError => {
  // 如果已经是 NetworkError，直接返回
  if (error.type && error.message) {
    return error as NetworkError;
  }

  // 如果不是 AxiosError，返回未知错误
  if (!error.isAxiosError) {
    logger.error('Unknown network error:', error, 'NetworkErrorHandler');
    return {
      type: NetworkErrorType.UNKNOWN,
      message: error.message || '未知错误',
      originalError: error,
    };
  }

  const axiosError = error as AxiosError;
  const errorType = getErrorType(axiosError);
  const errorMessage = getErrorMessage(axiosError);

  const networkError: NetworkError = {
    type: errorType,
    message: errorMessage,
    code: axiosError.response?.status,
    originalError: axiosError,
  };

  // 记录错误日志
  logger.error(
    `Network Error [${errorType}]: ${errorMessage}`,
    {
      url: axiosError.config?.url,
      method: axiosError.config?.method,
      status: axiosError.response?.status,
      data: axiosError.response?.data,
    },
    'NetworkErrorHandler'
  );

  return networkError;
};

/**
 * 判断是否为需要重试的错误
 */
export const shouldRetry = (error: NetworkError): boolean => {
  const retryableErrors = [
    NetworkErrorType.TIMEOUT,
    NetworkErrorType.NO_NETWORK,
    NetworkErrorType.SERVER_ERROR,
  ];
  
  return retryableErrors.includes(error.type);
};

/**
 * 判断是否需要重新登录
 */
export const shouldReLogin = (error: NetworkError): boolean => {
  return error.type === NetworkErrorType.UNAUTHORIZED;
};

/**
 * 判断错误是否可以忽略（不显示给用户）
 */
export const shouldIgnoreError = (error: NetworkError): boolean => {
  return error.type === NetworkErrorType.CANCEL;
};

