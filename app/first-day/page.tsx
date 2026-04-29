import type { Metadata } from 'next';
import { getFirstDaySections } from '@/lib/dictionary';
import FirstDayClient from './FirstDayClient';

export const metadata: Metadata = {
  title: 'Your first day in Tamazight — survival kit',
  description: '40 essential Tamazight (Berber) words to get you through Day 1: greetings, numbers, food, water, time, and travel — with Tifinagh script, IPA, and English/French glosses.',
  alternates: { canonical: 'https://tamazight.io/first-day' },
  openGraph: {
    title: 'First Day Tamazight — Berber Survival Kit',
    description: '40 essential Tamazight words with Tifinagh, pronunciation, and cultural context. Learn before you arrive.',
  },
};

export default function FirstDayPage() {
  const sections = getFirstDaySections('tachelhit');
  const total = sections.reduce((n, s) => n + s.entries.length, 0);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'First Day Tamazight — Survival Kit',
    description: 'Essential Tamazight (Berber) words and phrases for your first day in Amazigh-speaking regions.',
    provider: {
      '@type': 'Organization',
      name: 'Dancing with Lions',
      url: 'https://dancingwiththelions.com',
    },
    inLanguage: ['zgh', 'shi', 'en', 'fr'],
    teaches: 'Tamazight (Berber) survival vocabulary',
    numberOfCredits: 0,
    isAccessibleForFree: true,
  };

  // Pass a serializable shape — drop heavy fields the page doesn't render.
  const slim = sections.map(s => ({
    id: s.id,
    label: s.label,
    entries: s.entries.map(e => ({
      id: e.id,
      word: e.word,
      tifinagh: e.tifinagh,
      pronunciation: e.pronunciation,
      definitions: e.definitions.map(d => ({ language: d.language, meaning: d.meaning })),
      usageNotes: e.usageNotes?.filter(u => u.type === 'cultural').map(u => ({ type: u.type, text: u.text })) ?? [],
    })),
  }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FirstDayClient sections={slim} total={total} />
    </>
  );
}
