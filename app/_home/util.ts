/**
 * Deterministic day-based shuffle: same content for the same day,
 * fresh content the next day, no client randomness, SEO-stable.
 */
export function dayIndex(): number {
  return Math.floor(Date.now() / 86_400_000);
}

export function pickByDay<T>(items: T[], count: number): T[] {
  if (items.length <= count) return items;
  const start = dayIndex() % items.length;
  const out: T[] = [];
  for (let i = 0; i < count; i++) {
    out.push(items[(start + i) % items.length]);
  }
  return out;
}
