import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

import { Loading } from '@/components/common';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppProvider } from '@/providers';
import { useAppStore } from '@/stores';

export const unstable_settings = {
  anchor: '(tabs)',
};

/**
 * 主布局组件
 */
function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const { isAppReady } = useAppStore();

  // 显示加载状态直到应用初始化完成
  if (!isAppReady) {
    return <Loading fullScreen text="初始化中..." />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

/**
 * 根布局导出
 * 包裹所有 Provider
 */
export default function RootLayout() {
  return (
    <AppProvider>
      <RootLayoutContent />
    </AppProvider>
  );
}
