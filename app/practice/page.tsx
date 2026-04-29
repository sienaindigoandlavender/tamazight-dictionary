import type { Metadata } from 'next';
import {
  getFirstDayEntries,
  getEntriesBySemanticField,
} from '@/lib/dictionary';
import type { DictionaryEntry, SemanticField } from '@/types';
import PracticeClient, { type DeckSpec, type PracticeEntry } from './PracticeClient';

export const metadata: Metadata = {
  title: 'Practice Tamazight — flashcards with spaced repetition',
  description: 'Learn Tamazight (Berber) with flashcards. Tifinagh script ↔ Latin transliteration ↔ meaning, in three directions, with spaced repetition. Free, private, in-browser.',
  alternates: { canonical: 'https://tamazight.io/practice' },
  openGraph: {
    title: 'Practice Tamazight — flashcards',
    description: 'Spaced-repetition flashcards across 12 decks. Read Tifinagh, recall meaning, recall script.',
  },
};

const DECK_FIELDS: { id: string; label: string; field?: SemanticField; firstDay?: boolean }[] = [
  { id: 'first-day', label: 'First-day essentials', firstDay: true },
  { id: 'nature', label: 'Nature', field: 'nature' },
  { id: 'body', label: 'Body', field: 'body' },
  { id: 'food', label: 'Food', field: 'food' },
  { id: 'family', label: 'Family', field: 'family' },
  { id: 'numbers', label: 'Numbers', field: 'numbers' },
  { id: 'animals', label: 'Animals', field: 'animals' },
  { id: 'time', label: 'Time', field: 'time' },
  { id: 'color', label: 'Colour', field: 'color' },
  { id: 'water', label: 'Water', field: 'water' },
  { id: 'music', label: 'Music', field: 'music' },
  { id: 'agriculture', label: 'Agriculture', field: 'agriculture' },
];

function slim(e: DictionaryEntry): PracticeEntry {
  return {
    id: e.id,
    word: e.word,
    tifinagh: e.tifinagh,
    pronunciation: e.pronunciation ?? '',
    definitions: e.definitions.map(d => ({ language: d.language, meaning: d.meaning })),
    cultural: e.usageNotes?.find(u => u.type === 'cultural')?.text,
  };
}

export default function PracticePage() {
  const decks: DeckSpec[] = DECK_FIELDS.map(d => {
    const entries = d.firstDay
      ? getFirstDayEntries('tachelhit')
      : getEntriesBySemanticField(d.field as SemanticField, 'tachelhit');
    return { id: d.id, label: d.label, entries: entries.map(slim) };
  }).filter(d => d.entries.length >= 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: 'Tamazight Flashcard Practice',
    description: 'Spaced-repetition flashcards for learning Tamazight (Berber). Tifinagh script, Latin transliteration, English and French glosses.',
    provider: { '@type': 'Organization', name: 'Dancing with Lions' },
    inLanguage: ['zgh', 'shi', 'en', 'fr'],
    isAccessibleForFree: true,
    learningResourceType: 'Flashcard',
    educationalUse: 'self-study',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PracticeClient decks={decks} />
    </>
  );
}
