import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useNotificationStore } from '@/store/notification-store';

export function useNotifications() {
  const { isAuthenticated, user } = useAuthStore();
  const { 
    unreadCount, 
    setUnreadCount, 
    setLastFetched, 
    shouldRefetch 
  } = useNotificationStore();

  const fetchUnreadCount = async () => {
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
      console.error('Error fetching unread notifications:', error);
      setUnreadCount(0);
      setLastFetched(Date.now());
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, [isAuthenticated, user]);

  // 定期刷新未读数量（每30秒）
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      if (shouldRefetch()) {
        fetchUnreadCount();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return {
    unreadCount,
    refetch: fetchUnreadCount,
  };
}
