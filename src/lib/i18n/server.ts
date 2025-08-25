import { getTranslation, type Language } from './index';

/**
 * 服务器端翻译函数
 * 用于在服务器端组件中获取翻译
 */
export function serverTranslate(language: Language, key: string): string {
  return getTranslation(language, key);
}

/**
 * 获取默认语言的翻译
 */
export function getDefaultTranslation(key: string): string {
  return getTranslation('zh', key);
}

/**
 * 格式化翻译文本，支持参数替换
 */
export function formatTranslation(
  language: Language,
  key: string,
  params: Record<string, string | number> = {}
): string {
  let translation = getTranslation(language, key);

  // 替换参数
  Object.entries(params).forEach(([param, value]) => {
    translation = translation.replace(
      new RegExp(`{${param}}`, 'g'),
      String(value)
    );
  });

  return translation;
}

/**
 * 获取翻译键的元数据
 */
export function getTranslationMetadata() {
  return {
    supportedLanguages: ['zh', 'en'] as const,
    defaultLanguage: 'zh' as const,
    fallbackLanguage: 'zh' as const,
  };
}
