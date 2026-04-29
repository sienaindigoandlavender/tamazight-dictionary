'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { DictionaryEntry } from '@/types';
import { getRichEntries } from '@/lib/dictionary';
import { AMAWAL_LOCALE_KEY, AMAWAL_LOCALE_EVENT, type AmawalLocale } from '@/components/LocaleSwitcher';
import { dayIndex } from './util';

/**
 * Word of the day — quiet ritual section.
 * One word. One translation. One cultural note.
 * Fresh every day, deterministic per day (SSR-safe).
 */
export default function WordOfTheDay() {
  const [locale, setLocale] = useState<AmawalLocale>('en');

  useEffect(() => {
    const saved = localStorage.getItem(AMAWAL_LOCALE_KEY);
    if (saved === 'fr' || saved === 'en') setLocale(saved);
    const onChange = (e: Event) => setLocale((e as CustomEvent<AmawalLocale>).detail);
    window.addEventListener(AMAWAL_LOCALE_EVENT, onChange);
    return () => window.removeEventListener(AMAWAL_LOCALE_EVENT, onChange);
  }, []);

  const entry = useMemo<DictionaryEntry | null>(() => {
    const pool = getRichEntries('tachelhit');
    if (pool.length === 0) return null;
    return pool[dayIndex() % pool.length];
  }, []);

  if (!entry) return null;

  const primaryLang = locale === 'fr' ? 'fr' : 'en';
  const secondaryLang = locale === 'fr' ? 'en' : 'fr';
  const meaning =
    entry.definitions.find(d => d.language === primaryLang)?.meaning ??
    entry.definitions[0]?.meaning;
  const secondary = entry.definitions.find(d => d.language === secondaryLang)?.meaning;

  const culturalNote =
    entry.usageNotes?.find(u => u.type === 'cultural')?.text ??
    entry.usageNotes?.[0]?.text ??
    entry.etymology?.notes;

  return (
    <section
      className="border-t border-neutral-100 dark:border-white/10 px-6 md:px-[8%] lg:px-[12%] py-14 md:py-28"
      aria-labelledby="wotd-heading"
    >
      <div className="grid md:grid-cols-12 gap-10 md:gap-16">
        <div className="md:col-span-6">
          <p
            id="wotd-heading"
            className="text-[#d4931a] text-[11px] font-medium uppercase tracking-[0.3em] mb-6"
          >
            Word of the day
          </p>

          <Link href={`/dictionary/${entry.word}`} className="group inline-block">
            <span className="tifinagh text-5xl md:text-7xl text-[#c53a1a] block leading-none mb-4 group-hover:opacity-80 transition-opacity">
              {entry.tifinagh}
            </span>
            <span className="font-display text-3xl md:text-5xl block tracking-tight group-hover:underline decoration-1 underline-offset-8">
              {entry.word}
            </span>
          </Link>

          {entry.pronunciation && (
            <p className="font-mono text-neutral-500 dark:text-neutral-400 text-sm mt-3 tracking-wide">
              /{entry.pronunciation}/
            </p>
          )}

          {meaning && (
            <p className="text-foreground text-xl md:text-2xl mt-6">{meaning}</p>
          )}
          {secondary && (
            <p className="text-neutral-500 dark:text-neutral-400 text-base mt-1">{secondary}</p>
          )}
        </div>

        {culturalNote && (
          <div className="md:col-span-5 md:col-start-8 flex items-start md:items-center">
            <div className="border-l-2 border-[#d4931a] pl-6 md:pl-8">
              <p className="text-foreground leading-relaxed text-base md:text-lg">
                {culturalNote}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
