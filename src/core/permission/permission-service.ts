/**
 * 权限服务
 * 提供权限判断逻辑
 */

import type { User } from '../auth/types';
import { logger } from '../logger';
import type { PermissionCheckResult } from './types';

/**
 * 权限服务类
 */
class PermissionService {
  /**
   * 检查用户是否有指定权限
   */
  hasPermission(user: User | null, permission: string): boolean {
    if (!user) {
      return false;
    }

    // 超级管理员拥有所有权限
    if (this.isSuperAdmin(user)) {
      return true;
    }

    // 检查用户权限列表
    return user.permissions?.includes(permission) ?? false;
  }

  /**
   * 检查用户是否有任一指定权限
   */
  hasAnyPermission(user: User | null, permissions: string[]): boolean {
    if (!user) {
      return false;
    }

    if (this.isSuperAdmin(user)) {
      return true;
    }

    return permissions.some(permission => 
      user.permissions?.includes(permission)
    );
  }

  /**
   * 检查用户是否有所有指定权限
   */
  hasAllPermissions(user: User | null, permissions: string[]): boolean {
    if (!user) {
      return false;
    }

    if (this.isSuperAdmin(user)) {
      return true;
    }

    return permissions.every(permission => 
      user.permissions?.includes(permission)
    );
  }

  /**
   * 检查用户是否有指定角色
   */
  hasRole(user: User | null, role: string): boolean {
    if (!user) {
      return false;
    }

    return user.roles?.includes(role) ?? false;
  }

  /**
   * 检查用户是否有任一指定角色
   */
  hasAnyRole(user: User | null, roles: string[]): boolean {
    if (!user) {
      return false;
    }

    return roles.some(role => user.roles?.includes(role));
  }

  /**
   * 检查用户是否有所有指定角色
   */
  hasAllRoles(user: User | null, roles: string[]): boolean {
    if (!user) {
      return false;
    }

    return roles.every(role => user.roles?.includes(role));
  }

  /**
   * 判断是否为超级管理员
   */
  isSuperAdmin(user: User | null): boolean {
    if (!user) {
      return false;
    }

    return user.roles?.includes('admin') || user.roles?.includes('super_admin') || false;
  }

  /**
   * 执行权限检查（带详细结果）
   */
  checkPermission(user: User | null, permission: string): PermissionCheckResult {
    if (!user) {
      return {
        granted: false,
        reason: '用户未登录',
      };
    }

    if (this.isSuperAdmin(user)) {
      return {
        granted: true,
        reason: '超级管理员拥有所有权限',
      };
    }

    const hasPermission = user.permissions?.includes(permission) ?? false;
    
    return {
      granted: hasPermission,
      reason: hasPermission ? undefined : `缺少权限: ${permission}`,
    };
  }

  /**
   * 记录权限检查日志
   */
  logPermissionCheck(
    user: User | null,
    permission: string,
    granted: boolean
  ): void {
    logger.debug(
      `Permission check: ${permission}`,
      {
        userId: user?.id,
        username: user?.username,
        granted,
      },
      'PermissionService'
    );
  }
}

/**
 * 导出单例实例
 */
export const permissionService = new PermissionService();

