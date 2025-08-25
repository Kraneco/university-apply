import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NotificationState {
  unreadCount: number;
  lastFetched: number | null;
  setUnreadCount: (count: number) => void;
  incrementUnreadCount: () => void;
  decrementUnreadCount: () => void;
  resetUnreadCount: () => void;
  setLastFetched: (timestamp: number) => void;
  shouldRefetch: () => boolean;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      unreadCount: 0,
      lastFetched: null,
      
      setUnreadCount: (count: number) => set({ unreadCount: count }),
      
      incrementUnreadCount: () => set((state) => ({ 
        unreadCount: Math.min(state.unreadCount + 1, 99) 
      })),
      
      decrementUnreadCount: () => set((state) => ({ 
        unreadCount: Math.max(state.unreadCount - 1, 0) 
      })),
      
      resetUnreadCount: () => set({ unreadCount: 0 }),
      
      setLastFetched: (timestamp: number) => set({ lastFetched: timestamp }),
      
      shouldRefetch: () => {
        const { lastFetched } = get();
        if (!lastFetched) return true;
        
        // 如果距离上次获取超过30秒，则需要重新获取
        const now = Date.now();
        return now - lastFetched > 30000;
      },
    }),
    {
      name: 'notification-store',
      partialize: (state) => ({ 
        unreadCount: state.unreadCount, 
        lastFetched: state.lastFetched 
      }),
    }
  )
);
