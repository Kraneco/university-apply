'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';
import { Footer } from './footer';
import { ROUTES } from '@/lib/constants';

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export function Layout({ children, showFooter = false }: LayoutProps) {
  const pathname = usePathname();

  // 定义不需要显示导航栏的页面
  const noNavbarRoutes = [ROUTES.LOGIN, ROUTES.REGISTER];
  const shouldShowNavbar = !noNavbarRoutes.includes(pathname as any);

  return (
    <div className="flex min-h-screen flex-col">
      {shouldShowNavbar && <Navbar />}
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
