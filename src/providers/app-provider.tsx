/**
 * 应用 Provider
 * 组合所有全局 Provider
 */

import React, { useEffect } from 'react';
import { AuthProvider } from '@/core/auth';
import { PermissionProvider } from '@/core/permission';
import { initI18n } from '@/core/i18n';
import { ThemeProvider } from './theme-provider';
import { logger } from '@/core/logger';
import { errorTracker } from '@/core/logger';
import { useAppStore } from '@/stores/app-store';

/**
 * 应用 Provider Props
 */
interface AppProviderProps {
  children: React.ReactNode;
}

/**
 * 应用初始化组件
 * 处理应用启动时的初始化逻辑
 */
const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setAppReady } = useAppStore();

  useEffect(() => {
    const initApp = async () => {
      try {
        logger.info('Initializing application...', undefined, 'AppProvider');

        // 初始化国际化
        await initI18n();
        logger.info('i18n initialized', undefined, 'AppProvider');

        // 初始化错误追踪
        errorTracker.init();
        logger.info('Error tracker initialized', undefined, 'AppProvider');

        // 可以添加其他初始化逻辑
        // 例如：检查更新、初始化推送通知等

        setAppReady(true);
        logger.info('Application initialized successfully', undefined, 'AppProvider');
      } catch (error) {
        logger.error('Application initialization failed', error, 'AppProvider');
        errorTracker.trackRuntimeError('应用初始化失败', error as Error);
        
        // 即使初始化失败，也标记为就绪，避免阻塞应用
        setAppReady(true);
      }
    };

    initApp();
  }, [setAppReady]);

  return <>{children}</>;
};

/**
 * 应用 Provider 组件
 * 按照依赖顺序组合所有 Provider
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PermissionProvider>
          <AppInitializer>
            {children}
          </AppInitializer>
        </PermissionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

