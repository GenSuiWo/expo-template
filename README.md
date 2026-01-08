# 🚀 企业级 Expo 框架

一个功能完善、架构清晰的企业级 React Native (Expo) 应用框架模板。

## ✨ 特性

### 核心能力

- 🔐 **完整的认证系统** - 登录/登出、Token 管理、自动刷新
- 🛡️ **权限控制** - 基于 RBAC 的权限系统，支持角色和权限细粒度控制
- 🌍 **国际化** - 多语言支持（中文/英文），可轻松扩展
- 🎨 **主题系统** - 深色/浅色模式切换，主题持久化
- 📦 **状态管理** - Zustand + Context API 混合方案
- 🌐 **网络层** - Axios 封装，自动 Token 注入、错误处理、请求重试
- 📝 **日志系统** - 统一日志记录和错误追踪
- 💾 **存储层** - 安全存储（Token）+ 普通缓存分离
- 🛣️ **路由守卫** - 登录拦截、权限验证
- 🎯 **TypeScript** - 完整的类型安全

### 技术栈

- **框架**: Expo SDK 54 + React Native
- **路由**: Expo Router (文件路由)
- **状态管理**: Zustand + React Context
- **网络请求**: Axios
- **国际化**: i18next + react-i18next
- **样式**: NativeWind (Tailwind CSS)
- **语言**: TypeScript

## 📁 项目结构

```
expo-template/
├── app/                        # Expo Router 页面
│   ├── _layout.tsx            # 根布局（集成所有 Provider）
│   ├── (tabs)/                # Tab 页面组
│   └── modal.tsx              # 示例 Modal
├── src/
│   ├── core/                  # 核心框架层
│   │   ├── auth/             # 认证中心
│   │   ├── network/          # 网络层
│   │   ├── permission/       # 权限系统
│   │   ├── config/           # 环境配置
│   │   ├── storage/          # 存储层
│   │   ├── logger/           # 日志系统
│   │   ├── i18n/             # 国际化
│   │   └── router/           # 路由守卫
│   ├── stores/               # Zustand 状态管理
│   ├── providers/            # Context Providers
│   ├── components/           # UI 组件
│   │   ├── common/          # 通用组件
│   │   ├── business/        # 业务组件
│   │   └── layout/          # 布局组件
│   ├── services/             # API 服务层
│   ├── hooks/                # 自定义 Hooks
│   ├── utils/                # 工具函数
│   ├── constants/            # 常量定义
│   ├── types/                # TypeScript 类型
│   └── styles/               # 样式配置
├── locales/                   # 多语言文件
│   ├── zh-CN.json
│   └── en-US.json
├── assets/                    # 静态资源
└── docs/                      # 文档

```

## 🚀 快速开始

### 1. 安装依赖

```bash
pnpm install
# 或
npm install
```

### 2. 启动开发服务器

```bash
pnpm start
# 或
npm start
```

### 3. 运行应用

- **iOS 模拟器**: 按 `i`
- **Android 模拟器**: 按 `a`
- **Web**: 按 `w`

## 📖 核心模块使用

### 认证系统

```typescript
import { useAuth } from '@/core/auth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  const handleLogin = async () => {
    await login({ username: 'test', password: '123456' });
  };

  return (
    <View>
      {isAuthenticated ? (
        <Text>欢迎, {user?.username}</Text>
      ) : (
        <Button title="登录" onPress={handleLogin} />
      )}
    </View>
  );
}
```

### 权限控制

```typescript
import { PermissionGuard, usePermission } from '@/core/permission';

// 组件级权限控制
function AdminPanel() {
  return (
    <PermissionGuard permissions={['admin.access']}>
      <Text>管理员面板</Text>
    </PermissionGuard>
  );
}

// Hook 方式
function MyButton() {
  const { hasPermission } = usePermission();
  
  if (!hasPermission('user.delete')) {
    return null;
  }
  
  return <Button title="删除用户" />;
}
```

### 国际化

```typescript
import { useTranslation } from '@/core/i18n';

function MyComponent() {
  const { t, language, changeLanguage } = useTranslation();

  return (
    <View>
      <Text>{t('home.welcome')}</Text>
      <Button 
        title={`切换语言 (${language})`}
        onPress={() => changeLanguage(language === 'zh-CN' ? 'en-US' : 'zh-CN')}
      />
    </View>
  );
}
```

### 主题切换

