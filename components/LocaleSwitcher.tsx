'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export type AmawalLocale = 'en' | 'fr';

export const AMAWAL_LOCALE_KEY = 'amawal-locale';
export const AMAWAL_LOCALE_EVENT = 'amawal-locale-change';

export default function LocaleSwitcher({ subtle = false }: { subtle?: boolean }) {
  const [locale, setLocaleState] = useState<AmawalLocale>('en');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Prefer cookie (set by next-intl flow), fall back to localStorage
    const cookieMatch = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]*)/);
    const cookieLocale = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;
    const stored = localStorage.getItem(AMAWAL_LOCALE_KEY);
    const initial = (cookieLocale === 'fr' || cookieLocale === 'en')
      ? cookieLocale
      : (stored === 'fr' || stored === 'en') ? stored : 'en';
    setLocaleState(initial);
  }, []);

  const setLocale = (next: AmawalLocale) => {
    if (next === locale) return;
    setLocaleState(next);
    localStorage.setItem(AMAWAL_LOCALE_KEY, next);
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    window.dispatchEvent(new CustomEvent<AmawalLocale>(AMAWAL_LOCALE_EVENT, { detail: next }));
    // Re-run server components so the chrome (header, footer, sections)
    // picks up the new translation. Scroll position is preserved.
    startTransition(() => router.refresh());
  };

  const baseClass = subtle
    ? 'text-[10px] uppercase tracking-[0.25em] transition-colors'
    : 'text-xs uppercase tracking-[0.2em] transition-colors';
  const activeClass = 'text-[#c53a1a]';
  const inactiveClass = subtle
    ? 'text-neutral-400 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300'
    : 'text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white';

  return (
    <div className={`inline-flex items-center gap-3 ${isPending ? 'opacity-60' : ''}`} aria-label="Switch language">
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
