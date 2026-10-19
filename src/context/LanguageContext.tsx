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
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('tibeb_locale') as Locale) || 'en';
    }
    return 'en';
  });

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tibeb_locale', l);
    }
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'en' ? 'am' : 'en');
  }, [locale, setLocale]);

  const t = useCallback(
    (key: string) => {
      return translations[locale][key] ?? translations['en'][key] ?? key;
    },
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, t, toggleLocale, setLocale, isAmharic: locale === 'am' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
