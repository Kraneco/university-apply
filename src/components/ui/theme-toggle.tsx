'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useThemeStore, type Theme } from '@/store/theme-store';
import { useTranslation } from '@/lib/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();
  const { t } = useTranslation();

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    {
      value: 'light',
      label: t('settings.light'),
      icon: <Sun className="h-4 w-4" />,
    },
    {
      value: 'dark',
      label: t('settings.dark'),
      icon: <Moon className="h-4 w-4" />,
    },
    {
      value: 'system',
      label: t('settings.system'),
      icon: <Monitor className="h-4 w-4" />,
    },
  ];

  const currentTheme = themes.find((t) => t.value === theme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          {currentTheme?.icon}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value)}
            className="flex items-center gap-2"
          >
            {themeOption.icon}
            {themeOption.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
