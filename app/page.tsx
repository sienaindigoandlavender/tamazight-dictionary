'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { searchEntries, searchByLanguage, getAllEntries, getEntryByWord } from '@/lib/dictionary';
import {
  searchEnglishToTamazight,
  searchFrenchToTamazight,
  searchTamazightToOther,
  getCategories,
  getPhrasesByCategory,
  getRandomPhrases,
  getPhrasesMetadata
} from '@/lib/phrases';
import { DictionaryEntry, PhraseEntry, PhraseCategory } from '@/types';
import regionsData from '@/data/regions.json';
import TifinaghKeyboard, { TifinaghToggle } from '@/components/TifinaghKeyboard';

type TranslationDirection = 'en-tmz' | 'fr-tmz' | 'tmz-en' | 'tmz-fr';

const directionLabels: Record<TranslationDirection, { from: string; to: string; placeholder: string }> = {
  'en-tmz': { from: 'English', to: 'Tamazight', placeholder: 'Type English word or phrase...' },
  'fr-tmz': { from: 'French', to: 'Tamazight', placeholder: 'Tapez un mot en français...' },
  'tmz-en': { from: 'Tamazight', to: 'English', placeholder: 'Aru awal s Tmazight...' },
  'tmz-fr': { from: 'Tamazight', to: 'French', placeholder: 'Aru awal s Tmazight...' },
};

