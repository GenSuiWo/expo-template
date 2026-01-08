/**
 * 认证 Hook
 * 便捷访问认证状态和方法
 */

import { useContext } from 'react';
import { AuthContext, AuthContextType } from './auth-context';

/**
 * 使用认证 Hook
 * @throws {Error} 如果在 AuthProvider 外使用
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
};

/**
 * 检查用户是否有指定角色
 */
export const useHasRole = (role: string): boolean => {
  const { user } = useAuth();
  return user?.roles?.includes(role) ?? false;
};

/**
 * 检查用户是否有指定权限
 */
export const useHasPermission = (permission: string): boolean => {
  const { user } = useAuth();
  return user?.permissions?.includes(permission) ?? false;
};

/**
 * 检查用户是否有任一指定角色
 */
export const useHasAnyRole = (roles: string[]): boolean => {
  const { user } = useAuth();
  if (!user?.roles) return false;
  return roles.some(role => user.roles!.includes(role));
};

/**
 * 检查用户是否有所有指定角色
 */
export const useHasAllRoles = (roles: string[]): boolean => {
  const { user } = useAuth();
  if (!user?.roles) return false;
  return roles.every(role => user.roles!.includes(role));
};

/**
 * 检查用户是否有任一指定权限
 */
export const useHasAnyPermission = (permissions: string[]): boolean => {
  const { user } = useAuth();
  if (!user?.permissions) return false;
  return permissions.some(permission => user.permissions!.includes(permission));
};

/**
 * 检查用户是否有所有指定权限
 */
export const useHasAllPermissions = (permissions: string[]): boolean => {
  const { user } = useAuth();
  if (!user?.permissions) return false;
  return permissions.every(permission => user.permissions!.includes(permission));
};

