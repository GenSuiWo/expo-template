/**
 * 权限 Context
 * 提供全局的权限检查方法
 */

import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from '../auth/use-auth';
import { permissionService } from './permission-service';
import type { PermissionCheckResult } from './types';

/**
 * 权限 Context 类型
 */
export interface PermissionContextType {
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasAllRoles: (roles: string[]) => boolean;
  isSuperAdmin: () => boolean;
  checkPermission: (permission: string) => PermissionCheckResult;
}

/**
 * 创建 Context
 */
const PermissionContext = createContext<PermissionContextType | null>(null);

/**
 * 权限 Provider Props
 */
interface PermissionProviderProps {
  children: React.ReactNode;
}

/**
 * 权限 Provider 组件
 */
export const PermissionProvider: React.FC<PermissionProviderProps> = ({ children }) => {
  const { user } = useAuth();

  const value = useMemo<PermissionContextType>(
    () => ({
      hasPermission: (permission: string) => 
        permissionService.hasPermission(user, permission),
      
      hasAnyPermission: (permissions: string[]) => 
        permissionService.hasAnyPermission(user, permissions),
      
      hasAllPermissions: (permissions: string[]) => 
        permissionService.hasAllPermissions(user, permissions),
      
      hasRole: (role: string) => 
        permissionService.hasRole(user, role),
      
      hasAnyRole: (roles: string[]) => 
        permissionService.hasAnyRole(user, roles),
      
      hasAllRoles: (roles: string[]) => 
        permissionService.hasAllRoles(user, roles),
      
      isSuperAdmin: () => 
        permissionService.isSuperAdmin(user),
      
      checkPermission: (permission: string) => 
        permissionService.checkPermission(user, permission),
    }),
    [user]
  );

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

/**
 * 使用权限 Hook
 */
export const usePermission = (): PermissionContextType => {
  const context = useContext(PermissionContext);
  
  if (!context) {
    throw new Error('usePermission must be used within PermissionProvider');
  }
  
  return context;
};

