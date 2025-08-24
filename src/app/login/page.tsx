'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/auth-store';
import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  GraduationCap,
  ArrowLeft,
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageToggle } from '@/components/ui/language-toggle';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const { t } = useTranslation();

  const loginSchema = z.object({
    email: z.string().email(t('login.emailPlaceholder')),
    password: z.string().min(1, t('login.passwordPlaceholder')),
  });

  type LoginFormData = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    const result = await login(data);

    if (result.success) {
      router.push(ROUTES.DASHBOARD);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* 顶部导航栏 */}
      <div className="bg-background border-b px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link
            href={ROUTES.HOME}
            className="text-muted-foreground hover:text-foreground flex items-center space-x-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t('common.backToHome')}</span>
          </Link>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <GraduationCap className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-foreground mt-6 text-3xl font-extrabold">
              {t('login.title')}
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              {t('login.noAccount')}{' '}
              <Link
                href={ROUTES.REGISTER}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {t('login.register')}
              </Link>
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('login.subtitle')}</CardTitle>
              <CardDescription>{t('login.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                    {error}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="text-foreground mb-2 block text-sm font-medium"
                  >
                    {t('login.email')}
                  </label>
                  <div className="relative">
                    <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      className="pl-10"
                      placeholder={t('login.emailPlaceholder')}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="text-foreground mb-2 block text-sm font-medium"
                  >
                    {t('login.password')}
                  </label>
                  <div className="relative">
                    <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      className="pr-10 pl-10"
                      placeholder={t('login.passwordPlaceholder')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transform cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="remember-me"
                      className="text-foreground ml-2 block text-sm"
                    >
                      {t('login.rememberMe')}
                    </label>
                  </div>

                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      {t('login.forgotPassword')}
                    </a>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loading size="sm" />
                      <span>{t('login.loggingIn')}</span>
                    </div>
                  ) : (
                    t('login.login')
                  )}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-background text-muted-foreground px-2">
                      {t('login.testAccounts')}
                    </span>
                  </div>
                </div>

                <div className="text-muted-foreground mt-4 space-y-2 text-sm">
                  <p>
                    <strong>{t('login.adminAccount')}：</strong>
                  </p>
                  <p>{t('login.email')}：admin@example.com</p>
                  <p>{t('login.password')}：password123</p>
                  <p className="mt-2">
                    <strong>{t('login.studentAccount')}：</strong>
                  </p>
                  <p>{t('login.email')}：student@example.com</p>
                  <p>{t('login.password')}：password123</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
