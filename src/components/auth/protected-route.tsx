'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { useTranslation } from '@/lib/i18n';
import { LoadingPage } from '@/components/ui/loading';
import { ROUTES } from '@/lib/constants';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'student' | 'admin';
  fallback?: ReactNode;
  public?: boolean; // 新增：是否为公开页面
}

export function ProtectedRoute({
  children,
  requiredRole,
  fallback,
  public: isPublic = false,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    // 如果是公开页面，不需要重定向
    if (isPublic) {
      return;
    }

    if (!isLoading && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, isLoading, router, isPublic]);

  // 如果是公开页面，直接渲染内容
  if (isPublic) {
    return <>{children}</>;
  }

  // 检查角色权限
  const hasRequiredRole = !requiredRole || user?.role === requiredRole;

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return fallback || <LoadingPage />;
  }

  if (!hasRequiredRole) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-foreground mb-2 text-2xl font-bold">
            {t('error.accessDenied')}
          </h1>
          <p className="text-muted-foreground mb-4">
            {t('error.accessDeniedDescription')}
          </p>
          <button
            onClick={() => router.push(ROUTES.HOME)}
            className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {t('error.backToHome')}
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// 公开路由 - 不需要登录
export function PublicRoute({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ProtectedRoute public={true} fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}

// 学生专用路由
export function StudentRoute({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="student" fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}

// 管理员专用路由
export function AdminRoute({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="admin" fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}
