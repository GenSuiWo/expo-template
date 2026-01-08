/**
 * 环境配置管理
 * 管理不同环境（dev/staging/prod）的配置
 */

import Constants from 'expo-constants';

/**
 * 环境类型枚举
 */
export enum Environment {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

/**
 * 获取当前运行环境
 * 优先级：环境变量 > Expo 配置 > 默认值
 */
export const getCurrentEnvironment = (): Environment => {
  // 从环境变量获取
  const env = process.env.NODE_ENV || process.env.EXPO_PUBLIC_ENV;
  
  // 从 Expo Constants 获取
  const expoEnv = Constants.expoConfig?.extra?.environment;
  
  const envString = env || expoEnv || 'development';
  
  switch (envString.toLowerCase()) {
    case 'production':
    case 'prod':
      return Environment.PRODUCTION;
    case 'staging':
    case 'stage':
      return Environment.STAGING;
    default:
      return Environment.DEVELOPMENT;
  }
};

/**
 * 判断是否为开发环境
 */
export const isDevelopment = (): boolean => {
  return getCurrentEnvironment() === Environment.DEVELOPMENT;
};

/**
 * 判断是否为生产环境
 */
export const isProduction = (): boolean => {
  return getCurrentEnvironment() === Environment.PRODUCTION;
};

/**
 * 判断是否为预发布环境
 */
export const isStaging = (): boolean => {
  return getCurrentEnvironment() === Environment.STAGING;
};

/**
 * 获取环境变量（带类型安全）
 */
export const getEnvVar = (key: string, defaultValue?: string): string => {
  // 尝试从 process.env 获取（使用 EXPO_PUBLIC_ 前缀）
  const value = process.env[`EXPO_PUBLIC_${key}`] || process.env[key];
  
  // 尝试从 Expo Constants 获取
  const expoValue = Constants.expoConfig?.extra?.[key];
  
  return value || expoValue || defaultValue || '';
};

/**
 * 环境信息
 */
export const envInfo = {
  current: getCurrentEnvironment(),
  isDevelopment: isDevelopment(),
  isProduction: isProduction(),
  isStaging: isStaging(),
  appVersion: Constants.expoConfig?.version || '1.0.0',
  buildVersion: Constants.expoConfig?.android?.versionCode || 
                 Constants.expoConfig?.ios?.buildNumber || '1',
};

