/**
 * 网络层类型定义
 */

import type { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * API 响应数据结构
 * 可根据后端实际返回格式调整
 */
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp?: number;
}

/**
 * 分页数据结构
 */
export interface PaginatedData<T = any> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore?: boolean;
}

/**
 * 分页请求参数
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  [key: string]: any;
}

/**
 * 请求配置扩展
 */
export interface RequestConfig extends AxiosRequestConfig {
  /** 是否需要 Token */
  requiresAuth?: boolean;
  /** 是否显示加载提示 */
  showLoading?: boolean;
  /** 是否显示错误提示 */
  showError?: boolean;
  /** 是否重试 */
  retry?: boolean;
  /** 重试次数 */
  retryCount?: number;
  /** 自定义错误处理 */
  customErrorHandler?: (error: any) => void;
}

/**
 * HTTP 方法类型
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * 上传进度回调
 */
export type UploadProgressCallback = (progress: number) => void;

/**
 * 下载进度回调
 */
export type DownloadProgressCallback = (progress: number) => void;

/**
 * 请求拦截器配置
 */
export interface RequestInterceptor {
  onFulfilled?: (config: any) => any | Promise<any>;
  onRejected?: (error: any) => any;
}

/**
 * 响应拦截器配置
 */
export interface ResponseInterceptor {
  onFulfilled?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
  onRejected?: (error: any) => any;
}

/**
 * 网络错误类型
 */
export enum NetworkErrorType {
  TIMEOUT = 'TIMEOUT',
  NO_NETWORK = 'NO_NETWORK',
  SERVER_ERROR = 'SERVER_ERROR',
  CLIENT_ERROR = 'CLIENT_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CANCEL = 'CANCEL',
  UNKNOWN = 'UNKNOWN',
}

/**
 * 网络错误信息
 */
export interface NetworkError {
  type: NetworkErrorType;
  message: string;
  code?: number;
  originalError?: any;
}

