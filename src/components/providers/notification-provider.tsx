'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useNotificationStore } from '@/store/notification-store';

interface NotificationProviderProps {
  children: React.ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { isAuthenticated, user } = useAuthStore();
  const { setUnreadCount, setLastFetched, shouldRefetch } = useNotificationStore();

  // 初始化通知状态
  useEffect(() => {
    const initializeNotifications = async () => {
      if (!isAuthenticated || !user) {
        setUnreadCount(0);
        return;
      }

      // 检查是否需要重新获取
      if (!shouldRefetch()) {
        return;
      }

      try {
        const response = await fetch('/api/notifications?unread=true');
        const result = await response.json();

        if (result.success) {
          const count = result.data?.length || 0;
          setUnreadCount(count);
          setLastFetched(Date.now());
        } else {
          setUnreadCount(0);
          setLastFetched(Date.now());
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
        setUnreadCount(0);
        setLastFetched(Date.now());
      }
    };

    initializeNotifications();
  }, [isAuthenticated, user, setUnreadCount, setLastFetched, shouldRefetch]);

  return <>{children}</>;
}