```typescript
import { useTheme } from '@/providers/theme-provider';

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Button 
      title={isDark ? '切换到浅色' : '切换到深色'}
      onPress={toggleTheme}
    />
  );
}
```

### 网络请求

```typescript
import { http } from '@/core/network';

// GET 请求
const users = await http.get('/users');

// POST 请求
const user = await http.post('/users', { name: 'John' });

// 带权限的请求（自动添加 Token）
const profile = await http.get('/profile', undefined, { 
  requiresAuth: true 
});
```

### 状态管理

```typescript
import { useUserStore, useAppStore } from '@/stores';

function MyComponent() {
  const { user, setUser } = useUserStore();
  const { theme, setTheme } = useAppStore();

  return (
    <View>
      <Text>{user?.name}</Text>
    </View>
  );
}
```

## 🔧 配置

### 环境变量

创建 `.env` 文件：

```bash
# API 配置
EXPO_PUBLIC_API_BASE_URL=https://api.example.com
EXPO_PUBLIC_APP_ENV=development

# 功能开关
EXPO_PUBLIC_ENABLE_ANALYTICS=false
```

### API 地址配置

编辑 `src/core/config/api-config.ts`:

```typescript
const API_BASE_URLS: Record<Environment, string> = {
  [Environment.DEVELOPMENT]: 'https://dev-api.example.com',
  [Environment.STAGING]: 'https://staging-api.example.com',
  [Environment.PRODUCTION]: 'https://api.example.com',
};
```

### 应用配置

编辑 `src/core/config/app-config.ts` 自定义主题色、缓存时间、验证规则等。

## 📚 进阶使用

### 路由守卫

```typescript
import { RouteGuard } from '@/core/router';

export default function ProtectedScreen() {
  return (
    <RouteGuard requiresAuth permissions={['admin.access']}>
      <AdminContent />
    </RouteGuard>
  );
}
```

### 自定义 Hook

```typescript
import { useApi } from '@/hooks/use-api';

function UserList() {
  const { data, loading, error, refetch } = useApi('/users');

  if (loading) return <Loading />;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <UserItem user={item} />}
    />
  );
}
```

### 日志记录

```typescript
import { logger, errorTracker } from '@/core/logger';

// 记录日志
logger.debug('调试信息', { data });
logger.info('一般信息', { user });
logger.warn('警告信息', { code });
logger.error('错误信息', error);

// 错误追踪
errorTracker.trackApiError('API 调用失败', error, { endpoint: '/users' });
```

## 🎨 UI 组件

框架提供了基础 UI 组件：

- **Button** - 按钮（5种变体，3种尺寸）
- **Input** - 输入框（支持标签、错误提示）
- **Loading** - 加载组件（全屏/局部）

使用示例：

```typescript
import { Button, Input, Loading } from '@/components/common';

<Button 
  title="提交" 
  variant="primary" 
  size="lg"
  onPress={handleSubmit}
/>

<Input 
  label="用户名"
  error={errors.username}
  onChangeText={setValue}
/>

<Loading visible={loading} text="加载中..." />
```

## 🛠️ 开发指南

### 添加新页面

在 `app/` 目录下创建文件：

```typescript
// app/profile.tsx
export default function ProfileScreen() {
  return <Text>个人中心</Text>;
}
```

### 添加 API 服务

在 `src/services/` 创建服务：

```typescript
// src/services/user-service.ts
import { http } from '@/core/network';

export const userService = {
  getProfile: () => http.get('/user/profile'),
  updateProfile: (data) => http.put('/user/profile', data),
};
```

### 添加新语言

1. 在 `locales/` 创建语言文件：`ja-JP.json`
2. 在 `src/core/i18n/i18n.ts` 添加语言配置

## 🚀 部署

### 构建应用

```bash
# iOS
npx expo build:ios

# Android  
npx expo build:android

# 使用 EAS Build
eas build --platform all
```

## 📝 最佳实践

1. **模块化开发** - 按功能模块组织代码
2. **类型安全** - 充分利用 TypeScript 类型系统
3. **错误处理** - 使用统一的错误处理机制
4. **日志记录** - 在关键位置添加日志
5. **权限控制** - 前端权限+后端权限双重验证
6. **性能优化** - 使用 React.memo、useMemo、useCallback

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

## 🙏 致谢

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [Zustand](https://github.com/pmndrs/zustand)
- [i18next](https://www.i18next.com/)
- [Axios](https://axios-http.com/)

---

**🎉 开始使用企业级 Expo 框架，构建出色的应用！**
