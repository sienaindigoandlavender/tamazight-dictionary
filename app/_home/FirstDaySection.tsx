'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { DictionaryEntry } from '@/types';
import { getFirstDayEntries } from '@/lib/dictionary';
import { AMAWAL_LOCALE_KEY, AMAWAL_LOCALE_EVENT, type AmawalLocale } from '@/components/LocaleSwitcher';
import { pickByDay } from './util';

/**
 * "Your first day" — 8 must-know words, presented as a clean list.
 * Each row is its own dictionary entry. Click → /dictionary/[word].
 * No accordions, no expand toggles — clarity first.
 */
export default function FirstDaySection() {
  const [locale, setLocale] = useState<AmawalLocale>('en');

  useEffect(() => {
    const saved = localStorage.getItem(AMAWAL_LOCALE_KEY);
    if (saved === 'fr' || saved === 'en') setLocale(saved);
    const onChange = (e: Event) => setLocale((e as CustomEvent<AmawalLocale>).detail);
    window.addEventListener(AMAWAL_LOCALE_EVENT, onChange);
    return () => window.removeEventListener(AMAWAL_LOCALE_EVENT, onChange);
  }, []);

  const entries = useMemo<DictionaryEntry[]>(
    () => pickByDay(getFirstDayEntries('tachelhit'), 8),
    []
  );

  if (entries.length === 0) return null;

  const lang = locale === 'fr' ? 'fr' : 'en';

  return (
    <section
      className="border-t border-neutral-100 dark:border-white/10 px-6 md:px-[8%] lg:px-[12%] py-14 md:py-28"
      aria-labelledby="first-day-heading"
    >
      <div className="grid md:grid-cols-12 gap-10 mb-12 md:mb-16">
        <div className="md:col-span-7">
          <p className="text-[#c53a1a] text-[11px] font-medium uppercase tracking-[0.3em] mb-4">
            Essentials
          </p>
          <h2
            id="first-day-heading"
            className="font-display text-4xl md:text-5xl lg:text-6xl leading-[0.95] tracking-tight"
          >
            Your first<br /><em>day</em> words
          </h2>
        </div>
        <div className="md:col-span-4 md:col-start-9 flex items-end">
          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
            A handful of the 40 words that get you through Day 1 in Tamazight country. Say them badly — people will love you for trying.
          </p>
        </div>
      </div>

      <ul role="list" className="divide-y divide-neutral-100 dark:divide-white/10 border-y border-neutral-100 dark:border-white/10">
        {entries.map(e => {
          const meaning =
            e.definitions.find(d => d.language === lang)?.meaning ??
            e.definitions.find(d => d.language === 'en')?.meaning ??
            e.definitions[0]?.meaning;
          return (
            <li key={e.id}>
              <Link
                href={`/dictionary/${encodeURIComponent(e.word)}`}
                className="group flex items-baseline justify-between gap-6 py-5 md:py-6 hover:bg-neutral-50/60 dark:hover:bg-white/5 -mx-6 md:-mx-8 px-6 md:px-8 transition-colors"
              >
                <span className="flex items-baseline gap-5 min-w-0">
                  <span className="tifinagh text-2xl md:text-3xl text-[#c53a1a] shrink-0 leading-none">
                    {e.tifinagh}
                  </span>
                  <span className="font-display text-xl md:text-2xl tracking-tight truncate">
                    {e.word}
                  </span>
                </span>
                <span className="flex items-baseline gap-4 shrink-0">
                  <span className="text-neutral-700 dark:text-neutral-300 text-base md:text-lg truncate max-w-[40vw] md:max-w-none">{meaning}</span>
                  <svg
                    className="w-4 h-4 text-neutral-300 group-hover:text-[#c53a1a] group-hover:translate-x-1 transition-all shrink-0"
                    fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-10">
        <Link
          href="/first-day"
          className="text-sm uppercase tracking-[0.2em] text-[#c53a1a] hover:underline underline-offset-4"
        >
          All first-day words →
        </Link>
      </div>
    </section>
  );
}
