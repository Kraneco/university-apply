import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'zh' | 'en';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'zh', // 默认中文
      setLanguage: (language: Language) => {
        set({ language });
      },
    }),
    {
      name: 'language-storage',
    }
  )
);
