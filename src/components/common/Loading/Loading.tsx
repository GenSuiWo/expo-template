/**
 * 加载组件
 */

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, ViewStyle } from 'react-native';

export interface LoadingProps {
  /** 是否显示 */
  visible?: boolean;
  /** 加载文本 */
  text?: string;
  /** 尺寸 */
  size?: 'small' | 'large';
  /** 颜色 */
  color?: string;
  /** 容器样式 */
  style?: ViewStyle;
  /** 是否全屏 */
  fullScreen?: boolean;
}

/**
 * 加载组件
 */
export const Loading: React.FC<LoadingProps> = ({
  visible = true,
  text,
  size = 'large',
  color = '#007AFF',
  style,
  fullScreen = false,
}) => {
  if (!visible) {
    return null;
  }

  return (
    <View style={[fullScreen ? styles.fullScreen : styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
});

