/**
 * 权限模块类型定义
 */

/**
 * 权限配置
 */
export interface Permission {
  id: string;
  name: string;
  description?: string;
  module?: string;
}

/**
 * 角色配置
 */
export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
}

/**
 * 权限检查结果
 */
export interface PermissionCheckResult {
  granted: boolean;
  reason?: string;
}

