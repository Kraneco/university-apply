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
  User,
  Phone,
  GraduationCap,
  ArrowLeft,
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { validatePassword } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageToggle } from '@/components/ui/language-toggle';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const router = useRouter();
  const { register: registerUser, isLoading } = useAuthStore();
  const { t } = useTranslation();

  const registerSchema = z
    .object({
      name: z.string().min(2, t('register.namePlaceholder')),
      email: z.string().email(t('register.emailPlaceholder')),
      phone: z.string().optional(),
      password: z.string().min(8, t('register.passwordPlaceholder')),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('register.passwordMismatch'),
      path: ['confirmPassword'],
    });

  type RegisterFormData = z.infer<typeof registerSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const validation = validatePassword(value);
    setPasswordErrors(validation.errors);
  };

  const onSubmit = async (data: RegisterFormData) => {
    setError('');

    // 验证密码强度
    const validation = validatePassword(data.password);
    if (!validation.isValid) {
      setPasswordErrors(validation.errors);
      return;
    }

    const result = await registerUser({
      email: data.email,
      password: data.password,
      name: data.name,
      role: 'student',
      phone: data.phone,
    });

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
              {t('register.title')}
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              {t('register.hasAccount')}{' '}
              <Link
                href={ROUTES.LOGIN}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {t('register.login')}
              </Link>
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('register.subtitle')}</CardTitle>
              <CardDescription>{t('register.description')}</CardDescription>
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
                    htmlFor="name"
                    className="text-foreground mb-2 block text-sm font-medium"
                  >
                    {t('register.name')}
                  </label>
                  <div className="relative">
                    <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      {...register('name')}
                      className="pl-10"
                      placeholder={t('register.namePlaceholder')}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="text-foreground mb-2 block text-sm font-medium"
                  >
                    {t('register.email')}
                  </label>
                  <div className="relative">
                    <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      className="pl-10"
                      placeholder={t('register.emailPlaceholder')}
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
                    htmlFor="phone"
                    className="text-foreground mb-2 block text-sm font-medium"
                  >
                    {t('register.phone')}
                  </label>
                  <div className="relative">
                    <Phone className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                    <Input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      className="pl-10"
                      placeholder={t('register.phonePlaceholder')}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="text-foreground mb-2 block text-sm font-medium"
                  >
                    {t('register.password')}
                  </label>
                  <div className="relative">
                    <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      onChange={handlePasswordChange}
                      className="pr-10 pl-10"
                      placeholder={t('register.passwordPlaceholder')}
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
                  {passwordErrors.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {passwordErrors.map((error, index) => (
                        <p key={index} className="text-sm text-red-600">
                          • {error}
                        </p>
                      ))}
                    </div>
                  )}
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="text-foreground mb-2 block text-sm font-medium"
                  >
                    {t('register.confirmPassword')}
                  </label>
                  <div className="relative">
                    <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...register('confirmPassword')}
                      className="pr-10 pl-10"
                      placeholder={t('register.confirmPasswordPlaceholder')}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transform cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    id="agree-terms"
                    name="agree-terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="agree-terms"
                    className="text-foreground ml-2 block text-sm"
                  >
                    {t('register.agreeTerms')}{' '}
                    <a href="#" className="text-primary hover:text-primary/80">
                      {t('register.termsOfService')}
                    </a>{' '}
                    {t('register.and')}{' '}
                    <a href="#" className="text-primary hover:text-primary/80">
                      {t('register.privacyPolicy')}
                    </a>
                  </label>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loading size="sm" />
                      <span>{t('register.creatingAccount')}</span>
                    </div>
                  ) : (
                    t('register.createAccount')
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
