'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AMAWAL_LOCALE_KEY, AMAWAL_LOCALE_EVENT, type AmawalLocale } from '@/components/LocaleSwitcher';

export interface PracticeEntry {
  id: string;
  word: string;
  tifinagh: string;
  pronunciation: string;
  definitions: { language: string; meaning: string }[];
  cultural?: string;
}

export interface DeckSpec {
  id: string;
  label: string;
  entries: PracticeEntry[];
}

type Mode = 'tifinagh-to-meaning' | 'meaning-to-latin' | 'latin-to-tifinagh';

const MODES: { id: Mode; label: string; hint: string }[] = [
  { id: 'tifinagh-to-meaning', label: 'Read Tifinagh', hint: 'See ⵉⴼⵔⵉ — recall the meaning.' },
  { id: 'meaning-to-latin', label: 'Recall the word', hint: 'See the meaning — recall the Tamazight word.' },
  { id: 'latin-to-tifinagh', label: 'Recall the script', hint: 'See the Latin word — recall the Tifinagh.' },
];

interface CardProgress {
  level: number;        // 0=new, 1-5=learning levels
  nextReview: number;   // unix seconds
  correct: number;
  incorrect: number;
}

const INTERVALS_S = [0, 60, 5 * 60, 30 * 60, 24 * 3600, 3 * 24 * 3600];
const STORAGE_KEY = 'amawal-progress-v1';
const SESSION_CAP = 20;

