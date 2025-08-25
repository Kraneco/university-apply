import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthState, LoginCredentials, RegisterData } from '@/types';

interface AuthStore extends AuthState {
  login: (
    credentials: LoginCredentials
  ) => Promise<{ success: boolean; message: string }>;
  register: (
    data: RegisterData
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (
    userData: Partial<User>
  ) => Promise<{ success: boolean; message: string }>;
  refreshUser: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

// Mock用户数据
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: '管理员',
    role: 'admin',
    avatarUrl: '/avatars/admin.jpg',
    phone: '+86 138 0000 0000',
    address: '北京市朝阳区',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'student@example.com',
    name: '张三',
    role: 'student',
    avatarUrl: '/avatars/student.jpg',
    phone: '+86 139 0000 0000',
    address: '上海市浦东新区',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true, // 初始状态设为 true，表示正在检查认证状态

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });

        try {
          // 调用真实的登录 API
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          });

          const result = await response.json();

          if (result.success) {
            set({
              user: result.data.user,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            // 登录失败
            set({ isLoading: false });
          }

          return result;
        } catch (error) {
          set({ isLoading: false });
          return {
            success: false,
            message: 'api.networkError',
          };
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });

        try {
          // 调用真实的注册 API
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          const result = await response.json();

          if (result.success) {
            // 注册成功后，自动登录
            const loginResponse = await fetch('/api/auth/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: data.email,
                password: data.password,
              }),
            });

            const loginResult = await loginResponse.json();

            if (loginResult.success) {
              set({
                user: loginResult.data.user,
                isAuthenticated: true,
                isLoading: false,
              });
            } else {
              // 登录失败，但注册成功
              set({ isLoading: false });
            }
          } else {
            // 注册失败
            set({ isLoading: false });
          }

          return result;
        } catch (error) {
          set({ isLoading: false });
          return {
            success: false,
            message: 'api.networkError',
          };
        }
      },

      logout: async () => {
        try {
          // 调用登出 API
          await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
        } catch (error) {
          // 即使API调用失败，也要清除本地状态
          console.error('登出API调用失败:', error);
        }

        // 清除本地存储
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('userEmail');

        // 清除状态
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      updateProfile: async (userData: Partial<User>) => {
        set({ isLoading: true });

        try {
          // 模拟API调用延迟
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const currentUser = get().user;
          if (!currentUser) {
            return {
              success: false,
              message: 'api.unauthorized',
            };
          }

          const updatedUser: User = {
            ...currentUser,
            ...userData,
            updatedAt: new Date().toISOString(),
          };

          set({
            user: updatedUser,
            isLoading: false,
          });

          return {
            success: true,
            message: 'api.profileUpdated',
          };
        } catch {
          set({ isLoading: false });
          return {
            success: false,
            message: 'api.networkError',
          };
        }
      },

      refreshUser: async () => {
        set({ isLoading: true });

        try {
          // 模拟API调用延迟
          await new Promise((resolve) => setTimeout(resolve, 500));

          const currentUser = get().user;
          if (!currentUser) {
            set({ isLoading: false });
            return;
          }

          // 在实际项目中，这里会从服务器获取最新的用户信息
          const updatedUser = mockUsers.find((u) => u.id === currentUser.id);

          if (updatedUser) {
            set({
              user: updatedUser,
              isLoading: false,
            });
          }
        } catch {
          set({ isLoading: false });
        }
      },

      checkAuth: async () => {
        try {
          const response = await fetch('/api/auth/me', {
            method: 'GET',
            credentials: 'include', // 包含 cookies
          });

          const result = await response.json();

          if (result.success) {
            set({
              user: result.data.user,
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
            return false;
          }
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return false;
        }
      },

      initializeAuth: async () => {
        // 如果已经初始化过，直接返回
        if (!get().isLoading) {
          return;
        }

        try {
          const response = await fetch('/api/auth/me', {
            method: 'GET',
            credentials: 'include',
          });

          const result = await response.json();

          if (result.success) {
            set({
              user: result.data.user,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('初始化认证状态失败:', error);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
