/**
 * 主题 Provider
 * 管理应用主题（深色/浅色模式）
 */

import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useAppStore, type ThemeMode } from '@/stores/app-store';
import { cacheStorage } from '@/core/storage';
import { STORAGE_KEYS } from '@/core/storage';
import { logger } from '@/core/logger';

/**
 * 主题上下文类型
 */
interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

/**
 * 创建主题上下文
 */
const ThemeContext = createContext<ThemeContextType | null>(null);

/**
 * 主题 Provider Props
 */
interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * 主题 Provider 组件
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useSystemColorScheme();
  const { themeMode, setThemeMode } = useAppStore();

  /**
   * 初始化主题设置
   */
  useEffect(() => {
    const initTheme = async () => {
      try {
        const savedTheme = await cacheStorage.getItem(STORAGE_KEYS.THEME_MODE);
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setThemeMode(savedTheme as ThemeMode);
          logger.debug(`Theme restored: ${savedTheme}`, undefined, 'ThemeProvider');
        }
      } catch (error) {
        logger.error('Failed to restore theme', error, 'ThemeProvider');
      }
    };

    initTheme();
  }, [setThemeMode]);

  /**
   * 保存主题设置
   */
  const saveTheme = async (mode: ThemeMode) => {
    try {
      await cacheStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
      logger.debug(`Theme saved: ${mode}`, undefined, 'ThemeProvider');
    } catch (error) {
      logger.error('Failed to save theme', error, 'ThemeProvider');
    }
  };

  /**
   * 设置主题模式
   */
  const setMode = (mode: ThemeMode) => {
    setThemeMode(mode);
    saveTheme(mode);
  };

  /**
   * 切换主题
   */
  const toggleTheme = () => {
    const newMode: ThemeMode = themeMode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
  };

  /**
   * 计算实际的主题模式
   */
  const isDark = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark';
    }
    return themeMode === 'dark';
  }, [themeMode, systemColorScheme]);

  const value = useMemo<ThemeContextType>(
    () => ({
      mode: themeMode,
      isDark,
      setMode,
      toggleTheme,
    }),
    [themeMode, isDark]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * 使用主题 Hook
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  
  return context;
};

