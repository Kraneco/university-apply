'use client';

import { Languages } from 'lucide-react';
import { useLanguageStore } from '@/store/language-store';
import { useTranslation } from '@/lib/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();

  const languages: { value: 'zh' | 'en'; label: string; flag: string }[] = [
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

  const currentLanguage = languages.find((lang) => lang.value === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9"
          title={t('settings.language')}
        >
          <Languages className="h-4 w-4" />
          {currentLanguage && (
            <span className="absolute -top-1 -right-1 text-xs">
              {currentLanguage.flag}
            </span>
          )}
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.value}
            onClick={() => setLanguage(lang.value)}
            className={`flex items-center gap-2 ${
              language === lang.value ? 'bg-accent' : ''
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span>{lang.label}</span>
            {language === lang.value && (
              <span className="text-muted-foreground ml-auto text-xs">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
