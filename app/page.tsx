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
import FirstDaySection from './_home/FirstDaySection';
import WisdomSection from './_home/WisdomSection';
import MapPreview from './_home/MapPreview';
import RecentlyViewed from '@/components/RecentlyViewed';
import NewsletterSignup from '@/components/NewsletterSignup';
import { LayoutGrid, BookOpen, Compass, Bookmark } from 'lucide-react';

type TranslationDirection = 'en-tmz' | 'fr-tmz' | 'tmz-en' | 'tmz-fr';

const directionLabels: Record<TranslationDirection, { from: string; to: string; placeholder: string }> = {
  'en-tmz': { from: 'English', to: 'Tamazight', placeholder: 'Search lexical dictionary entries...' },
  'fr-tmz': { from: 'French', to: 'Tamazight', placeholder: 'Rechercher dans le dictionnaire...' },
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
    <div className="overflow-hidden bg-[#F9F9F7]">

      {/* ============ CORE REPOSITORY HERO ============ */}
      <section className="relative px-6 md:px-[8%] lg:px-[12%] pt-24 md:pt-36 pb-12 md:pb-20 overflow-hidden border-b border-[#E4E4E0] bg-[#F1F1EE]">
        <div aria-hidden="true" className="absolute -bottom-32 -right-16 md:-right-32 pointer-events-none select-none">
          <span className="tifinagh text-[28vw] md:text-[20vw] leading-none text-[#1C1C1A]/[0.02]">
            ⴰⵎⴰⵡⴰⵍ
          </span>
        </div>

        <div className="relative z-10 max-w-5xl">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#767670] block mb-4">
            Tamazgha Research Database
          </span>

          <h1 className="font-serif text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.0] text-[#1C1C1A] tracking-tight mb-6">
            The Intangible & Material Heritage Vault.
          </h1>

          <p className="text-[#767670] text-base md:text-lg max-w-2xl mb-12 leading-relaxed font-sans">
            A collaborative architecture consolidating the physical artifacts, linguistic morphology, and spatial configurations of the Amazigh civilization segments.
          </p>

          {/* MASTER SUB-CONTENT SEARCH COMPONENT (Lexicon Lookup Engine) */}
          <div className="max-w-3xl bg-[#F9F9F7] border border-[#E4E4E0] p-4 sm:p-6 rounded shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <select 
                  value={direction}
                  onChange={(e) => { setDirection(e.target.value as TranslationDirection); setQuery(''); }}
                  className="px-2.5 py-1.5 border border-[#E4E4E0] bg-[#F1F1EE] font-mono text-[11px] uppercase tracking-wider appearance-none cursor-pointer pr-6 rounded-sm text-[#1C1C1A]"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23767670' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
                >
                  <option value="en-tmz">Lexicon: English → Tamazight</option>
                  <option value="fr-tmz">Lexicon: French → Tamazight</option>
                  <option value="tmz-en">Lexicon: Tamazight → English</option>
                  <option value="tmz-fr">Lexicon: Tamazight → French</option>
                </select>
                <button 
                  onClick={handleSwapDirection}
                  className="p-2 border border-[#E4E4E0] bg-[#F1F1EE] hover:bg-[#E4E4E0] transition-colors rounded-sm"
                  aria-label="Swap lexicon translation fields"
                >
                  <svg className="w-3.5 h-3.5 text-[#767670]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#c53a1a]" />
                <span className="text-[10px] font-mono text-[#767670] uppercase tracking-wider">Sub-Content Index: Tachelhit</span>
              </div>
            </div>

            <div className="relative">
              <input 
                ref={inputRef} 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={directionLabels[direction].placeholder}
                className="w-full bg-transparent outline-none py-2 text-lg border-b border-[#E4E4E0] focus:border-[#1C1C1A] font-sans placeholder:text-[#767670]/60 text-[#1C1C1A]" 
              />
              {(direction === 'tmz-en' || direction === 'tmz-fr') && (
                <div className="absolute right-12 top-1/2 -translate-y-1/2">
                  <TifinaghToggle isActive={showKeyboard} onClick={() => setShowKeyboard(!showKeyboard)} />
                </div>
              )}
              {query && (
                <button 
                  onClick={() => setQuery('')}
                  aria-label="Clear term search"
                  className="absolute right-0 inset-y-0 my-auto h-10 w-10 inline-flex items-center justify-center text-[#767670] hover:text-[#1C1C1A]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
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
          </div>
        </div>
      </section>

      {/* ============ LIVE TRANSLATION LOOKUP OVERLAY ============ */}
      {hasResults && (
        <section className="py-16 px-6 border-b border-[#E4E4E0] bg-white">
          <div className="max-w-5xl mx-auto">
            {wordResults.length > 0 && (
              <div className="mb-12">
                <div className="flex items-baseline gap-2 mb-6 border-b border-[#E4E4E0] pb-2">
                  <span className="font-mono text-xs font-semibold text-[#1C1C1A]">{wordResults.length}</span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#767670]">Lexical vocabulary terms resolved</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {wordResults.map(renderWordResult)}
                </div>
              </div>
            )}
            {phraseResults.length > 0 && (
              <div>
                <div className="flex items-baseline gap-2 mb-6 border-b border-[#E4E4E0] pb-2">
                  <span className="font-mono text-xs font-semibold text-[#1C1C1A]">{phraseResults.length}</span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#767670]">Phonetic contextual records resolved</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {phraseResults.map(p => renderPhraseResult(p))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {noResults && (
        <section className="py-20 px-6 bg-white border-b border-[#E4E4E0]">
          <div className="max-w-2xl mx-auto text-center">
            <span className="tifinagh text-5xl text-[#767670]/20 block mb-4">ⵅ</span>
            <p className="font-serif text-xl mb-1 text-[#1C1C1A]">No lexical entries match &ldquo;{query}&rdquo;</p>
            <p className="text-xs font-mono text-[#767670]">Check your linguistic parameters or navigate structural nodes below.</p>
          </div>
        </section>
      )}

      {/* ============ CORE ARCHITECTURAL REPOSITORY VAULTS ============ */}
      {!query && (
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#767670] block mb-2">Vault Directories</span>
          <h2 className="text-2xl font-serif text-[#1C1C1A] mb-8">Primary Sub-Content Registries</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. Heritage Index Entrypoint */}
            <Link href="/heritage" className="group border border-[#E4E4E0] p-6 bg-white hover:border-[#1C1C1A] transition-all flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="w-8 h-8 rounded bg-[#F1F1EE] flex items-center justify-center text-[#1C1C1A] mb-4 border border-[#E4E4E0]">
                  <LayoutGrid size={16} />
                </div>
                <h3 className="font-serif text-xl text-[#1C1C1A] group-hover:underline mb-2">Material Heritage Catalog</h3>
                <p className="text-xs text-[#767670] leading-relaxed">
                  Statically structured data tracking physical objects, fibulas, architectural motifs, and physical relics.
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#1C1C1A] uppercase tracking-wider pt-4 block">Access Specimen Ledger →</span>
            </Link>

            {/* 2. Atlas Mapping Entrypoint */}
            <Link href="/map" className="group border border-[#E4E4E0] p-6 bg-white hover:border-[#1C1C1A] transition-all flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="w-8 h-8 rounded bg-[#F1F1EE] flex items-center justify-center text-[#1C1C1A] mb-4 border border-[#E4E4E0]">
                  <Compass size={16} />
                </div>
                <h3 className="font-serif text-xl text-[#1C1C1A] group-hover:underline mb-2">Linguistic Atlas</h3>
                <p className="text-xs text-[#767670] leading-relaxed">
                  Cartographic rendering mapping {regions.length} distinct tribal sub-dialects across regional zones.
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#1C1C1A] uppercase tracking-wider pt-4 block">Launch Geographic Matrix →</span>
            </Link>

            {/* 3. Symbolic System Entrypoint */}
            <Link href="/symbols" className="group border border-[#E4E4E0] p-6 bg-white hover:border-[#1C1C1A] transition-all flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="w-8 h-8 rounded bg-[#F1F1EE] flex items-center justify-center text-[#1C1C1A] mb-4 border border-[#E4E4E0]">
                  <Bookmark size={16} />
                </div>
                <h3 className="font-serif text-xl text-[#1C1C1A] group-hover:underline mb-2">Semiotics & Symbol Index</h3>
                <p className="text-xs text-[#767670] leading-relaxed">
                  Catalog indexing structural geometry meanings parsed directly from traditional Amazigh weaving patterns.
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#1C1C1A] uppercase tracking-wider pt-4 block">View Sign Index →</span>
            </Link>
          </div>
        </section>
      )}

      {/* ============ SYSTEM SECONDARY COMPONENTS ============ */}
      {!query && (
        <>
          <RecentlyViewed />
          <WordOfTheDay />
          <FirstDaySection />
          <WisdomSection />
          
          {/* ============ PHRASES REPOSITORY PANEL ============ */}
          <section className="py-16 px-6 border-t border-[#E4E4E0] bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-12 gap-6 mb-12">
                <div className="md:col-span-7">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#767670] mb-2 block">Phonetic Database Node</span>
                  <h2 className="font-serif text-3xl text-[#1C1C1A]">Vernacular Syntactical Formulations</h2>
                </div>
                <div className="md:col-span-5 flex items-end">
                  <p className="text-xs text-[#767670] leading-normal font-mono">
                    {phrasesMetadata.totalPhrases} total expressions sorted inside {phrasesMetadata.categoryCount} functional classifications.
                  </p>
                </div>
              </div>

              {/* Functional Filtering Track */}
              <div className="flex flex-wrap gap-2 mb-8">
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className={`text-[11px] font-mono uppercase tracking-wider px-3 py-1.5 border rounded-sm transition-all ${
                    selectedCategory === null ? 'bg-[#1C1C1A] text-white border-[#1C1C1A]' : 'bg-[#F1F1EE] text-[#767670] border-[#E4E4E0] hover:border-[#767670]'
                  }`}
                >
                  Featured Samples
                </button>
                {categories.slice(0, 7).map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => setSelectedCategory(cat.id as PhraseCategory)}
                    className={`text-[11px] font-mono uppercase tracking-wider px-3 py-1.5 border rounded-sm transition-all ${
                      selectedCategory === cat.id ? 'bg-[#1C1C1A] text-white border-[#1C1C1A]' : 'bg-[#F1F1EE] text-[#767670] border-[#E4E4E0] hover:border-[#767670]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Active Matrix Items Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                {(selectedCategory ? categoryPhrases : randomPhrases).map(phrase =>
                  renderPhraseResult(phrase, !selectedCategory)
                )}
              </div>
            </div>
          </section>

          {/* ============ SYSTEM DATA AGGREGATES ============ */}
          <section className="py-16 px-6 max-w-7xl mx-auto border-t border-[#E4E4E0]">
            <div className="grid grid-cols-3 gap-6 text-center md:text-left border border-[#E4E4E0] bg-[#F1F1EE] p-8 rounded-sm">
              <div>
                <div className="font-serif text-4xl sm:text-6xl text-[#1C1C1A] leading-none mb-1">{allEntries.length}</div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#767670]">Lexical Roots</div>
              </div>
              <div className="border-x border-[#E4E4E0] px-4">
                <div className="font-serif text-4xl sm:text-6xl text-[#1C1C1A] leading-none mb-1">{phrasesMetadata.totalPhrases}</div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#767670]">Syntactical Maps</div>
              </div>
              <div>
                <div className="font-serif text-4xl sm:text-6xl text-[#1C1C1A] leading-none mb-1">{regions.length}</div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#767670]">Dialect Sectors</div>
              </div>
            </div>
            
            {/* Global Auxiliary Modules Sub-Track */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
              <Link href="/alphabet" className="p-4 border border-[#E4E4E0] bg-white hover:border-[#1C1C1A] transition-colors font-mono text-xs text-[#767670] flex justify-between items-center">
                <span>[01] Tifinagh Alphabetic Glyph Matrix</span>
                <span className="text-[#1C1C1A]">→</span>
              </Link>
              <Link href="/conjugation" className="p-4 border border-[#E4E4E0] bg-white hover:border-[#1C1C1A] transition-colors font-mono text-xs text-[#767670] flex justify-between items-center">
                <span>[02] Structural Morphological Verb Tense Engine</span>
                <span className="text-[#1C1C1A]">→</span>
              </Link>
              <Link href="/about" className="p-4 border border-[#E4E4E0] bg-white hover:border-[#1C1C1A] transition-colors font-mono text-xs text-[#767670] flex justify-between items-center">
                <span>[03] Institutional Project Documentation</span>
                <span className="text-[#1C1C1A]">→</span>
              </Link>
            </div>
          </section>

          <NewsletterSignup />
          <MapPreview />
        </>
      )}
    </div>
  );
}
