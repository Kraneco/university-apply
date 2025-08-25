'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';
import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { User, LogOut, Settings, Bell } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { User as UserType } from '@/types';

interface UserDropdownProps {
  user: UserType | null;
}

export function UserDropdown({ user }: UserDropdownProps) {
  const { logout } = useAuthStore();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  // 点击外部隐藏下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        <User className="h-5 w-5" />
        <span className="hidden sm:block">{user?.name}</span>
      </Button>

      {isOpen && (
        <div className="bg-popover absolute right-0 z-50 mt-2 w-48 rounded-md border py-1 shadow-lg">
          <Link
            href={ROUTES.PROFILE}
            className="text-popover-foreground hover:bg-accent flex items-center px-4 py-2 text-sm"
            onClick={() => setIsOpen(false)}
          >
            <User className="mr-2 h-4 w-4" />
            {t('navigation.profile')}
          </Link>
          {/* <Link
            href={ROUTES.SETTINGS}
            className="text-popover-foreground hover:bg-accent flex items-center px-4 py-2 text-sm"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="mr-2 h-4 w-4" />
            {t('navigation.settings')}
          </Link> */}
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
  );
}
