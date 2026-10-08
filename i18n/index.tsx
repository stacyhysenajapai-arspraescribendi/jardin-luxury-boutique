/**
 * Minimal, dependency-free i18n. All UI strings live in en.json / sq.json.
 * Usage: const { t, lang, setLang } = useI18n();  t('shop.results', { count: 4 })
 * Plurals: keys ending in _one / _other are picked automatically when `count` is passed.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import config from '../config';
import en from './en.json';
import sq from './sq.json';

export type Lang = 'en' | 'sq';
const dictionaries: Record<Lang, unknown> = { en, sq };
const STORAGE_KEY = 'jardin.lang';

type Params = Record<string, string | number>;

function lookup(dict: unknown, key: string): string | undefined {
  const value = key.split('.').reduce<unknown>(
    (node, part) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined),
    dict,
  );
  return typeof value === 'string' ? value : undefined;
}

export function translate(lang: Lang, key: string, params?: Params): string {
  let k = key;
  if (params && typeof params.count === 'number') {
    const plural = `${key}_${params.count === 1 ? 'one' : 'other'}`;
    if (lookup(dictionaries[lang], plural) ?? lookup(dictionaries.en, plural)) k = plural;
  }
  const template = lookup(dictionaries[lang], k) ?? lookup(dictionaries.en, k) ?? key;
  if (!params) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, p: string) => (params[p] !== undefined ? String(params[p]) : ''));
}

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, params?: Params) => string;
  /** Locale for dates, e.g. "en-GB" / "sq-AL". */
  locale: string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(config.defaultLanguage);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((v) => {
        if (v === 'en' || v === 'sq') setLangState(v);
      })
      .catch(() => {});
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    AsyncStorage.setItem(STORAGE_KEY, l).catch(() => {});
  }, []);

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      setLang,
      t: (key, params) => translate(lang, key, params),
      locale: lang === 'sq' ? 'sq-AL' : 'en-GB',
    }),
    [lang, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
