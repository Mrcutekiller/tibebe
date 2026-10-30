'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { translations, Locale } from '@/lib/i18n';

interface LanguageContextType {
  locale: Locale;
  t: (key: string) => string;
  toggleLocale: () => void;
  setLocale: (l: Locale) => void;
  isAmharic: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale] = useState<Locale>('en');

  const setLocale = useCallback((_l: Locale) => {
    // English only
  }, []);

  const toggleLocale = useCallback(() => {
    // English only
  }, []);

  const t = useCallback(
    (key: string) => {
      return translations['en'][key] ?? key;
    },
    []
  );

  return (
    <LanguageContext.Provider value={{ locale: 'en', t, toggleLocale, setLocale, isAmharic: false }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
