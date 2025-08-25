'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeLanguageToggle } from '@/components/ui/theme-language-toggle';
import { UserDropdown } from '@/components/layout/user-dropdown';
import { useNotifications } from '@/hooks/use-notifications';
import {
  Menu,
  X,
  Home,
  GraduationCap,
  Building2,
  Bell,
  Clock,
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export function Navbar() {
  const { isAuthenticated, user } = useAuthStore();
  const { t } = useTranslation();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { unreadCount } = useNotifications();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // 点击外部隐藏移动端菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // 检查当前路径是否匹配导航项
  const isActive = (href: string) => {
    if (href === ROUTES.HOME) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const allItems = [
    {
      name: t('navigation.home'),
      href: ROUTES.HOME,
      icon: Home,
    },
    {
      name: t('navigation.dashboard'),
      href: ROUTES.DASHBOARD,
      icon: GraduationCap,
    },
    {
      name: t('navigation.applications'),
      href: ROUTES.APPLICATIONS,
      icon: GraduationCap,
    },
    {
      name: t('navigation.universities'),
      href: ROUTES.UNIVERSITIES,
      icon: Building2,
    },
    {
      name: t('navigation.reminders'),
      href: ROUTES.REMINDERS,
      icon: Clock,
    },
    {
      name: t('navigation.notifications'),
      href: ROUTES.NOTIFICATIONS,
      icon: Bell,
    },
  ];

  return (
    <nav className="bg-background border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={ROUTES.HOME} className="flex items-center space-x-2">
              <GraduationCap className="text-primary h-8 w-8" />
              <span className="text-xl font-bold">UAT</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-6 xl:flex">
            {/* 首页链接 - 所有人都能看到 */}
            <Link
              href={ROUTES.HOME}
              className={`flex items-center space-x-1 rounded-md px-3 py-2 transition-all duration-200 ${
                isActive(ROUTES.HOME)
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/20 hover:shadow-sm'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>{t('navigation.home')}</span>
            </Link>

            {/* 登录用户才能看到的导航项 */}
            {isAuthenticated && (
              <>
                {allItems.slice(1).map(
                  (
                    item // Exclude the first item (Home) as it's now always visible
                  ) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-1 rounded-md px-3 py-2 transition-all duration-200 ${
                        isActive(item.href)
                          ? 'text-primary bg-primary/10'
                          : 'text-muted-foreground hover:text-primary hover:bg-primary/20 hover:shadow-sm'
                      }`}
                    >
                      <div className="relative">
                        <item.icon className="h-4 w-4" />
                        {/* 为通知项添加未读数量 badge */}
                        {item.href === ROUTES.NOTIFICATIONS &&
                          unreadCount > 0 && (
                            <Badge
                              variant="destructive"
                              className="absolute -top-1 -right-16 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                            >
                              {unreadCount > 99 ? '99+' : unreadCount}
                            </Badge>
                          )}
                      </div>
                      <span>{item.name}</span>
                    </Link>
                  )
                )}
              </>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <ThemeLanguageToggle />

            {isAuthenticated ? (
              <UserDropdown user={user} />
            ) : (
              <div className="hidden items-center space-x-4 xl:flex">
                <Link href={ROUTES.LOGIN}>
                  <Button variant="ghost">{t('navigation.login')}</Button>
                </Link>
                <Link href={ROUTES.REGISTER}>
                  <Button>{t('navigation.register')}</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="xl:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t xl:hidden" ref={mobileMenuRef}>
          <div className="space-y-1 px-2 pt-2 pb-3">
            {/* 首页链接 - 所有人都能看到 */}
            <Link
              href={ROUTES.HOME}
              className={`flex items-center space-x-2 rounded-md px-3 py-2 transition-all duration-200 ${
                isActive(ROUTES.HOME)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-primary/20 hover:text-primary'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-4 w-4" />
              <span>{t('navigation.home')}</span>
            </Link>

            {/* 登录用户才能看到的导航项 */}
            {isAuthenticated &&
              allItems.slice(1).map(
                (
                  item // Exclude the first item (Home)
                ) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 rounded-md px-3 py-2 transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-primary/20 hover:text-primary'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="relative">
                      <item.icon className="h-4 w-4" />
                      {/* 为通知项添加未读数量 badge */}
                      {item.href === ROUTES.NOTIFICATIONS &&
                        unreadCount > 0 && (
                          <Badge
                            variant="destructive"
                            className="absolute -top-0.5 -right-18 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                          >
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </Badge>
                        )}
                    </div>
                    <span>{item.name}</span>
                  </Link>
                )
              )}
            {!isAuthenticated && (
              <>
                <Link
                  href={ROUTES.LOGIN}
                  className="text-muted-foreground hover:bg-primary/20 hover:text-primary block rounded-md px-3 py-2 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('navigation.login')}
                </Link>
                <Link
                  href={ROUTES.REGISTER}
                  className="text-muted-foreground hover:bg-primary/20 hover:text-primary block rounded-md px-3 py-2 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('navigation.register')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
