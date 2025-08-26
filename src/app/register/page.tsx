'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/auth-store';
import { useTranslation } from '@/lib/i18n';
import { Layout } from '@/components/layout/layout';
import { PublicRoute } from '@/components/auth/protected-route';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

const registerSchema = z
  .object({
    name: z.string().min(2, '姓名至少需要2个字符'),
    email: z.string().email('请输入有效的邮箱地址'),
    phone: z.string().optional(),
    password: z.string().min(8, '密码至少需要8个字符'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '密码不匹配',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterContent() {
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const { register: registerUser, isLoading, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // 如果用户已登录，重定向到dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, router]);

  // 如果用户已登录，显示加载状态
  if (isAuthenticated) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="text-muted-foreground">正在跳转...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const validatePassword = (password: string) => {
    const errors: string[] = [];
    if (password.length < 8) {
      errors.push('密码至少需要8个字符');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('密码需要包含至少一个大写字母');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('密码需要包含至少一个小写字母');
    }
    if (!/\d/.test(password)) {
      errors.push('密码需要包含至少一个数字');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('密码需要包含至少一个特殊字符');
    }
    return errors;
  };

  const onSubmit = async (data: RegisterFormData) => {
    setError('');
    setPasswordErrors([]);

    const passwordValidationErrors = validatePassword(data.password);
    if (passwordValidationErrors.length > 0) {
      setPasswordErrors(passwordValidationErrors);
      return;
    }

    try {
      const result = await registerUser({
        email: data.email,
        password: data.password,
        name: data.name,
        role: 'student', // 固定为student角色
        phone: data.phone,
      });
      if (result.success) {
        router.push(ROUTES.DASHBOARD);
      } else {
        let errorMessage = result.message || '注册失败，请稍后重试';
        if (errorMessage && errorMessage.startsWith('api.')) {
          errorMessage = t(errorMessage);
        }
        setError(errorMessage);
      }
    } catch (error) {
      console.log(error);
      setError('注册过程中发生错误，请稍后重试');
    }
  };

  return (
    <Layout>
      <div className="from-background via-muted/20 to-background flex min-h-screen items-center justify-center bg-gradient-to-br px-4 py-12 sm:px-6 lg:px-8">
        {/* 返回首页按钮 */}
        <div className="absolute top-6 left-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">{t('common.backToHome')}</span>
          </Button>
        </div>

        <div className="w-full max-w-md space-y-8">
          <Card className="border-border/50 bg-card/80 shadow-xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center">
                {t('register.title')}
              </CardTitle>
              <CardDescription className="text-center">
                {t('register.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="text-foreground block text-sm font-medium"
                  >
                    {t('register.name')}
                  </label>
                  <div className="relative mt-1">
                    <Input
                      id="name"
                      type="text"
                      placeholder={t('register.namePlaceholder')}
                      {...register('name')}
                      className="pl-10"
                    />
                    <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="text-foreground block text-sm font-medium"
                  >
                    {t('register.email')}
                  </label>
                  <div className="relative mt-1">
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('register.emailPlaceholder')}
                      {...register('email')}
                      className="pl-10"
                    />
                    <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="text-foreground block text-sm font-medium"
                  >
                    {t('register.phone')}
                  </label>
                  <div className="relative mt-1">
                    <Input
                      id="phone"
                      type="tel"
                      placeholder={t('register.phonePlaceholder')}
                      {...register('phone')}
                      className="pl-10"
                    />
                    <Phone className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="text-foreground block text-sm font-medium"
                  >
                    {t('register.password')}
                  </label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('register.passwordPlaceholder')}
                      {...register('password')}
                      className="pr-10 pl-10"
                    />
                    <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="text-foreground block text-sm font-medium"
                  >
                    {t('register.confirmPassword')}
                  </label>
                  <div className="relative mt-1">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder={t('register.confirmPasswordPlaceholder')}
                      {...register('confirmPassword')}
                      className="pr-10 pl-10"
                    />
                    <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {passwordErrors.length > 0 && (
                  <div className="bg-destructive/10 border-destructive/20 rounded-md border p-4">
                    <h4 className="text-destructive text-sm font-medium">
                      {t('register.passwordRequirements')}
                    </h4>
                    <ul className="text-destructive/80 mt-2 list-disc space-y-1 pl-5 text-sm">
                      {passwordErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {error && (
                  <div className="bg-destructive/10 border-destructive/20 rounded-md border p-4">
                    <p className="text-destructive text-sm">{error}</p>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading
                    ? t('register.creatingAccount')
                    : t('register.createAccount')}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="border-border w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-card text-muted-foreground px-2">
                      {t('register.hasAccount')}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push(ROUTES.LOGIN)}
                  >
                    {t('register.login')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

export default function RegisterPage() {
  return (
    <PublicRoute>
      <RegisterContent />
    </PublicRoute>
  );
}
