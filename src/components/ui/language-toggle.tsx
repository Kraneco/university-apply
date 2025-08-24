'use client';

import { Languages } from 'lucide-react';
import { useLanguageStore, type Language } from '@/store/language-store';
import { useTranslation } from '@/lib/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function LanguageToggle() {
  const { setLanguage } = useLanguageStore();
  const { t } = useTranslation();

  const languages: { value: Language; label: string; flag: string }[] = [
    {
      value: 'zh',
      label: t('settings.chinese'),
      flag: '🇨🇳',
    },
    {
      value: 'en',
      label: t('settings.english'),
      flag: '🇺🇸',
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Languages className="h-4 w-4" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.value}
            onClick={() => setLanguage(lang.value)}
            className="flex items-center gap-2"
          >
            <span className="text-lg">{lang.flag}</span>
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
