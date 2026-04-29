'use client';

import { useEffect, useState } from 'react';

export type AmawalLocale = 'en' | 'fr';

export const AMAWAL_LOCALE_KEY = 'amawal-locale';
export const AMAWAL_LOCALE_EVENT = 'amawal-locale-change';

export default function LocaleSwitcher({ subtle = false }: { subtle?: boolean }) {
  const [locale, setLocaleState] = useState<AmawalLocale>('en');

  useEffect(() => {
    const saved = localStorage.getItem(AMAWAL_LOCALE_KEY);
    if (saved === 'fr' || saved === 'en') setLocaleState(saved);
  }, []);

  const setLocale = (next: AmawalLocale) => {
    if (next === locale) return;
    setLocaleState(next);
    localStorage.setItem(AMAWAL_LOCALE_KEY, next);
    window.dispatchEvent(new CustomEvent<AmawalLocale>(AMAWAL_LOCALE_EVENT, { detail: next }));
  };

  const baseClass = subtle
    ? 'text-[10px] uppercase tracking-[0.25em] transition-colors'
    : 'text-xs uppercase tracking-[0.2em] transition-colors';
  const activeClass = 'text-[#c53a1a]';
  const inactiveClass = subtle
    ? 'text-neutral-400 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300'
    : 'text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white';

  return (
    <div className="inline-flex items-center gap-3" aria-label="Switch language">
      <button
        onClick={() => setLocale('en')}
        className={`${baseClass} ${locale === 'en' ? activeClass : inactiveClass}`}
        aria-pressed={locale === 'en'}
      >
        EN
      </button>
      <span className={`${baseClass} ${inactiveClass}`} aria-hidden="true">·</span>
      <button
        onClick={() => setLocale('fr')}
        className={`${baseClass} ${locale === 'fr' ? activeClass : inactiveClass}`}
        aria-pressed={locale === 'fr'}
      >
        FR
      </button>
    </div>
  );
}
