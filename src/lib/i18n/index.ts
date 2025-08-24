import { zh } from './zh';
import { en } from './en';
import { useLanguageStore } from '@/store/language-store';

export type TranslationKey = keyof typeof zh;

const translations = {
  zh,
  en,
};

export function useTranslation() {
  const { language } = useLanguageStore();

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: unknown = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return { t, language };
}

export function getTranslation(language: 'zh' | 'en', key: string): string {
  const keys = key.split('.');
  let value: unknown = translations[language];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }

  return typeof value === 'string' ? value : key;
}
