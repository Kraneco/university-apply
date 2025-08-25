'use client';

import { ThemeToggle } from './theme-toggle';
import { LanguageToggle } from './language-toggle';

interface ThemeLanguageToggleProps {
  className?: string;
}

export function ThemeLanguageToggle({ className }: ThemeLanguageToggleProps) {
  return (
    <div className={`flex items-center space-x-2 ${className || ''}`}>
      <ThemeToggle />
      <LanguageToggle />
    </div>
  );
}
