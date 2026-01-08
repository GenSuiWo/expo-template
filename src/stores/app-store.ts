/**
 * 应用状态管理
 * 使用 Zustand 管理应用级别的全局状态
 */

import { create } from 'zustand';
import type { SupportedLanguage } from '@/core/i18n';

/**
 * 主题模式
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * 应用状态接口
 */
interface AppState {
  // 主题
  themeMode: ThemeMode;
  
  // 语言
  language: SupportedLanguage;
  
  // 加载状态
  isAppReady: boolean;
  isLoading: boolean;
  
  // 网络状态
  isConnected: boolean;
  
  // 应用版本
  appVersion: string;
  
  // 操作
  setThemeMode: (mode: ThemeMode) => void;
  setLanguage: (language: SupportedLanguage) => void;
  setAppReady: (ready: boolean) => void;
  setLoading: (loading: boolean) => void;
  setConnected: (connected: boolean) => void;
  setAppVersion: (version: string) => void;
}

/**
 * 创建应用状态 Store
 */
export const useAppStore = create<AppState>((set) => ({
  // 初始状态
  themeMode: 'system',
  language: 'zh-CN',
  isAppReady: false,
  isLoading: false,
  isConnected: true,
  appVersion: '1.0.0',
  
  // 设置主题模式
  setThemeMode: (mode) => set({ themeMode: mode }),
  
  // 设置语言
  setLanguage: (language) => set({ language }),
  
  // 设置应用就绪状态
  setAppReady: (ready) => set({ isAppReady: ready }),
  
  // 设置加载状态
  setLoading: (loading) => set({ isLoading: loading }),
  
  // 设置网络连接状态
  setConnected: (connected) => set({ isConnected: connected }),
  
  // 设置应用版本
  setAppVersion: (version) => set({ appVersion: version }),
}));

