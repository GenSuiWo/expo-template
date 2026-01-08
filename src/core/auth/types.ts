/**
 * 认证模块类型定义
 */

/**
 * 用户信息接口
 */
export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  nickname?: string;
  phone?: string;
  roles?: string[];
  permissions?: string[];
  [key: string]: any;
}

/**
 * Token 信息接口
 */
export interface TokenInfo {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;  // 过期时间（秒）
  tokenType?: string;  // 通常为 'Bearer'
}

/**
 * 登录请求参数
 */
export interface LoginParams {
  username: string;
  password: string;
  captcha?: string;
  remember?: boolean;
}

/**
 * 登录响应数据
 */
export interface LoginResponse {
  user: User;
  token: TokenInfo;
}

/**
 * 注册请求参数
 */
export interface RegisterParams {
  username: string;
  password: string;
  email?: string;
  phone?: string;
  captcha?: string;
}

/**
 * 认证状态
 */
export enum AuthStatus {
  IDLE = 'idle',           // 未初始化
  LOADING = 'loading',     // 加载中
  AUTHENTICATED = 'authenticated',  // 已认证
  UNAUTHENTICATED = 'unauthenticated',  // 未认证
}

/**
 * 认证上下文状态
 */
export interface AuthState {
  status: AuthStatus;
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * 认证上下文操作
 */
export interface AuthActions {
  login: (params: LoginParams) => Promise<void>;
  logout: () => Promise<void>;
  register: (params: RegisterParams) => Promise<void>;
  refreshToken: () => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
  checkAuth: () => Promise<void>;
}

