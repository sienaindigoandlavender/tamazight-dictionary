'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { getTraditionLines } from '@/lib/dictionary';
import { AMAWAL_LOCALE_KEY, AMAWAL_LOCALE_EVENT, type AmawalLocale } from '@/components/LocaleSwitcher';
import { pickByDay } from './util';

const TYPE_LABEL: Record<string, string> = {
  proverb: 'Proverb',
  oral: 'Oral',
  song: 'Song',
  poetry: 'Poetry',
  literature: 'Literature',
};

/**
 * From the tradition — six rotating annotated lines.
 * Surfaces examples flagged proverb / oral / song / poetry / literature
 * inside the dictionary entries, deterministically rotated per day.
 */
export default function WisdomSection() {
  const t = useTranslations('home');
  const [locale, setLocale] = useState<AmawalLocale>('en');

  useEffect(() => {
    const saved = localStorage.getItem(AMAWAL_LOCALE_KEY);
    if (saved === 'fr' || saved === 'en') setLocale(saved);
    const onChange = (e: Event) => setLocale((e as CustomEvent<AmawalLocale>).detail);
    window.addEventListener(AMAWAL_LOCALE_EVENT, onChange);
    return () => window.removeEventListener(AMAWAL_LOCALE_EVENT, onChange);
  }, []);

  const lines = useMemo(() => pickByDay(getTraditionLines('tachelhit'), 6), []);

  if (lines.length === 0) return null;

  return (
    <section
      className="border-t border-neutral-100 dark:border-white/10 px-6 md:px-[8%] lg:px-[12%] py-14 md:py-28"
      aria-labelledby="wisdom-heading"
    >
      <div className="grid md:grid-cols-12 gap-10 mb-12 md:mb-16">
        <div className="md:col-span-7">
          <p className="text-[#d4931a] text-[11px] font-medium uppercase tracking-[0.3em] mb-4">
            {t('tradition')}
          </p>
          <h2
            id="wisdom-heading"
            className="font-display text-4xl md:text-5xl lg:text-6xl leading-[0.95] tracking-tight"
            dangerouslySetInnerHTML={{ __html: t.raw('traditionTitle') }}
          />
        </div>
        <div className="md:col-span-4 md:col-start-9 flex items-end">
          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
            {t('traditionDesc')}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-x-12 gap-y-12">
        {lines.map((l, i) => {
          const gloss = locale === 'fr' && l.fr ? l.fr : l.en;
          return (
            <Link
              key={`${l.entryWord}-${i}`}
              href={`/dictionary/${encodeURIComponent(l.entryWord)}`}
              className="group block"
            >
              <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 mb-3">
                {TYPE_LABEL[l.type] ?? l.type}
              </p>
              {l.tifinagh && (
                <p className="tifinagh text-2xl md:text-3xl text-[#c53a1a] leading-snug mb-3 group-hover:opacity-80 transition-opacity">
                  {l.tifinagh}
                </p>
              )}
              <p className="font-display text-lg md:text-xl italic text-neutral-700 dark:text-neutral-300 mb-2">
                {l.text}
              </p>
              {gloss && (
                <p className="text-foreground leading-relaxed mb-3">
                  &ldquo;{gloss}&rdquo;
                </p>
              )}
              <p className="text-xs text-neutral-500">
                <span className="tifinagh text-sm text-[#c53a1a] mr-2">{l.entryTifinagh}</span>
                <span className="font-display">{l.entryWord}</span>
                {l.attribution && <span className="ml-3 text-neutral-400">· {l.attribution}</span>}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
