import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import en from './locales/en.json';
import fr from './locales/fr.json';

// ─── Types ──────────────────────────────────────────────────────────
export type Language = 'en' | 'fr';

type TranslationValue = string | Record<string, unknown>;

interface Translations {
  [key: string]: TranslationValue;
}

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

// ─── Translation data ───────────────────────────────────────────────
const translations: Record<Language, Translations> = { en, fr };

// ─── Helper: resolve nested key like "nav.home" ─────────────────────
function resolve(obj: unknown, path: string): string | undefined {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === 'string' ? current : undefined;
}

// ─── Interpolation: replace {{var}} with values ─────────────────────
function interpolate(text: string, params?: Record<string, string | number>): string {
  if (!params) return text;
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return params[key] !== undefined ? String(params[key]) : `{{${key}}}`;
  });
}

// ─── Context ────────────────────────────────────────────────────────
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// ─── Storage key ────────────────────────────────────────────────────
const LANG_KEY = 'muscletiki_lang';

// ─── Provider ───────────────────────────────────────────────────────
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem(LANG_KEY);
      if (stored === 'en' || stored === 'fr') return stored;
    } catch {}
    return 'fr'; // Default to French
  });

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(LANG_KEY, newLang);
    } catch {}
    // Update document lang attribute
    document.documentElement.lang = newLang;
  }, []);

  // Set initial document lang
  useEffect(() => {
    document.documentElement.lang = lang;
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const value = resolve(translations[lang], key);
      if (value !== undefined) return interpolate(value, params);

      // Fallback to English
      if (lang !== 'en') {
        const fallback = resolve(translations['en'], key);
        if (fallback !== undefined) return interpolate(fallback, params);
      }

      // Return key as last resort (helps spot missing translations)
      console.warn(`[i18n] Missing translation: "${key}" for lang "${lang}"`);
      return key;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────
export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within a <LanguageProvider>');
  }
  return ctx;
}

export default LanguageContext;
