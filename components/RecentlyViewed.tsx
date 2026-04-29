'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

/**
 * Recently viewed — calm daily-use surface.
 * Reads localStorage only; renders nothing if empty (no skeleton, no nag).
 * Items are tracked by /dictionary/[word] pages on mount.
 *
 * Storage shape: [{ word, tifinagh, sub, ts }]
 * Cap at 8 items, dedupe by `word`.
 */
export interface RecentItem {
  word: string;       // dictionary slug — used in the URL
  tifinagh: string;   // visual mark shown as the label
  sub: string;        // a short gloss (English meaning at write time)
  ts: number;
}

const STORAGE_KEY = 'amawal_recent_v1';
const MAX_ITEMS = 8;

export function readRecent(): RecentItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i): i is RecentItem =>
        i && typeof i.word === 'string' && typeof i.tifinagh === 'string'
    );
  } catch {
    return [];
  }
}

export function pushRecent(item: Omit<RecentItem, 'ts'>) {
  if (typeof window === 'undefined') return;
  try {
    const list = readRecent();
    const filtered = list.filter(i => i.word !== item.word);
    const next = [{ ...item, ts: Date.now() }, ...filtered].slice(0, MAX_ITEMS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore (private mode, quota, etc.)
  }
}

export default function RecentlyViewed() {
  const [items, setItems] = useState<RecentItem[] | null>(null);

  useEffect(() => {
    setItems(readRecent());
  }, []);

  // Skip the section completely when empty — calm software, no empty states.
  if (!items || items.length === 0) return null;

  return (
    <section
      className="border-t border-neutral-100 dark:border-white/10 px-6 md:px-[8%] lg:px-[12%] py-10 md:py-16"
      aria-labelledby="recent-heading"
    >
      <p
        id="recent-heading"
        className="text-[#c53a1a] text-[11px] font-medium uppercase tracking-[0.3em] mb-6"
      >
        Recently viewed
      </p>

      <div className="flex flex-wrap gap-x-6 gap-y-3">
        {items.map(item => (
          <Link
            key={item.word}
            href={`/dictionary/${encodeURIComponent(item.word)}`}
            className="group inline-flex items-baseline gap-3 py-2 -my-2 transition-colors"
          >
            <span className="tifinagh text-lg md:text-xl text-[#c53a1a] group-hover:opacity-80 transition-opacity">
              {item.tifinagh}
            </span>
            <span className="font-display text-base md:text-lg group-hover:text-[#c53a1a] transition-colors">
              {item.word}
            </span>
            <span className="text-sm text-neutral-400 truncate max-w-[40vw] md:max-w-[16rem]">
              {item.sub}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
