/**
 * 权限守卫组件
 * 根据权限控制子组件的显示
 */

import React from 'react';
import { usePermission } from '../permission-context';

/**
 * 权限守卫 Props
 */
interface PermissionGuardProps {
  /** 子组件 */
  children: React.ReactNode;
  /** 需要的权限（满足一个即可） */
  permissions?: string[];
  /** 需要的角色（满足一个即可） */
  roles?: string[];
  /** 是否需要所有权限（默认 false，即满足任一即可） */
  requireAll?: boolean;
  /** 无权限时显示的内容 */
  fallback?: React.ReactNode;
}

/**
 * 权限守卫组件
 * 
 * @example
 * ```tsx
 * // 需要任一权限
 * <PermissionGuard permissions={['user.create', 'user.edit']}>
 *   <Button>创建用户</Button>
 * </PermissionGuard>
 * 
 * // 需要所有权限
 * <PermissionGuard permissions={['user.delete']} requireAll>
 *   <Button>删除用户</Button>
 * </PermissionGuard>
 * 
 * // 基于角色
 * <PermissionGuard roles={['admin', 'manager']}>
 *   <AdminPanel />
 * </PermissionGuard>
 * ```
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permissions,
  roles,
  requireAll = false,
  fallback = null,
}) => {
  const permission = usePermission();

  // 检查权限
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
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

