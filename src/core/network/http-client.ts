/**
 * HTTP 客户端
 * 基于 Axios 封装的 HTTP 请求客户端
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { getApiConfig } from '../config/api-config';
import { setupInterceptors } from './interceptors';
import { handleNetworkError } from './error-handler';
import type { ApiResponse, RequestConfig, PaginationParams, PaginatedData } from './types';
import { logger } from '../logger';

/**
 * HTTP 客户端类
 */
class HttpClient {
  private instance: AxiosInstance;

  constructor() {
    // 创建 Axios 实例
    const config = getApiConfig();
    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 安装拦截器
    setupInterceptors(this.instance);

    logger.info('HTTP Client initialized', { baseURL: config.baseURL }, 'HttpClient');
  }

  /**
   * 获取 Axios 实例（高级用法）
   */
  getInstance(): AxiosInstance {
    return this.instance;
  }

  /**
   * 通用请求方法
   */
  async request<T = any>(config: RequestConfig): Promise<T> {
    try {
      const response = await this.instance.request<ApiResponse<T>>(config);
      // 返回数据部分（根据后端 API 结构调整）
      return response.data.data;
    } catch (error) {
      throw handleNetworkError(error);
    }
  }

  /**
   * GET 请求
   */
  async get<T = any>(
    url: string,
    params?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>({
      method: 'GET',
      url,
      params,
      ...config,
    });
  }

  /**
   * POST 请求
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>({
      method: 'POST',
      url,
      data,
      ...config,
    });
  }

  /**
   * PUT 请求
   */
  async put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>({
      method: 'PUT',
      url,
      data,
      ...config,
    });
  }

  /**
   * DELETE 请求
   */
  async delete<T = any>(
    url: string,
    params?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>({
      method: 'DELETE',
      url,
      params,
      ...config,
    });
  }

  /**
   * PATCH 请求
   */
  async patch<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>({
      method: 'PATCH',
      url,
      data,
      ...config,
    });
  }

  /**
   * 分页请求
   */
  async getPaginated<T = any>(
    url: string,
    params?: PaginationParams,
    config?: RequestConfig
  ): Promise<PaginatedData<T>> {
    return this.request<PaginatedData<T>>({
      method: 'GET',
      url,
      params,
      ...config,
    });
  }

  /**
   * 上传文件
   */
  async upload<T = any>(
    url: string,
    file: File | Blob,
    onProgress?: (progress: number) => void,
    config?: RequestConfig
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<T>({
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
      ...config,
    });
  }

  /**
   * 批量上传文件
   */
  async uploadMultiple<T = any>(
    url: string,
    files: (File | Blob)[],
    onProgress?: (progress: number) => void,
    config?: RequestConfig
  ): Promise<T> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    return this.request<T>({
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
      ...config,
    });
  }

  /**
   * 下载文件
   */
  async download(
    url: string,
    onProgress?: (progress: number) => void,
    config?: RequestConfig
  ): Promise<Blob> {
    try {
      const response = await this.instance.request({
        method: 'GET',
        url,
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
        ...config,
      });
      return response.data;
    } catch (error) {
      throw handleNetworkError(error);
    }
  }

  /**
   * 取消请求
   */
  createCancelToken() {
    return axios.CancelToken.source();
  }
}

/**
 * 导出 HTTP 客户端单例
 */
export const httpClient = new HttpClient();

/**
 * 便捷方法导出
 */
export const http = {
  get: httpClient.get.bind(httpClient),
  post: httpClient.post.bind(httpClient),
  put: httpClient.put.bind(httpClient),
  delete: httpClient.delete.bind(httpClient),
  patch: httpClient.patch.bind(httpClient),
  request: httpClient.request.bind(httpClient),
  getPaginated: httpClient.getPaginated.bind(httpClient),
  upload: httpClient.upload.bind(httpClient),
  uploadMultiple: httpClient.uploadMultiple.bind(httpClient),
  download: httpClient.download.bind(httpClient),
};

