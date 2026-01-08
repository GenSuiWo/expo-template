/**
 * 受保护的按钮组件
 * 根据权限自动禁用或隐藏按钮
 */

import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { usePermission } from '../permission-context';

/**
 * 受保护按钮 Props
 */
interface ProtectedButtonProps extends TouchableOpacityProps {
  /** 需要的权限 */
  permissions?: string[];
  /** 需要的角色 */
  roles?: string[];
  /** 是否需要所有权限（默认 false） */
  requireAll?: boolean;
  /** 无权限时的行为：'hide' 隐藏 | 'disable' 禁用（默认） */
  fallbackMode?: 'hide' | 'disable';
}

/**
 * 受保护的按钮组件
 * 
 * @example
 * ```tsx
 * <ProtectedButton
 *   permissions={['user.delete']}
 *   onPress={handleDelete}
 * >
 *   <Text>删除</Text>
 * </ProtectedButton>
 * ```
 */
export const ProtectedButton: React.FC<ProtectedButtonProps> = ({
  children,
  permissions,
  roles,
  requireAll = false,
  fallbackMode = 'disable',
  disabled,
  style,
  ...props
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

  // 无权限时隐藏
  if (!hasAccess && fallbackMode === 'hide') {
    return null;
  }

  // 无权限时禁用
  const isDisabled = !hasAccess || disabled;

  return (
    <TouchableOpacity
      {...props}
      disabled={isDisabled}
      style={[
        style,
        isDisabled && styles.disabled,
      ]}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
});

