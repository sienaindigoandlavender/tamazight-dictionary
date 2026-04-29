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
import { AMAWAL_LOCALE_KEY, AMAWAL_LOCALE_EVENT, type AmawalLocale } from '@/components/LocaleSwitcher';
import WordOfTheDay from './_home/WordOfTheDay';
import RecentlyViewed from '@/components/RecentlyViewed';

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

  // Sync translator direction with the global EN | FR locale switcher
  useEffect(() => {
    const apply = (loc: AmawalLocale) => {
      setDirection(d => {
        if (loc === 'fr') return d === 'en-tmz' ? 'fr-tmz' : d === 'tmz-en' ? 'tmz-fr' : d;
        return d === 'fr-tmz' ? 'en-tmz' : d === 'tmz-fr' ? 'tmz-en' : d;
      });
    };
    const saved = localStorage.getItem(AMAWAL_LOCALE_KEY);
    if (saved === 'fr' || saved === 'en') apply(saved);
    const onChange = (e: Event) => apply((e as CustomEvent<AmawalLocale>).detail);
    window.addEventListener(AMAWAL_LOCALE_EVENT, onChange);
    return () => window.removeEventListener(AMAWAL_LOCALE_EVENT, onChange);
  }, []);

  useEffect(() => {
    if (!query.trim()) { setWordResults([]); setPhraseResults([]); return; }
    let words: DictionaryEntry[] = [];
    if (direction === 'en-tmz') words = searchByLanguage(query, 'en');
    else if (direction === 'fr-tmz') words = searchByLanguage(query, 'fr');
    else words = searchEntries(query);
    setWordResults(words.slice(0, 12));

    let phrases: PhraseEntry[] = [];
    if (direction === 'en-tmz') phrases = searchEnglishToTamazight(query);
    else if (direction === 'fr-tmz') phrases = searchFrenchToTamazight(query);
    else phrases = searchTamazightToOther(query);
    setPhraseResults(phrases.slice(0, 8));
  }, [query, direction]);

  const categoryPhrases = useMemo(() => {
    if (!selectedCategory) return [];
    return getPhrasesByCategory(selectedCategory);
  }, [selectedCategory]);

  const handleSwapDirection = () => {
    const swaps: Record<TranslationDirection, TranslationDirection> = {
      'en-tmz': 'tmz-en', 'tmz-en': 'en-tmz', 'fr-tmz': 'tmz-fr', 'tmz-fr': 'fr-tmz',
    };
    setDirection(swaps[direction]);
    setQuery('');
  };

  const handleKeyboardInsert = (char: string) => {
    setQuery(prev => prev + char);
    inputRef.current?.focus();
  };

  const getLinkedWord = (word: string): DictionaryEntry | undefined => {
    return getEntryByWord(word.toLowerCase());
  };

  const renderLinkedPhrase = (phrase: string) => {
    const words = phrase.split(/(\s+)/);
    return words.map((word, idx) => {
      if (/^\s+$/.test(word)) return word;
      const entry = getLinkedWord(word.replace(/[.,!?;:]/g, ''));
      if (entry) {
        return (
          <Link key={idx} href={`/dictionary/${entry.word}`}
            className="underline decoration-dotted underline-offset-2 hover:decoration-solid hover:text-foreground transition-colors">
            {word}
          </Link>
        );
      }
      return word;
    });
  };

  const renderWordResult = (entry: DictionaryEntry) => {
    const targetLang = direction === 'tmz-fr' ? 'fr' : 'en';
    const meaning = entry.definitions.find(d => d.language === targetLang)?.meaning || entry.definitions[0]?.meaning;
    return (
      <Link key={entry.id} href={`/dictionary/${entry.word}`}
        className="group block p-5 border border-foreground/8 hover:border-foreground/25 transition-all bg-background hover-lift">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="tifinagh text-2xl text-accent">{entry.tifinagh}</span>
          <span className="font-serif text-xl">{entry.word}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 border border-foreground/10 text-muted-foreground uppercase tracking-wider">
            {entry.partOfSpeech}
          </span>
          <span className="text-muted-foreground text-sm">{meaning}</span>
        </div>
      </Link>
    );
  };

  const renderPhraseResult = (phrase: PhraseEntry, showCategory = true) => {
    const targetLang = direction === 'tmz-fr' || direction === 'fr-tmz' ? 'fr' : 'en';
    const translation = phrase.translations[targetLang] || phrase.translations.en;
    return (
      <div key={phrase.id} className="group p-5 border border-foreground/8 hover:border-foreground/25 transition-all bg-background hover-lift">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="mb-2">
              <span className="tifinagh text-lg text-accent mr-3">{phrase.tifinagh}</span>
              <span className="font-medium">{renderLinkedPhrase(phrase.phrase)}</span>
            </div>
            <p className="text-muted-foreground text-sm">{translation}</p>
            {phrase.literalTranslation && (
              <p className="text-xs text-muted-foreground/50 mt-2 italic">Lit: {phrase.literalTranslation}</p>
            )}
          </div>
          {showCategory && (
            <span className="text-[10px] px-2 py-0.5 border border-foreground/10 text-muted-foreground uppercase tracking-wider flex-shrink-0">
              {phrase.category}
            </span>
          )}
        </div>
      </div>
    );
  };

  const hasResults = query && (wordResults.length > 0 || phraseResults.length > 0);
  const noResults = query && wordResults.length === 0 && phraseResults.length === 0;

  return (
    <div className="overflow-hidden">

      {/* ============ HERO ============ */}
      <section
        className="relative px-6 md:px-[8%] lg:px-[12%] pt-24 md:pt-40 pb-12 md:pb-28 overflow-hidden"
        aria-labelledby="home-h1"
      >
        {/* One subtle Tifinagh ornament — bottom-right */}
        <div
          aria-hidden="true"
          className="absolute -bottom-32 -right-16 md:-right-32 pointer-events-none select-none"
        >
          <span className="tifinagh text-[28vw] md:text-[20vw] leading-none text-[#c53a1a]/[0.04]">
            ⴰⵎⴰⵡⴰⵍ
          </span>
        </div>

        <div className="relative z-10 max-w-5xl">
          <p className="text-[#c53a1a] text-[11px] md:text-xs font-medium uppercase tracking-[0.3em] mb-4 md:mb-6">
            Tamazight Dictionary
          </p>

          <h1
            id="home-h1"
            className="font-display text-[clamp(2.5rem,8vw,7rem)] leading-[0.95] md:leading-[0.9] tracking-tight mb-4 md:mb-6"
          >
            Berber language, finally clear.
          </h1>

          <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-xl max-w-2xl mb-8 md:mb-16 leading-relaxed">
            Free Tamazight dictionary. {allEntries.length.toLocaleString()} words, {phrasesMetadata.totalPhrases.toLocaleString()} phrases — with Tifinagh script, pronunciation, and {regions.length} dialect regions.
          </p>

          <div className="max-w-3xl">
            {/* Direction + Dialect row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <select value={direction}
                  onChange={(e) => { setDirection(e.target.value as TranslationDirection); setQuery(''); }}
                  className="px-3 py-1.5 border border-foreground/10 bg-background text-foreground text-xs uppercase tracking-wider appearance-none cursor-pointer pr-6"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}>
                  <option value="en-tmz">English → Tamazight</option>
                  <option value="fr-tmz">French → Tamazight</option>
                  <option value="tmz-en">Tamazight → English</option>
                  <option value="tmz-fr">Tamazight → French</option>
                </select>
                <button onClick={handleSwapDirection}
                  className="p-1.5 border border-foreground/10 hover:border-foreground/30 hover:bg-foreground/5 transition-all"
                  aria-label="Swap languages">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Tachelhit</span>
              </div>
            </div>

            {/* Search Input — underline style, matches darija.io */}
            <div className="relative">
              <input ref={inputRef} type="text" value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={directionLabels[direction].placeholder}
                autoFocus
                className="w-full bg-transparent outline-none transition-colors py-3 md:pt-0 md:pb-4 text-xl md:text-2xl border-b-2 border-neutral-200 dark:border-neutral-800 focus:border-[#c53a1a] font-display placeholder:font-display placeholder:text-neutral-400" />
              {(direction === 'tmz-en' || direction === 'tmz-fr') && (
                <div className="absolute right-12 top-1/2 -translate-y-1/2">
                  <TifinaghToggle isActive={showKeyboard} onClick={() => setShowKeyboard(!showKeyboard)} />
                </div>
              )}
              {query && (
                <button onClick={() => setQuery('')}
                  aria-label="Clear"
                  className="absolute right-0 inset-y-0 my-auto h-11 w-11 inline-flex items-center justify-center text-neutral-400 hover:text-black dark:hover:text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {showKeyboard && (direction === 'tmz-en' || direction === 'tmz-fr') && (
              <div className="mt-4">
                <TifinaghKeyboard onInsert={handleKeyboardInsert} onClose={() => setShowKeyboard(false)} />
              </div>
            )}

            {/* Try chips */}
            {!query && !showKeyboard && (
              <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 mt-4">
                <span className="text-xs uppercase tracking-[0.2em] text-neutral-400">Try</span>
                {((direction === 'tmz-en' || direction === 'tmz-fr')
                  ? ['aman', 'tafukt', 'akal', 'azul']
                  : ['water', 'sun', 'freedom', 'love']
                ).map(word => (
                  <button key={word} onClick={() => setQuery(word)}
                    className="text-sm text-neutral-500 hover:text-[#c53a1a] transition-colors font-display italic">
                    {word}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============ RESULTS ============ */}
      {hasResults && (
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            {wordResults.length > 0 && (
              <div className="mb-12">
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="font-serif text-3xl">{wordResults.length}</span>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">words found</span>
                </div>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {wordResults.map(renderWordResult)}
                </div>
              </div>
            )}
            {phraseResults.length > 0 && (
              <div>
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="font-serif text-3xl">{phraseResults.length}</span>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">phrases found</span>
                </div>
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
        <section className="py-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <span className="tifinagh text-6xl text-foreground/10 block mb-6">ⵅ</span>
            <p className="font-serif text-2xl mb-2">No matches for &ldquo;{query}&rdquo;</p>
            <p className="text-sm text-muted-foreground">Try a different word, or browse common phrases below.</p>
          </div>
        </section>
      )}

      {/* ============ RECENTLY VIEWED ============ */}
      {!query && <RecentlyViewed />}

      {/* ============ WORD OF THE DAY ============ */}
      {!query && <WordOfTheDay />}

      {/* ============ PHRASES DISCOVERY ============ */}
      {!query && (
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Section header - asymmetric */}
            <div className="grid md:grid-cols-12 gap-6 mb-12">
              <div className="md:col-span-7">
                <span className="text-xs uppercase tracking-[0.2em] text-accent mb-3 block">Essential Tachelhit</span>
                <h2 className="font-serif text-4xl md:text-5xl leading-tight">Common<br/>Phrases</h2>
              </div>
              <div className="md:col-span-5 flex items-end">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {phrasesMetadata.totalPhrases} phrases across {phrasesMetadata.categoryCount} categories — greetings, farewells, courtesy, directions, and everyday conversation.
                </p>
              </div>
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2 mb-10">
              <button onClick={() => setSelectedCategory(null)}
                className={`text-xs px-4 py-2 transition-all ${
                  selectedCategory === null
                    ? 'bg-foreground text-background'
                    : 'border border-foreground/10 hover:border-foreground/30'
                }`}>
                Featured
              </button>
              {categories.slice(0, 10).map(cat => (
                <button key={cat.id} onClick={() => setSelectedCategory(cat.id as PhraseCategory)}
                  className={`text-xs px-4 py-2 transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-foreground text-background'
                      : 'border border-foreground/10 hover:border-foreground/30'
                  }`}>
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Phrases Grid */}
            <div className="grid gap-3 md:grid-cols-2">
              {(selectedCategory ? categoryPhrases : randomPhrases).map(phrase =>
                renderPhraseResult(phrase, !selectedCategory)
              )}
            </div>
          </div>
        </section>
      )}

      {/* ============ EXPLORE MORE ============ */}
      {!query && (
        <section className="py-20 md:py-28 px-6 relative">
          {/* Large background letter */}
          <div className="absolute right-0 top-0 tifinagh-deco text-[28rem] leading-none -translate-y-20 translate-x-20" aria-hidden="true">
            ⵣ
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            {/* Stats — oversized numbers */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 mb-20 md:mb-28">
              <div className="text-center md:text-left">
                <div className="font-serif text-6xl md:text-8xl leading-none mb-2">{allEntries.length}</div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Words</div>
              </div>
              <div className="text-center">
                <div className="font-serif text-6xl md:text-8xl leading-none mb-2">{phrasesMetadata.totalPhrases}</div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Phrases</div>
              </div>
              <div className="text-center md:text-right">
                <div className="font-serif text-6xl md:text-8xl leading-none mb-2">{regions.length}</div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Dialects</div>
              </div>
            </div>

            {/* Explore cards — varied sizes */}
            <div className="grid md:grid-cols-12 gap-4">
              {/* Map — large */}
              <Link href="/map" className="md:col-span-7 group">
                <div className="border border-foreground/8 p-8 md:p-10 hover:border-foreground/25 transition-all hover-lift h-full relative overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 opacity-[0.04]">
                    <svg viewBox="0 0 200 200" className="w-40 h-40"><circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="100" cy="60" r="4" fill="currentColor"/><circle cx="80" cy="120" r="4" fill="currentColor"/>
                      <circle cx="130" cy="100" r="4" fill="currentColor"/><circle cx="60" cy="80" r="4" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="flex -space-x-1.5 mb-6">
                    {regions.slice(0, 7).map((region, i) => (
                      <div key={region.id} className="w-5 h-5 rounded-full border-2 border-background"
                        style={{ backgroundColor: region.color, zIndex: 7 - i }} />
                    ))}
                  </div>
                  <h3 className="font-serif text-3xl md:text-4xl mb-3 group-hover:text-accent transition-colors">Linguistic Atlas</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">{regions.length} dialect regions mapped across North Africa — from the Rif to the Sahara.</p>
                </div>
              </Link>

              {/* Symbols — medium */}
              <Link href="/symbols" className="md:col-span-5 group">
                <div className="border border-foreground/8 p-8 md:p-10 hover:border-foreground/25 transition-all hover-lift h-full">
                  <div className="tifinagh text-5xl mb-6 text-accent/70 group-hover:text-accent transition-colors">ⴰ ⵣ ⵯ</div>
                  <h3 className="font-serif text-3xl md:text-4xl mb-3 group-hover:text-accent transition-colors">Symbol Dictionary</h3>
                  <p className="text-sm text-muted-foreground">30 Amazigh symbols — geometry, nature, and the visual language of a civilization.</p>
                </div>
              </Link>

              {/* Alphabet — medium */}
              <Link href="/alphabet" className="md:col-span-5 group">
                <div className="border border-foreground/8 p-8 md:p-10 hover:border-foreground/25 transition-all hover-lift h-full">
                  <div className="flex gap-3 mb-6">
                    {['ⵢ','ⴰ','ⵣ','ⵎ','ⵏ'].map((ch, i) => (
                      <span key={i} className="tifinagh text-2xl text-foreground/20">{ch}</span>
                    ))}
                  </div>
                  <h3 className="font-serif text-3xl md:text-4xl mb-3 group-hover:text-accent transition-colors">Tifinagh Alphabet</h3>
                  <p className="text-sm text-muted-foreground">33 letters. One of the oldest writing systems still in use — over 2,500 years of marks on stone and skin.</p>
                </div>
              </Link>

              {/* Conjugation — narrow */}
              <Link href="/conjugation" className="md:col-span-4 group">
                <div className="border border-foreground/8 p-8 md:p-10 hover:border-foreground/25 transition-all hover-lift h-full">
                  <div className="font-serif text-lg text-muted-foreground mb-6 space-y-1">
                    <div>ddu → <span className="text-foreground">iddú</span></div>
                    <div>awi → <span className="text-foreground">iwí</span></div>
                  </div>
                  <h3 className="font-serif text-2xl mb-2 group-hover:text-accent transition-colors">Verb Conjugation</h3>
                  <p className="text-sm text-muted-foreground">Aorist, preterite, imperative.</p>
                </div>
              </Link>

              {/* About — full width accent strip */}
              <Link href="/about" className="md:col-span-3 group">
                <div className="bg-foreground text-background p-8 md:p-10 hover:opacity-90 transition-all h-full flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-2xl mb-3">About</h3>
                    <p className="text-sm text-background/60">The story behind Amawal and the Tamazight language.</p>
                  </div>
                  <span className="text-xs uppercase tracking-widest text-background/40 mt-6">Learn more →</span>
                </div>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
