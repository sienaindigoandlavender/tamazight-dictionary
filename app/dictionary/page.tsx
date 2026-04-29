import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllEntries, getAvailableSemanticFields } from '@/lib/dictionary';
import type { DictionaryEntry, SemanticField } from '@/types';

export const metadata: Metadata = {
  title: 'Browse the Tamazight dictionary — every entry, every field',
  description: 'Browse every entry in the Tachelhit Tamazight dictionary, grouped by semantic field — nature, body, family, food, time, numbers, music, and more.',
  alternates: { canonical: 'https://tamazight.io/dictionary' },
  openGraph: {
    title: 'Browse the Tamazight dictionary',
    description: 'Every entry, organised by semantic field, with Tifinagh and pronunciation.',
  },
};

const FIELD_LABEL: Partial<Record<SemanticField, string>> = {
  nature: 'Nature',
  body: 'Body',
  family: 'Family',
  food: 'Food',
  agriculture: 'Agriculture',
  animals: 'Animals',
  time: 'Time',
  numbers: 'Numbers',
  abstract: 'Abstract',
  emotion: 'Emotions',
  emotions: 'Emotions',
  music: 'Music',
  color: 'Colour',
  weather: 'Weather',
  water: 'Water',
  geography: 'Geography',
  architecture: 'Architecture',
  religion: 'Faith & Festival',
  culture: 'Culture',
  community: 'Community',
  social: 'Social',
  society: 'Society',
  governance: 'Governance',
  identity: 'Identity',
  knowledge: 'Knowledge',
  craft: 'Craft',
  textile: 'Textile',
  adornment: 'Adornment',
  travel: 'Travel',
  commerce: 'Commerce',
  direction: 'Direction',
  clothing: 'Clothing',
  household: 'Household',
  house: 'House',
  language: 'Language',
  writing: 'Writing',
  communication: 'Communication',
  politics: 'Politics',
  cosmology: 'Cosmology',
  space: 'Space',
  people: 'People',
};

interface GroupedField {
  id: SemanticField;
  label: string;
  entries: DictionaryEntry[];
}

export default function DictionaryIndex() {
  const all = getAllEntries('tachelhit');
  const fields = getAvailableSemanticFields('tachelhit');

  // Group by primary semantic field, alphabetised within each group.
  const seen = new Set<string>();
  const groups: GroupedField[] = [];
  for (const f of fields) {
    const matches = all.filter(e => e.semanticFields?.[0] === f && !seen.has(e.id));
    if (matches.length === 0) continue;
    matches.forEach(e => seen.add(e.id));
    matches.sort((a, b) => a.word.localeCompare(b.word));
    groups.push({
      id: f,
      label: FIELD_LABEL[f] ?? f.charAt(0).toUpperCase() + f.slice(1),
      entries: matches,
    });
  }
  // Catch any entries whose primary field wasn't grouped (e.g. no fields at all)
  const remaining = all.filter(e => !seen.has(e.id));
  if (remaining.length > 0) {
    remaining.sort((a, b) => a.word.localeCompare(b.word));
    groups.push({ id: 'abstract' as SemanticField, label: 'Other', entries: remaining });
  }
  groups.sort((a, b) => b.entries.length - a.entries.length);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Tamazight Dictionary — Tachelhit',
    description: `${all.length} entries across ${groups.length} semantic fields.`,
    inLanguage: ['shi', 'zgh'],
    numberOfItems: all.length,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div>
        <section className="px-6 md:px-[8%] lg:px-[12%] pt-20 pb-12">
          <Link
            href="/"
            className="text-sm text-neutral-500 hover:text-foreground transition-colors mb-8 inline-block"
          >
            ← Back to search
          </Link>
          <p className="text-[#c53a1a] text-xs font-medium uppercase tracking-[0.3em] mb-4">Browse</p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.9] mb-6 tracking-tight">
            Every word<br />in the dictionary
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-lg max-w-2xl leading-relaxed">
            {all.length} Tachelhit entries grouped by semantic field. Each row links through to the full entry — etymology, regional variants, examples, and the practice button.
          </p>
        </section>

        <nav className="px-6 md:px-[8%] lg:px-[12%] py-5 border-y border-neutral-100 dark:border-white/10 sticky top-14 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur z-30">
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {groups.map(g => (
              <a
                key={g.id}
                href={`#${g.id}`}
                className="text-neutral-500 dark:text-neutral-400 hover:text-[#c53a1a] transition-colors"
              >
                {g.label}
                <span className="text-neutral-400 ml-1">{g.entries.length}</span>
              </a>
            ))}
          </div>
        </nav>

        {groups.map(g => (
          <section
            key={g.id}
            id={g.id}
            className="px-6 md:px-[8%] lg:px-[12%] py-16 border-t border-neutral-100 dark:border-white/10"
          >
            <div className="flex items-baseline justify-between mb-10">
              <h2 className="font-display text-3xl md:text-4xl tracking-tight">{g.label}</h2>
              <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                {g.entries.length} {g.entries.length === 1 ? 'entry' : 'entries'}
              </span>
            </div>

            <ul role="list" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-1">
              {g.entries.map(e => {
                const meaning =
                  e.definitions.find(d => d.language === 'en')?.meaning ??
                  e.definitions[0]?.meaning;
                return (
                  <li key={e.id}>
                    <Link
                      href={`/dictionary/${encodeURIComponent(e.word)}`}
                      className="group flex items-baseline justify-between gap-3 py-3 border-b border-neutral-50 dark:border-white/5 hover:border-neutral-200 dark:hover:border-white/15 transition-colors"
                    >
                      <span className="flex items-baseline gap-3 min-w-0">
                        <span className="tifinagh text-lg text-[#c53a1a] shrink-0 leading-none">
                          {e.tifinagh}
                        </span>
                        <span className="font-display text-base group-hover:text-[#c53a1a] transition-colors truncate">
                          {e.word}
                        </span>
                      </span>
                      <span className="text-sm text-neutral-500 truncate text-right max-w-[55%]">
                        {meaning}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}

        <section className="px-6 md:px-[8%] lg:px-[12%] py-16 border-t border-neutral-100 dark:border-white/10 text-center">
          <p className="text-neutral-500 mb-6">
            Looking for something specific? The home page has search across the whole corpus.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-foreground text-background text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Search the dictionary
          </Link>
        </section>
      </div>
    </>
  );
}