function loadProgress(): Record<string, CardProgress> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}
function saveProgress(p: Record<string, CardProgress>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* quota / private mode — silent */
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PracticeClient({ decks, featured }: { decks: DeckSpec[]; featured?: PracticeEntry }) {
  const [phase, setPhase] = useState<'select' | 'practice' | 'done'>('select');
  const [mode, setMode] = useState<Mode>('tifinagh-to-meaning');
  const [deckId, setDeckId] = useState<string | null>(null);
  const [queue, setQueue] = useState<PracticeEntry[]>([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [progress, setProgress] = useState<Record<string, CardProgress>>({});
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, total: 0 });
  const [locale, setLocale] = useState<AmawalLocale>('en');

  useEffect(() => {
    setProgress(loadProgress());
    const saved = localStorage.getItem(AMAWAL_LOCALE_KEY);
    if (saved === 'fr' || saved === 'en') setLocale(saved);
    const onLocale = (e: Event) => setLocale((e as CustomEvent<AmawalLocale>).detail);
    window.addEventListener(AMAWAL_LOCALE_EVENT, onLocale);
    return () => window.removeEventListener(AMAWAL_LOCALE_EVENT, onLocale);
  }, []);

  // Single-word deep link from /dictionary/[word] → /practice?word=…
  useEffect(() => {
    if (!featured) return;
    setDeckId('single');
    setQueue([featured]);
    setIdx(0);
    setFlipped(false);
    setStats({ correct: 0, incorrect: 0, total: 0 });
    setPhase('practice');
  }, [featured]);

  const startDeck = useCallback((deck: DeckSpec) => {
    const now = Date.now() / 1000;
    const prog = loadProgress();
    const due: PracticeEntry[] = [];
    const fresh: PracticeEntry[] = [];
    for (const e of deck.entries) {
      const p = prog[e.id];
      if (!p) fresh.push(e);
      else if (p.nextReview <= now) due.push(e);
    }
    let q = [...shuffle(due), ...shuffle(fresh)].slice(0, SESSION_CAP);
    if (q.length === 0) q = shuffle(deck.entries).slice(0, SESSION_CAP);
    setDeckId(deck.id);
    setQueue(q);
    setIdx(0);
    setFlipped(false);
    setStats({ correct: 0, incorrect: 0, total: 0 });
    setPhase('practice');
  }, []);

  const handleAnswer = useCallback(
    (correct: boolean) => {
      const card = queue[idx];
      if (!card) return;
      const now = Date.now() / 1000;
      const prev = progress[card.id] || { level: 0, nextReview: 0, correct: 0, incorrect: 0 };
      const newLevel = correct
        ? Math.min(prev.level + 1, INTERVALS_S.length - 1)
        : Math.max(prev.level - 1, 0);
      const updated: CardProgress = {
        level: newLevel,
        nextReview: now + INTERVALS_S[newLevel],
        correct: prev.correct + (correct ? 1 : 0),
        incorrect: prev.incorrect + (correct ? 0 : 1),
      };
      const next = { ...progress, [card.id]: updated };
      setProgress(next);
      saveProgress(next);
      setStats(s => ({
        correct: s.correct + (correct ? 1 : 0),
        incorrect: s.incorrect + (correct ? 0 : 1),
        total: s.total + 1,
      }));

      // Wrong answers come back later in the same session
      let nextQueue = queue;
      if (!correct && idx < queue.length - 1) {
        const insertAt = Math.min(idx + 3 + Math.floor(Math.random() * 3), queue.length);
        nextQueue = [...queue];
        nextQueue.splice(insertAt, 0, card);
        setQueue(nextQueue);
      }

      if (idx + 1 < nextQueue.length) {
        setIdx(idx + 1);
        setFlipped(false);
      } else {
        setPhase('done');
      }
    },
    [idx, progress, queue]
  );

  // Keyboard shortcuts during practice
  useEffect(() => {
    if (phase !== 'practice') return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === ' ' || e.key === 'Enter') && !flipped) {
        e.preventDefault();
        setFlipped(true);
      } else if (flipped && (e.key === 'ArrowRight' || e.key === '1')) {
        handleAnswer(true);
      } else if (flipped && (e.key === 'ArrowLeft' || e.key === '2')) {
        handleAnswer(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, flipped, handleAnswer]);

  const current = queue[idx];
  const lang = locale === 'fr' ? 'fr' : 'en';

  const meaningOf = (e: PracticeEntry) =>
    e.definitions.find(d => d.language === lang)?.meaning ??
    e.definitions.find(d => d.language === 'en')?.meaning ??
    e.definitions[0]?.meaning ??
    '';

  // ─── Deck selection ──────────────────────────────────────────────
  if (phase === 'select') {
    return (
      <div>
        <section className="px-6 md:px-[8%] lg:px-[12%] pt-20 pb-10">
          <Link href="/" className="text-sm text-neutral-500 hover:text-foreground transition-colors mb-8 inline-block">
            ← Back to dictionary
          </Link>
          <p className="text-[#c53a1a] text-xs font-medium uppercase tracking-[0.3em] mb-4">Practice</p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.9] mb-6 tracking-tight">
            Flash<em>cards</em>
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-lg max-w-xl leading-relaxed">
            Pick a deck. Flip the card. Mark what you know. Words you miss come back until you get them.
          </p>
        </section>

        <section className="px-6 md:px-[8%] lg:px-[12%] py-8 border-y border-neutral-100 dark:border-white/10">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4">Card direction</p>
          <div className="grid sm:grid-cols-3 gap-3">
            {MODES.map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                aria-pressed={mode === m.id}
                className={`text-left p-4 border transition-colors ${
                  mode === m.id
                    ? 'border-[#c53a1a] text-foreground'
                    : 'border-neutral-200 dark:border-white/10 text-neutral-500 hover:border-neutral-400 dark:hover:border-white/20'
                }`}
              >
                <span className={`block text-sm font-medium ${mode === m.id ? 'text-[#c53a1a]' : ''}`}>{m.label}</span>
                <span className="block text-xs text-neutral-500 mt-1 leading-relaxed">{m.hint}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="px-6 md:px-[8%] lg:px-[12%] py-12">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-6">Decks</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {decks.map(deck => {
              const learned = deck.entries.filter(e => (progress[e.id]?.level ?? 0) >= 3).length;
              return (
                <button
                  key={deck.id}
                  onClick={() => startDeck(deck)}
                  className="group text-left p-5 border border-neutral-200 dark:border-white/10 hover:border-neutral-400 dark:hover:border-white/30 transition-colors"
                >
                  <span className="font-display text-lg block group-hover:text-[#c53a1a] transition-colors">
                    {deck.label}
                  </span>
                  <span className="text-xs text-neutral-500 mt-2 block">
                    {deck.entries.length} cards
                    {learned > 0 && <> · {learned} learned</>}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="px-6 md:px-[8%] lg:px-[12%] pb-20">
          <p className="text-xs text-neutral-500">
            Keyboard: <span className="font-mono">space</span> to flip · <span className="font-mono">→</span> got it · <span className="font-mono">←</span> again
          </p>
        </section>
      </div>
    );
  }

  // ─── Done ────────────────────────────────────────────────────────
  if (phase === 'done') {
    const deck = decks.find(d => d.id === deckId);
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center max-w-lg">
          <p className="text-[#c53a1a] text-xs font-medium uppercase tracking-[0.3em] mb-6">Session complete</p>
          <p className="font-display text-5xl md:text-6xl mb-4 tracking-tight">
            {stats.correct}<span className="text-neutral-300 dark:text-neutral-700"> / </span>{stats.total}
          </p>
          <p className="text-neutral-500 text-base mb-12">
            {stats.incorrect === 0
              ? 'Clean run. Come back tomorrow.'
              : `${stats.incorrect} to revisit later.`}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {deck && (
              <button
                onClick={() => startDeck(deck)}
                className="px-6 py-3 bg-foreground text-background text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                Practice again
              </button>
            )}
            <button
              onClick={() => setPhase('select')}
              className="px-6 py-3 border border-foreground text-foreground text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
            >
              New deck
            </button>
            <Link
              href="/"
              className="px-6 py-3 border border-neutral-200 dark:border-white/10 text-neutral-500 text-sm uppercase tracking-wider hover:border-neutral-400 dark:hover:border-white/30 transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Practice ────────────────────────────────────────────────────
  if (!current) return null;

  const meaning = meaningOf(current);

  let frontContent: React.ReactNode;
  let backContent: React.ReactNode;
  if (mode === 'tifinagh-to-meaning') {
    frontContent = (
      <span className="tifinagh text-7xl md:text-8xl text-[#c53a1a] block leading-tight text-center">
        {current.tifinagh}
      </span>
    );
    backContent = (
      <div className="text-center">
        <span className="tifinagh text-4xl text-[#c53a1a]/30 block mb-5">{current.tifinagh}</span>
        <span className="font-display text-3xl md:text-4xl block mb-3 tracking-tight">{current.word}</span>
        <span className="text-xl text-foreground block">{meaning}</span>
        {current.pronunciation && (
          <span className="font-mono text-neutral-500 text-sm block mt-3">/{current.pronunciation}/</span>
        )}
      </div>
    );
  } else if (mode === 'meaning-to-latin') {
    frontContent = (
      <span className="font-display text-5xl md:text-6xl block text-center tracking-tight">{meaning}</span>
    );
    backContent = (
      <div className="text-center">
        <span className="tifinagh text-5xl md:text-6xl text-[#c53a1a] block mb-4">{current.tifinagh}</span>
        <span className="font-display text-3xl block mb-3 tracking-tight">{current.word}</span>
        {current.pronunciation && (
          <span className="font-mono text-neutral-500 text-sm block">/{current.pronunciation}/</span>
        )}
      </div>
    );
  } else {
    // latin-to-tifinagh — the killer mode
    frontContent = (
      <div className="text-center">
        <span className="font-display text-5xl md:text-6xl block tracking-tight">{current.word}</span>
        {current.pronunciation && (
          <span className="font-mono text-neutral-500 text-sm mt-3 block">/{current.pronunciation}/</span>
        )}
      </div>
    );
    backContent = (
      <div className="text-center">
        <span className="tifinagh text-7xl md:text-8xl text-[#c53a1a] block mb-5 leading-none">
          {current.tifinagh}
        </span>
        <span className="font-display text-2xl block mb-2 text-neutral-500">{current.word}</span>
        <span className="text-lg text-foreground block">{meaning}</span>
      </div>
    );
  }

  const cardLevel = progress[current.id]?.level ?? 0;
  const levelLabel = ['New', 'Learning', 'Learning', 'Reviewing', 'Known', 'Mastered'][cardLevel];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 md:px-[8%] lg:px-[12%] py-4 flex items-center justify-between border-b border-neutral-100 dark:border-white/10">
        <button
          onClick={() => setPhase('select')}
          className="text-sm text-neutral-500 hover:text-foreground transition-colors"
        >
          ← Decks
        </button>
        <div className="flex items-center gap-5 text-xs">
          <span className="text-neutral-500">{idx + 1} / {queue.length}</span>
          <div className="w-32 h-px bg-neutral-200 dark:bg-white/10 hidden md:block">
            <div
              className="h-full bg-[#c53a1a] transition-all duration-300"
              style={{ width: `${((idx + 1) / queue.length) * 100}%` }}
            />
          </div>
          <span className="text-neutral-500">
            <span className="text-foreground">{stats.correct}</span> · <span>{stats.incorrect}</span>
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          <div
            onClick={() => { if (!flipped) setFlipped(true); }}
            className={`relative w-full aspect-[4/3] border transition-colors duration-300 cursor-pointer flex items-center justify-center px-10 ${
              flipped
                ? 'border-neutral-200 dark:border-white/15'
                : 'border-neutral-100 dark:border-white/10 bg-neutral-50/40 dark:bg-white/[0.02] hover:border-neutral-300 dark:hover:border-white/20'
            }`}
          >
            <span className="absolute top-4 left-5 text-[10px] uppercase tracking-[0.2em] text-neutral-400">
              {levelLabel}
            </span>
            {!flipped && (
              <span className="absolute bottom-4 left-0 right-0 text-center text-xs text-neutral-400">
                tap or press space
              </span>
            )}
            {flipped ? backContent : frontContent}
          </div>

          {flipped && current.cultural && (
            <div className="mt-6 border-l-2 border-[#d4931a] pl-5">
              <p className="text-xs uppercase tracking-[0.2em] text-[#d4931a] mb-1">Note</p>
              <p className="text-sm text-foreground leading-relaxed">{current.cultural}</p>
            </div>
          )}

          {flipped && (
            <div className="grid grid-cols-2 gap-3 mt-8">
              <button
                onClick={() => handleAnswer(false)}
                className="py-4 border border-[#c53a1a]/40 text-[#c53a1a] text-sm uppercase tracking-wider hover:bg-[#c53a1a]/5 transition-colors"
              >
                Again
              </button>
              <button
                onClick={() => handleAnswer(true)}
                className="py-4 bg-foreground text-background text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                Got it
              </button>
            </div>
          )}

          {!flipped && (
            <div className="text-center mt-8">
              <button
                onClick={() => setFlipped(true)}
                className="text-sm text-neutral-500 hover:text-foreground transition-colors"
              >
                Show answer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
