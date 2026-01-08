/**
 * 路由守卫组件
 * 根据登录状态和权限控制路由访问
 */

import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../auth/use-auth';
import { logger } from '../logger';
import { usePermission } from '../permission/permission-context';
import { navigationService } from './navigation-service';

/**
 * 路由守卫 Props
 */
interface RouteGuardProps {
  /** 子组件 */
  children: React.ReactNode;
  /** 是否需要登录 */
  requiresAuth?: boolean;
  /** 需要的权限 */
  permissions?: string[];
  /** 需要的角色 */
  roles?: string[];
  /** 是否需要所有权限（默认 false） */
  requireAll?: boolean;
  /** 未登录时的重定向路径 */
  redirectTo?: string;
  /** 无权限时的后备组件 */
  fallback?: React.ReactNode;
}

/**
 * 路由守卫组件
 * 
 * @example
 * ```tsx
 * // 需要登录
 * <RouteGuard requiresAuth>
 *   <ProfileScreen />
 * </RouteGuard>
 * 
 * // 需要特定权限
 * <RouteGuard requiresAuth permissions={['admin.access']}>
 *   <AdminScreen />
 * </RouteGuard>
 * ```
 */
export const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  requiresAuth = false,
  permissions,
  roles,
  requireAll = false,
  redirectTo,
  fallback,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const permission = usePermission();

  useEffect(() => {
    // 如果需要登录但用户未登录，重定向到登录页
    if (requiresAuth && !isLoading && !isAuthenticated) {
      logger.info('User not authenticated, redirecting to login', undefined, 'RouteGuard');
      
      const currentPath = navigationService.getCurrentPath();
      if (redirectTo) {
        navigationService.replace(redirectTo, { returnUrl: currentPath });
      } else {
        navigationService.navigateToLogin(currentPath);
      }
    }
  }, [requiresAuth, isAuthenticated, isLoading, redirectTo]);

  // 正在加载认证状态
  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 需要登录但未登录
  if (requiresAuth && !isAuthenticated) {
    return null; // 重定向在 useEffect 中处理
  }

  // 检查权限
  if (isAuthenticated && (permissions || roles)) {
    let hasAccess = true;

    if (permissions && permissions.length > 0) {
      hasAccess = requireAll
        ? permission.hasAllPermissions(permissions)
        : permission.hasAnyPermission(permissions);
    }

    if (hasAccess && roles && roles.length > 0) {
      hasAccess = requireAll
        ? permission.hasAllRoles(roles)
        : permission.hasAnyRole(roles);
    }

    if (!hasAccess) {
      logger.warn(
        'User does not have required permissions',
        { permissions, roles },
        'RouteGuard'
      );
      
      if (fallback) {
        return <>{fallback}</>;
      }
      
      // 默认返回空，或可以显示无权限页面
      return null;
    }
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

