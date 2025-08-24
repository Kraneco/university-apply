'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';
import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageToggle } from '@/components/ui/language-toggle';
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Bell,
  GraduationCap,
  FileText,
  Home,
  Users,
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const navigationItems = [
    { name: t('navigation.home'), href: ROUTES.HOME, icon: Home },
    {
      name: t('navigation.universities'),
      href: ROUTES.UNIVERSITIES,
      icon: GraduationCap,
    },
    {
      name: t('navigation.applications'),
      href: ROUTES.APPLICATIONS,
      icon: FileText,
    },
  ];

  // 管理员额外菜单项
  const adminItems = [{ name: '用户管理', href: ROUTES.ADMIN, icon: Users }];

  const allItems =
    user?.role === 'admin'
      ? [...navigationItems, ...adminItems]
      : navigationItems;

  return (
    <nav className="bg-background border-b shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={ROUTES.HOME} className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="text-foreground text-xl font-bold">
                大学申请跟踪
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            {isAuthenticated && (
              <>
                {allItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-muted-foreground hover:text-primary flex items-center space-x-1 transition-colors"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Theme and Language Toggles */}
            <ThemeToggle />
            <LanguageToggle />

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    3
                  </span>
                </Button>

                {/* User Menu */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2"
                  >
                    <User className="h-5 w-5" />
                    <span className="hidden sm:block">{user?.name}</span>
                  </Button>

                  {isMenuOpen && (
                    <div className="bg-popover absolute right-0 z-50 mt-2 w-48 rounded-md border py-1 shadow-lg">
                      <Link
                        href={ROUTES.PROFILE}
                        className="text-popover-foreground hover:bg-accent flex items-center px-4 py-2 text-sm"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="mr-2 h-4 w-4" />
                        {t('navigation.profile')}
                      </Link>
                      <Link
                        href={ROUTES.SETTINGS}
                        className="text-popover-foreground hover:bg-accent flex items-center px-4 py-2 text-sm"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        {t('navigation.settings')}
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="text-popover-foreground hover:bg-accent flex w-full cursor-pointer items-center px-4 py-2 text-sm"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        {t('navigation.logout')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href={ROUTES.LOGIN}>
                  <Button variant="ghost">{t('navigation.login')}</Button>
                </Link>
                <Link href={ROUTES.REGISTER}>
                  <Button>{t('navigation.register')}</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
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
        <div className="border-t md:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3">
            {isAuthenticated &&
              allItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:bg-accent hover:text-primary flex items-center space-x-2 rounded-md px-3 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            {!isAuthenticated && (
              <>
                <Link
                  href={ROUTES.LOGIN}
                  className="text-muted-foreground hover:bg-accent hover:text-primary block rounded-md px-3 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('navigation.login')}
                </Link>
                <Link
                  href={ROUTES.REGISTER}
                  className="text-muted-foreground hover:bg-accent hover:text-primary block rounded-md px-3 py-2"
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
