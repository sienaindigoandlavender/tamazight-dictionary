'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AMAWAL_LOCALE_KEY, AMAWAL_LOCALE_EVENT, type AmawalLocale } from '@/components/LocaleSwitcher';

interface SlimEntry {
  id: string;
  word: string;
  tifinagh: string;
  pronunciation: string;
  definitions: { language: string; meaning: string }[];
  usageNotes: { type: string; text: string }[];
}

interface SlimSection {
  id: string;
  label: string;
  entries: SlimEntry[];
}

interface Props {
  sections: SlimSection[];
  total: number;
}

export default function FirstDayClient({ sections, total }: Props) {
  const [locale, setLocale] = useState<AmawalLocale>('en');

  useEffect(() => {
    const saved = localStorage.getItem(AMAWAL_LOCALE_KEY);
    if (saved === 'fr' || saved === 'en') setLocale(saved);
    const onChange = (e: Event) => setLocale((e as CustomEvent<AmawalLocale>).detail);
    window.addEventListener(AMAWAL_LOCALE_EVENT, onChange);
    return () => window.removeEventListener(AMAWAL_LOCALE_EVENT, onChange);
  }, []);

  const lang = locale === 'fr' ? 'fr' : 'en';

  return (
    <div>
      <section className="px-6 md:px-[8%] lg:px-[12%] pt-20 pb-16">
        <Link
          href="/"
          className="text-sm text-neutral-500 hover:text-foreground transition-colors mb-8 inline-block"
        >
          ← Back to dictionary
        </Link>
        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-7">
            <p className="text-[#c53a1a] text-xs font-medium uppercase tracking-[0.3em] mb-4">
              Survival Kit
            </p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.9] tracking-tight">
              Your first<br /><em>day</em> words
            </h1>
          </div>
          <div className="md:col-span-4 md:col-start-9 flex items-end">
            <div>
              <p className="leading-relaxed mb-4">
                These {total} words get you through Day 1 in Amazigh country. Say them badly — people will love you for trying.
              </p>
              <p className="text-neutral-500 text-sm">
                Print this page. Screenshot it. Save it to your phone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {sections.map(section => (
        <section
          key={section.id}
          className="px-6 md:px-[8%] lg:px-[12%] py-12 border-t border-neutral-100 dark:border-white/10"
        >
          <h2 className="font-display text-3xl md:text-4xl mb-8">{section.label}</h2>
          <ul role="list" className="divide-y divide-neutral-100 dark:divide-white/10">
            {section.entries.map(e => {
              const meaning =
                e.definitions.find(d => d.language === lang)?.meaning ??
                e.definitions.find(d => d.language === 'en')?.meaning ??
                e.definitions[0]?.meaning;
              const culturalNote = e.usageNotes.find(u => u.type === 'cultural')?.text;
              return (
                <li key={e.id}>
                  <Link
                    href={`/dictionary/${encodeURIComponent(e.word)}`}
                    className="group block py-5 md:py-6 -mx-6 md:-mx-8 px-6 md:px-8 hover:bg-neutral-50/60 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-baseline justify-between gap-6 flex-wrap">
                      <div className="flex items-baseline gap-5 min-w-0">
                        <span className="tifinagh text-2xl md:text-3xl text-[#c53a1a] leading-none shrink-0">
                          {e.tifinagh}
                        </span>
                        <span className="font-display text-xl md:text-2xl tracking-tight">
                          {e.word}
                        </span>
                        {e.pronunciation && (
                          <span className="font-mono text-sm text-neutral-400 hidden md:inline">
                            /{e.pronunciation}/
                          </span>
                        )}
                      </div>
                      <span className="text-neutral-700 dark:text-neutral-300 text-base md:text-lg">
                        {meaning}
                      </span>
                    </div>
                    {culturalNote && (
                      <p className="mt-3 ml-0 md:ml-[3.75rem] text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed border-l-2 border-[#d4931a] pl-4 max-w-3xl">
                        {culturalNote}
                      </p>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <section className="px-6 md:px-[8%] lg:px-[12%] py-16 md:py-20 border-t border-neutral-100 dark:border-white/10 text-center">
        <p className="font-display text-3xl md:text-4xl mb-3 tracking-tight">Ready to memorise them?</p>
        <p className="text-neutral-500 dark:text-neutral-400 mb-8">Flashcards with spaced repetition. Words you miss come back.</p>
        <Link
          href="/practice"
          className="inline-block px-8 py-4 bg-foreground text-background text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          Practice first-day words
        </Link>
      </section>
    </div>
  );
}
