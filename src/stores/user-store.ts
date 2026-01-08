/**
 * 用户状态管理
 * 使用 Zustand 管理用户相关的全局状态
 */

import { create } from 'zustand';
import type { User } from '@/core/auth/types';

/**
 * 用户状态接口
 */
interface UserState {
  // 状态
  user: User | null;
  isOnline: boolean;
  lastActive: number;
  
  // 操作
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  setOnlineStatus: (isOnline: boolean) => void;
  updateLastActive: () => void;
  clearUser: () => void;
}

/**
 * 创建用户状态 Store
 */
export const useUserStore = create<UserState>((set) => ({
  // 初始状态
  user: null,
  isOnline: true,
  lastActive: Date.now(),
  
  // 设置用户
  setUser: (user) => set({ user }),
  
  // 更新用户信息
  updateUser: (updates) => set((state) => ({
    user: state.user ? { ...state.user, ...updates } : null,
  })),
  
  // 设置在线状态
  setOnlineStatus: (isOnline) => set({ isOnline }),
  
  // 更新最后活跃时间
  updateLastActive: () => set({ lastActive: Date.now() }),
  
  // 清除用户
  clearUser: () => set({ user: null }),
}));

