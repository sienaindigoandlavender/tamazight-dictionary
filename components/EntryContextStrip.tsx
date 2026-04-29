'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CardProgress {
  level: number;
  nextReview: number;
  correct: number;
  incorrect: number;
}

const PROGRESS_KEY = 'amawal-progress-v1';
const LEVEL_LABEL = ['New', 'Learning', 'Learning', 'Reviewing', 'Known', 'Mastered'];

interface Props {
  entryId: string;
  word: string;
  isFirstDay: boolean;
}

/**
 * Small contextual strip on /dictionary/[word]:
 *   - First-day badge if curated
 *   - Practice level chip if there's localStorage progress
 *   - "Practice this word" deep-link to /practice?word=…
 *
 * Calm & quiet — only shows what's relevant; renders nothing when there's
 * neither badge nor progress. Hydration-safe (mounts client-side only).
 */
export default function EntryContextStrip({ entryId, word, isFirstDay }: Props) {
  const [progress, setProgress] = useState<CardProgress | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const all = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
      const p = all[entryId];
      if (p && typeof p.level === 'number') setProgress(p);
    } catch {
      /* ignore */
    }
  }, [entryId]);

  // Skip the section entirely until mounted to avoid hydration flash
  if (!mounted) return null;

  const levelLabel = progress ? LEVEL_LABEL[progress.level] : null;

  return (
    <div className="flex flex-wrap items-center gap-3 mt-4">
      {isFirstDay && (
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#c53a1a] border border-[#c53a1a]/30 px-2.5 py-1">
          First-day essential
        </span>
      )}
      {levelLabel && (
        <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 border border-neutral-200 dark:border-white/10 px-2.5 py-1">
          {levelLabel}
        </span>
      )}
      <Link
        href={`/practice?word=${encodeURIComponent(word)}`}
        className="text-[10px] uppercase tracking-[0.25em] text-foreground border border-foreground px-2.5 py-1 hover:bg-foreground hover:text-background transition-colors"
      >
        Practice this word →
      </Link>
    </div>
  );
}
