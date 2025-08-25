import { zh } from './zh';
import { en } from './en';
import { useLanguageStore } from '@/store/language-store';

export type TranslationKey = keyof typeof zh;
export type Language = 'zh' | 'en';

const translations = {
  zh,
  en,
} as const;

// 缓存翻译结果以提高性能
const translationCache = new Map<string, string>();

/**
 * 获取嵌套对象的属性值
 */
function getNestedValue(obj: unknown, path: string): unknown {
  const keys = path.split('.');
  let value: unknown = obj;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }

  return value;
}

/**
 * 翻译函数
 */
function translate(language: Language, key: string): string {
  // 检查缓存
  const cacheKey = `${language}:${key}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  const value = getNestedValue(translations[language], key);

  if (typeof value === 'string') {
    // 缓存结果
    translationCache.set(cacheKey, value);
    return value;
  }

  // 如果当前语言没有找到，尝试使用中文作为后备
  if (language !== 'zh') {
    const fallbackValue = getNestedValue(translations.zh, key);
    if (typeof fallbackValue === 'string') {
      console.warn(
        `Translation key not found in ${language}: ${key}, using zh fallback`
      );
      translationCache.set(cacheKey, fallbackValue);
      return fallbackValue;
    }
  }

  // 如果都没有找到，返回键名
  console.warn(`Translation key not found: ${key}`);
  return key;
}

/**
 * React Hook for translations
 */
export function useTranslation() {
  const { language } = useLanguageStore();

  const t = (key: string): string => {
    return translate(language, key);
  };

  return { t, language };
}

/**
 * 获取指定语言的翻译
 */
export function getTranslation(language: Language, key: string): string {
  return translate(language, key);
}

/**
 * 获取所有支持的语言
 */
export function getSupportedLanguages(): Language[] {
  return Object.keys(translations) as Language[];
}

/**
 * 检查翻译键是否存在
 */
export function hasTranslation(language: Language, key: string): boolean {
  const value = getNestedValue(translations[language], key);
  return typeof value === 'string';
}

/**
 * 清除翻译缓存
 */
export function clearTranslationCache(): void {
  translationCache.clear();
}

/**
 * 获取翻译统计信息
 */
export function getTranslationStats() {
  const stats = {
    totalKeys: 0,
    languages: {} as Record<Language, number>,
  };

  // 计算中文翻译的键数量（作为基准）
  const countKeys = (obj: unknown): number => {
    if (typeof obj !== 'object' || obj === null) {
      return 0;
    }

    let count = 0;
    for (const key in obj) {
      const value = (obj as Record<string, unknown>)[key];
      if (typeof value === 'string') {
        count++;
      } else if (typeof value === 'object' && value !== null) {
        count += countKeys(value);
      }
    }
    return count;
  };

  stats.totalKeys = countKeys(translations.zh);

  for (const lang of getSupportedLanguages()) {
    stats.languages[lang] = countKeys(translations[lang]);
  }

  return stats;
}
