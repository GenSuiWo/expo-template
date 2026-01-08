import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '@/core/auth';
import { usePermission } from '@/core/permission';
import { useTranslation } from '@/core/i18n';
import { useTheme } from '@/providers/theme-provider';
import { useUserStore, useAppStore } from '@/stores';
import { Button } from '@/components/common';
import { logger } from '@/core/logger';

export default function HomeScreen() {
  const { user, isAuthenticated } = useAuth();
  const { hasPermission } = usePermission();
  const { t, language, changeLanguage } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const { isOnline } = useUserStore();
  const { isConnected, appVersion } = useAppStore();

  const handleLanguageToggle = () => {
    const newLang = language === 'zh-CN' ? 'en-US' : 'zh-CN';
    changeLanguage(newLang);
    logger.info(`Language changed to ${newLang}`, undefined, 'HomeScreen');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎉 {t('home.welcome')}</Text>
        <Text style={styles.subtitle}>企业级 Expo 框架示例</Text>
      </View>

      {/* 认证状态 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔐 认证状态</Text>
        <Text style={styles.text}>
          登录状态: {isAuthenticated ? '✅ 已登录' : '❌ 未登录'}
        </Text>
        {user && (
          <Text style={styles.text}>用户: {user.username || 'N/A'}</Text>
        )}
      </View>

      {/* 应用状态 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📱 应用状态</Text>
        <Text style={styles.text}>主题: {isDark ? '🌙 深色' : '☀️ 浅色'}</Text>
        <Text style={styles.text}>语言: {language}</Text>
        <Text style={styles.text}>版本: {appVersion}</Text>
        <Text style={styles.text}>
          网络: {isConnected ? '🟢 已连接' : '🔴 断开'}
        </Text>
        <Text style={styles.text}>
          用户状态: {isOnline ? '🟢 在线' : '🔴 离线'}
        </Text>
      </View>

      {/* 功能测试 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🛠️ 功能测试</Text>
        
        <Button
          title={`切换主题 (当前: ${isDark ? '深色' : '浅色'})`}
          onPress={toggleTheme}
          variant="primary"
          style={styles.button}
        />

        <Button
          title={`切换语言 (${language})`}
          onPress={handleLanguageToggle}
          variant="secondary"
          style={styles.button}
        />

        <Button
          title="测试日志"
          onPress={() => {
            logger.debug('这是 DEBUG 日志');
            logger.info('这是 INFO 日志');
            logger.warn('这是 WARN 日志');
            logger.error('这是 ERROR 日志');
          }}
          variant="outline"
          style={styles.button}
        />
      </View>

      {/* 框架特性 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>✨ 框架特性</Text>
        <Text style={styles.feature}>✅ 完整的认证系统</Text>
        <Text style={styles.feature}>✅ 权限控制 (RBAC)</Text>
        <Text style={styles.feature}>✅ 国际化 (i18n)</Text>
        <Text style={styles.feature}>✅ 主题切换</Text>
        <Text style={styles.feature}>✅ 状态管理 (Zustand)</Text>
        <Text style={styles.feature}>✅ 网络请求层</Text>
        <Text style={styles.feature}>✅ 日志系统</Text>
        <Text style={styles.feature}>✅ 安全存储</Text>
        <Text style={styles.feature}>✅ 路由守卫</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          🚀 企业级 Expo 框架 v{appVersion}
        </Text>
        <Text style={styles.footerText}>
          框架搭建完成 ✨
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 24,
    paddingTop: 40,
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E6F2FF',
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#111827',
  },
  text: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  feature: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 6,
  },
  button: {
    marginTop: 8,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 4,
  },
});
