'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    // 在应用启动时初始化认证状态
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
}
