import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Language } from '@/lib/i18n';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'zh', // 默认中文
      setLanguage: (language: Language) => {
        set({ language });
      },
      toggleLanguage: () => {
        const currentLanguage = get().language;
        const newLanguage: Language = currentLanguage === 'zh' ? 'en' : 'zh';
        set({ language: newLanguage });
      },
    }),
    {
      name: 'language-storage',
      version: 1,
    }
  )
);
