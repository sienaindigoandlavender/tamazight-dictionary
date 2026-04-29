import type { Metadata } from 'next';
import Link from 'next/link';
import { getHowToSayTerms } from '@/lib/dictionary';

export const metadata: Metadata = {
  title: 'How to say — common words in Tamazight (Berber)',
  description: 'How to say hello, thank you, water, mother, freedom, and 30+ more in Tamazight (Tachelhit Berber). Tifinagh script, pronunciation, and cultural notes.',
  alternates: { canonical: 'https://tamazight.io/how-to-say' },
  openGraph: {
    title: 'How to say — common words in Tamazight',
    description: 'Hello, thank you, water, mother, freedom — and 30 more, with Tifinagh and pronunciation.',
  },
};

export default function HowToSayIndex() {
  const terms = getHowToSayTerms('tachelhit');

  // Group by group label, preserving the data file's order.
  const groups = terms.reduce<Record<string, typeof terms>>((acc, t) => {
    (acc[t.group] = acc[t.group] || []).push(t);
    return acc;
  }, {});

  return (
    <div>
      <section className="px-6 md:px-[8%] lg:px-[12%] pt-20 pb-16">
        <Link
          href="/"
          className="text-sm text-neutral-500 hover:text-foreground transition-colors mb-8 inline-block"
        >
          ← Back to dictionary
        </Link>
        <p className="text-[#c53a1a] text-xs font-medium uppercase tracking-[0.3em] mb-4">Phrase guide</p>
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.9] mb-6 tracking-tight">
          How to say<br /><em>anything</em> in Tamazight
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-lg max-w-2xl leading-relaxed">
          {terms.length} essential words and phrases, each with the Tifinagh script, pronunciation, and the context most learners never get. Tachelhit forms — the dialect of southern Morocco.
        </p>
      </section>

      {Object.entries(groups).map(([label, items]) => (
        <section
          key={label}
          className="px-6 md:px-[8%] lg:px-[12%] py-12 border-t border-neutral-100 dark:border-white/10"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-6">{label}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-1">
            {items.map(t => (
              <Link
                key={t.slug}
                href={`/how-to-say/${t.slug}`}
                className="group flex items-baseline gap-3 py-3 border-b border-neutral-50 dark:border-white/5 hover:border-neutral-200 dark:hover:border-white/15 transition-colors"
              >
                <span className="text-sm text-neutral-500">How to say</span>
                <span className="font-display text-lg group-hover:text-[#c53a1a] transition-colors">
                  {t.label}
                </span>
                <span className="ml-auto tifinagh text-base text-[#c53a1a] opacity-70 group-hover:opacity-100 transition-opacity">
                  {t.entry.tifinagh}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <section className="px-6 md:px-[8%] lg:px-[12%] py-16 text-center border-t border-neutral-100 dark:border-white/10">
        <p className="text-neutral-500 mb-6">Looking for a word that isn&rsquo;t here?</p>
        <Link
          href="/"
          className="inline-block px-8 py-4 bg-foreground text-background text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          Search the dictionary
        </Link>
      </section>
    </div>
  );
}
