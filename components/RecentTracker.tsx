'use client';

import { useEffect } from 'react';
import { pushRecent } from './RecentlyViewed';

/**
 * Fire-and-forget client component.
 * Mounts on /dictionary/[word] pages and records the visit in localStorage.
 * Renders nothing.
 */
interface Props {
  word: string;
  tifinagh: string;
  sub: string;
}

export default function RecentTracker({ word, tifinagh, sub }: Props) {
  useEffect(() => {
    pushRecent({ word, tifinagh, sub });
  }, [word, tifinagh, sub]);

  return null;
}
