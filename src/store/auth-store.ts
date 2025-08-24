import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthState, LoginCredentials, RegisterData } from '@/types';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants';

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
}

// Mock用户数据
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: '管理员',
    role: 'admin',
    avatar: '/avatars/admin.jpg',
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
    avatar: '/avatars/student.jpg',
    phone: '+86 139 0000 0000',
    address: '上海市浦东新区',
    education: {
      highSchool: '上海中学',
      graduationYear: 2024,
      gpa: 3.8,
      satScore: 1450,
      toeflScore: 105,
      extracurriculars: ['学生会主席', '数学竞赛获奖', '志愿者服务'],
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });

        try {
          // 模拟API调用延迟
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // 查找用户
          const user = mockUsers.find((u) => u.email === credentials.email);

          if (!user) {
            return {
              success: false,
              message: ERROR_MESSAGES.INVALID_CREDENTIALS,
            };
          }

          // 模拟密码验证（实际项目中应该验证加密密码）
          if (credentials.password !== 'password123') {
            return {
              success: false,
              message: ERROR_MESSAGES.INVALID_CREDENTIALS,
            };
          }

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          return {
            success: true,
            message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
          };
        } catch {
          set({ isLoading: false });
          return {
            success: false,
            message: ERROR_MESSAGES.NETWORK_ERROR,
          };
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });

        try {
          // 模拟API调用延迟
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // 检查邮箱是否已存在
          const existingUser = mockUsers.find((u) => u.email === data.email);
          if (existingUser) {
            return {
              success: false,
              message: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
            };
          }

          // 创建新用户
          const newUser: User = {
            id: Date.now().toString(),
            email: data.email,
            name: data.name,
            role: 'student',
            phone: data.phone,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // 在实际项目中，这里会将用户添加到数据库
          // mockUsers.push(newUser);

          set({
            user: newUser,
            isAuthenticated: true,
            isLoading: false,
          });

          return {
            success: true,
            message: SUCCESS_MESSAGES.REGISTER_SUCCESS,
          };
        } catch {
          set({ isLoading: false });
          return {
            success: false,
            message: ERROR_MESSAGES.NETWORK_ERROR,
          };
        }
      },

      logout: () => {
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
              message: ERROR_MESSAGES.UNAUTHORIZED,
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
            message: SUCCESS_MESSAGES.PROFILE_UPDATED,
          };
        } catch {
          set({ isLoading: false });
          return {
            success: false,
            message: ERROR_MESSAGES.NETWORK_ERROR,
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