export default function Home() {
  const [direction, setDirection] = useState<TranslationDirection>('en-tmz');
  const [query, setQuery] = useState('');
  const [wordResults, setWordResults] = useState<DictionaryEntry[]>([]);
  const [phraseResults, setPhraseResults] = useState<PhraseEntry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<PhraseCategory | null>(null);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const categories = useMemo(() => getCategories(), []);
  const randomPhrases = useMemo(() => getRandomPhrases(8), []);
  const regions = regionsData.regions;
  const allEntries = useMemo(() => getAllEntries('tachelhit'), []);
  const phrasesMetadata = useMemo(() => getPhrasesMetadata(), []);

  // Search when query or direction changes
  useEffect(() => {
    if (!query.trim()) {
      setWordResults([]);
      setPhraseResults([]);
      return;
    }

    // Search words
    let words: DictionaryEntry[] = [];
    if (direction === 'en-tmz') {
      words = searchByLanguage(query, 'en');
    } else if (direction === 'fr-tmz') {
      words = searchByLanguage(query, 'fr');
    } else {
      words = searchEntries(query);
    }
    setWordResults(words.slice(0, 12));

    // Search phrases
    let phrases: PhraseEntry[] = [];
    if (direction === 'en-tmz') {
      phrases = searchEnglishToTamazight(query);
    } else if (direction === 'fr-tmz') {
      phrases = searchFrenchToTamazight(query);
    } else {
      phrases = searchTamazightToOther(query);
    }
    setPhraseResults(phrases.slice(0, 8));
  }, [query, direction]);

  // Get phrases by category
  const categoryPhrases = useMemo(() => {
    if (!selectedCategory) return [];
    return getPhrasesByCategory(selectedCategory);
  }, [selectedCategory]);

  const handleSwapDirection = () => {
    const swaps: Record<TranslationDirection, TranslationDirection> = {
      'en-tmz': 'tmz-en',
      'tmz-en': 'en-tmz',
      'fr-tmz': 'tmz-fr',
      'tmz-fr': 'fr-tmz',
    };
    setDirection(swaps[direction]);
    setQuery('');
  };

  const handleKeyboardInsert = (char: string) => {
    setQuery(prev => prev + char);
    inputRef.current?.focus();
  };

  // Check if a word exists in the dictionary for cross-linking
  const getLinkedWord = (word: string): DictionaryEntry | undefined => {
    return getEntryByWord(word.toLowerCase());
  };

  // Split phrase into linkable words
  const renderLinkedPhrase = (phrase: string) => {
    const words = phrase.split(/(\s+)/);
    return words.map((word, idx) => {
      if (/^\s+$/.test(word)) return word;
      const entry = getLinkedWord(word.replace(/[.,!?;:]/g, ''));
      if (entry) {
        return (
          <Link
            key={idx}
            href={`/dictionary/${entry.word}`}
            className="underline decoration-dotted underline-offset-2 hover:decoration-solid hover:text-foreground transition-colors"
          >
            {word}
          </Link>
        );
      }
      return word;
    });
  };

  const renderWordResult = (entry: DictionaryEntry) => {
    const targetLang = direction === 'tmz-fr' ? 'fr' : 'en';
    const meaning = entry.definitions.find(d => d.language === targetLang)?.meaning
      || entry.definitions[0]?.meaning;

    return (
      <Link
        key={entry.id}
        href={`/dictionary/${entry.word}`}
        className="block p-4 border border-foreground/10 hover:border-foreground/30 transition-colors bg-background"
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="tifinagh text-xl">{entry.tifinagh}</span>
          <span className="font-serif text-lg">{entry.word}</span>
          <span className="text-xs px-2 py-0.5 bg-foreground/5 text-muted-foreground">
            {entry.partOfSpeech}
          </span>
        </div>
        <p className="text-muted-foreground text-sm">{meaning}</p>
      </Link>
    );
  };

  const renderPhraseResult = (phrase: PhraseEntry, showCategory = true) => {
    const targetLang = direction === 'tmz-fr' || direction === 'fr-tmz' ? 'fr' : 'en';
    const translation = phrase.translations[targetLang] || phrase.translations.en;

    return (
      <div
        key={phrase.id}
        className="p-4 border border-foreground/10 hover:border-foreground/30 transition-colors bg-background"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="tifinagh text-lg">{phrase.tifinagh}</span>
              <span className="font-medium">{renderLinkedPhrase(phrase.phrase)}</span>
              {showCategory && (
                <span className="text-xs px-2 py-0.5 bg-foreground/5 text-muted-foreground capitalize">
                  {phrase.category}
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-sm">{translation}</p>
            {phrase.literalTranslation && (
              <p className="text-xs text-muted-foreground/60 mt-1 italic">
                Lit: {phrase.literalTranslation}
              </p>
            )}
            {phrase.pronunciation && (
              <p className="text-xs text-muted-foreground/50 mt-1">
                /{phrase.pronunciation}/
              </p>
            )}
          </div>
          {/* Audio button placeholder - will be enabled when audio files are added */}
          {phrase.audioFile && (
            <button
              className="w-8 h-8 flex-shrink-0 border border-foreground/20 flex items-center justify-center hover:border-foreground hover:bg-foreground hover:text-background transition-all"
              title={`Play pronunciation`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  };

  const hasResults = query && (wordResults.length > 0 || phraseResults.length > 0);
  const noResults = query && wordResults.length === 0 && phraseResults.length === 0;

  return (
    <div>
      {/* Hero + Translator */}
      <section className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-16">
        {/* Minimal branding */}
        <div className="text-center mb-10">
          <h1 className="tifinagh text-5xl md:text-6xl mb-3">ⴰⵎⴰⵡⴰⵍ</h1>
          <p className="font-serif text-xl text-muted-foreground">Tamazight Dictionary</p>
        </div>

        {/* Translation Interface */}
        <div className="w-full max-w-2xl">
          {/* Direction Selector */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <select
              value={direction}
              onChange={(e) => {
                setDirection(e.target.value as TranslationDirection);
                setQuery('');
              }}
              className="px-4 py-2 border border-foreground/10 bg-background text-foreground text-sm"
            >
              <option value="en-tmz">English → Tamazight</option>
              <option value="fr-tmz">French → Tamazight</option>
              <option value="tmz-en">Tamazight → English</option>
              <option value="tmz-fr">Tamazight → French</option>
            </select>

            <button
              onClick={handleSwapDirection}
              className="p-2 border border-foreground/10 hover:border-foreground/30 transition-colors"
              aria-label="Swap languages"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          {/* Dialect Indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: '#E07A5F' }}
            />
            <span className="text-xs text-muted-foreground">
              Tachelhit (Souss, Morocco)
            </span>
            <Link
              href="/map"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
            >
              Explore {regions.length} dialects
            </Link>
          </div>

          {/* Search Input */}
          <div className="relative">
            <div className="flex">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={directionLabels[direction].placeholder}
                autoFocus
                className="w-full px-6 py-5 text-xl border border-foreground/20 focus:border-foreground/40 focus:outline-none transition-colors bg-background text-center"
              />
              {/* Tifinagh keyboard toggle - show for Tamazight input directions */}
              {(direction === 'tmz-en' || direction === 'tmz-fr') && (
                <div className="absolute right-14 top-1/2 -translate-y-1/2">
                  <TifinaghToggle isActive={showKeyboard} onClick={() => setShowKeyboard(!showKeyboard)} />
                </div>
              )}
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Tifinagh Keyboard */}
            {showKeyboard && (direction === 'tmz-en' || direction === 'tmz-fr') && (
              <div className="mt-4">
                <TifinaghKeyboard
                  onInsert={handleKeyboardInsert}
                  onClose={() => setShowKeyboard(false)}
                />
              </div>
            )}
          </div>

          {/* Quick examples */}
          {!query && !showKeyboard && (
            <div className="flex flex-wrap justify-center gap-3 mt-6 text-sm">
              <span className="text-muted-foreground">Try:</span>
              {(direction === 'tmz-en' || direction === 'tmz-fr')
                ? ['aman', 'tafukt', 'akal', 'azul'].map(word => (
                    <button
                      key={word}
                      onClick={() => setQuery(word)}
                      className="text-foreground/70 hover:text-foreground transition-colors underline underline-offset-2"
                    >
                      {word}
                    </button>
                  ))
                : ['hello', 'water', 'sun', 'earth'].map(word => (
                    <button
                      key={word}
                      onClick={() => setQuery(word)}
                      className="text-foreground/70 hover:text-foreground transition-colors underline underline-offset-2"
                    >
                      {word}
                    </button>
                  ))
              }
            </div>
          )}

          {/* Methodology link */}
          {!query && (
            <div className="text-center mt-8">
              <Link
                href="/methodology"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                How we build this dictionary
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Results Section */}
      {hasResults && (
        <section className="border-t border-foreground/10 bg-foreground/[0.02] py-12">
          <div className="max-w-5xl mx-auto px-6">
            {/* Words */}
            {wordResults.length > 0 && (
              <div className="mb-10">
                <h2 className="section-subtitle mb-4">Words ({wordResults.length})</h2>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {wordResults.map(renderWordResult)}
                </div>
              </div>
            )}

            {/* Phrases */}
            {phraseResults.length > 0 && (
              <div>
                <h2 className="section-subtitle mb-4">Phrases ({phraseResults.length})</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {phraseResults.map(p => renderPhraseResult(p))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* No Results */}
      {noResults && (
        <section className="border-t border-foreground/10 py-16">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <p className="text-muted-foreground mb-4">
              No matches found for &ldquo;{query}&rdquo;
            </p>
            <p className="text-sm text-muted-foreground/70">
              Try a different word, or browse common phrases below.
            </p>
          </div>
        </section>
      )}

      {/* Phrases Discovery (when not searching) */}
      {!query && (
        <section className="border-t border-foreground/10 py-16">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <p className="section-subtitle mb-2">Common Phrases</p>
                <h2 className="font-serif text-2xl">Essential Tachelhit</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                {phrasesMetadata.totalPhrases} phrases across {phrasesMetadata.categoryCount} categories
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`text-sm px-3 py-1.5 border transition-colors ${
                  selectedCategory === null
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-foreground/10 hover:border-foreground/30'
                }`}
              >
                Featured
              </button>
              {categories.slice(0, 8).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as PhraseCategory)}
                  className={`text-sm px-3 py-1.5 border transition-colors ${
                    selectedCategory === cat.id
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-foreground/10 hover:border-foreground/30'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Phrases Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {(selectedCategory ? categoryPhrases : randomPhrases).map(phrase =>
                renderPhraseResult(phrase, !selectedCategory)
              )}
            </div>
          </div>
        </section>
      )}

      {/* Explore More (when not searching) */}
      {!query && (
        <section className="border-t border-foreground/10 py-16 bg-foreground/[0.02]">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="section-subtitle mb-2">Explore</p>
              <h2 className="font-serif text-2xl">Go Deeper</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Map */}
              <Link href="/map" className="group">
                <div className="card hover:border-foreground/30 transition-colors h-full">
                  <div className="flex -space-x-1 mb-4">
                    {regions.slice(0, 5).map((region, i) => (
                      <div
                        key={region.id}
                        className="w-4 h-4 rounded-full border-2 border-background"
                        style={{ backgroundColor: region.color, zIndex: 5 - i }}
                      />
                    ))}
                  </div>
                  <h3 className="font-serif text-xl mb-2 group-hover:underline">Linguistic Atlas</h3>
                  <p className="text-sm text-muted-foreground">
                    {regions.length} dialect regions across North Africa
                  </p>
                </div>
              </Link>

              {/* Symbols */}
              <Link href="/symbols" className="group">
                <div className="card hover:border-foreground/30 transition-colors h-full">
                  <div className="tifinagh text-3xl mb-4">ⵣ</div>
                  <h3 className="font-serif text-xl mb-2 group-hover:underline">Symbol Dictionary</h3>
                  <p className="text-sm text-muted-foreground">
                    Amazigh visual language and meanings
                  </p>
                </div>
              </Link>

              {/* Conjugation */}
              <Link href="/conjugation" className="group">
                <div className="card hover:border-foreground/30 transition-colors h-full">
                  <div className="tifinagh text-3xl mb-4">ⴷⴷⵓ</div>
                  <h3 className="font-serif text-xl mb-2 group-hover:underline">Verb Conjugation</h3>
                  <p className="text-sm text-muted-foreground">
                    Aorist, preterite, and imperative forms
                  </p>
                </div>
              </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-foreground/10 text-center">
              <div>
                <div className="font-serif text-3xl mb-1">{allEntries.length}+</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Words</div>
              </div>
              <div>
                <div className="font-serif text-3xl mb-1">{phrasesMetadata.totalPhrases}</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Phrases</div>
              </div>
              <div>
                <div className="font-serif text-3xl mb-1">{regions.length}</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Dialects</div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
