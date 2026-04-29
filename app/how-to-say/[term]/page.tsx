import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getHowToSayTerm, getHowToSayTerms } from '@/lib/dictionary';

interface PageProps {
  params: Promise<{ term: string }>;
}

const SITE_URL = 'https://tamazight.io';

export function generateStaticParams() {
  return getHowToSayTerms('tachelhit').map(t => ({ term: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { term } = await params;
  const t = getHowToSayTerm(term, 'tachelhit');
  if (!t) return { title: 'Phrase not found' };

  const url = `${SITE_URL}/how-to-say/${t.slug}`;
  const title = `How to say "${t.label}" in Tamazight`;
  const meaning = t.entry.definitions.find(d => d.language === 'en')?.meaning ?? t.label;
  const description = `In Tachelhit Tamazight, ${t.label} is ${t.entry.word} (${t.entry.tifinagh})${t.entry.pronunciation ? `, pronounced /${t.entry.pronunciation}/` : ''}. ${meaning}.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function HowToSayPage({ params }: PageProps) {
  const { term } = await params;
  const t = getHowToSayTerm(term, 'tachelhit');
  if (!t) notFound();

  const meaning = t.entry.definitions.find(d => d.language === 'en')?.meaning ?? t.entry.definitions[0]?.meaning ?? t.label;
  const culturalNote = t.entry.usageNotes?.find(u => u.type === 'cultural')?.text;
  const example = t.entry.examples?.[0];
  const exampleEn = example?.translations?.find(tr => tr.language === 'en')?.text;

  // FAQ JSON-LD — search bait. Mirrors what people literally type into Google.
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How do you say "${t.label}" in Tamazight?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `In Tachelhit Tamazight, ${t.label} is ${t.entry.word} (${t.entry.tifinagh})${t.entry.pronunciation ? `, pronounced /${t.entry.pronunciation}/` : ''}.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is "${t.label}" in Berber?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Berber is a family of related languages spoken across North Africa. In the Tachelhit variety of southern Morocco, ${t.label} is ${t.entry.word}, written ${t.entry.tifinagh} in the Tifinagh script.`,
        },
      },
      ...(culturalNote
        ? [
            {
              '@type': 'Question',
              name: `Is there a cultural note for "${t.entry.word}"?`,
              acceptedAnswer: { '@type': 'Answer', text: culturalNote },
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />

      <div className="px-6 md:px-[8%] lg:px-[12%] pt-20 pb-20">
        <Link
          href="/how-to-say"
          className="text-sm text-neutral-500 hover:text-foreground transition-colors mb-8 inline-block"
        >
          ← All phrases
        </Link>

        <p className="text-[#c53a1a] text-xs font-medium uppercase tracking-[0.3em] mb-4">Tamazight Dictionary</p>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[0.95] tracking-tight mb-12 max-w-4xl">
          How to say <em>{t.label}</em> in Tamazight
        </h1>

        <div className="grid md:grid-cols-12 gap-10 md:gap-16 mb-16">
          <div className="md:col-span-7">
            <Link href={`/dictionary/${encodeURIComponent(t.entry.word)}`} className="group inline-block">
              <span className="tifinagh text-6xl md:text-8xl text-[#c53a1a] block leading-none mb-6 group-hover:opacity-80 transition-opacity">
                {t.entry.tifinagh}
              </span>
              <span className="font-display text-4xl md:text-6xl block tracking-tight group-hover:underline decoration-1 underline-offset-8">
                {t.entry.word}
              </span>
            </Link>

            {t.entry.pronunciation && (
              <p className="font-mono text-neutral-500 text-base mt-4 tracking-wide">
                /{t.entry.pronunciation}/
              </p>
            )}

            <p className="text-foreground text-xl md:text-2xl mt-8 max-w-2xl leading-relaxed">
              {meaning}
            </p>
          </div>

          {culturalNote && (
            <div className="md:col-span-5 md:col-start-8 flex items-start md:items-center">
              <div className="border-l-2 border-[#d4931a] pl-6 md:pl-8">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4931a] mb-3">
                  Cultural note
                </p>
                <p className="text-foreground leading-relaxed text-base md:text-lg">
                  {culturalNote}
                </p>
              </div>
            </div>
          )}
        </div>

        {example && (
          <section className="border-t border-neutral-100 dark:border-white/10 pt-12 mb-16 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-5">In a sentence</p>
            {example.tifinagh && (
              <p className="tifinagh text-2xl md:text-3xl text-[#c53a1a] leading-snug mb-3">
                {example.tifinagh}
              </p>
            )}
            <p className="font-display text-xl md:text-2xl italic text-neutral-700 dark:text-neutral-300 mb-3">
              {example.text}
            </p>
            {exampleEn && (
              <p className="text-foreground leading-relaxed">&ldquo;{exampleEn}&rdquo;</p>
            )}
          </section>
        )}

        <section className="border-t border-neutral-100 dark:border-white/10 pt-12 max-w-3xl">
          <h2 className="font-display text-2xl md:text-3xl mb-6 tracking-tight">
            Common questions
          </h2>
          <div className="space-y-8">
            <div>
              <p className="font-medium mb-2">How do you say &ldquo;{t.label}&rdquo; in Tamazight?</p>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                In Tachelhit Tamazight, <em>{t.label}</em> is <Link href={`/dictionary/${encodeURIComponent(t.entry.word)}`} className="underline decoration-dotted underline-offset-4 hover:text-[#c53a1a]">{t.entry.word}</Link>{' '}
                (<span className="tifinagh text-[#c53a1a]">{t.entry.tifinagh}</span>)
                {t.entry.pronunciation && <>, pronounced <span className="font-mono text-sm">/{t.entry.pronunciation}/</span></>}.
              </p>
            </div>
            <div>
              <p className="font-medium mb-2">Is &ldquo;Tamazight&rdquo; the same as &ldquo;Berber&rdquo;?</p>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Tamazight is the family&rsquo;s own name; Berber is the older external label. The forms here are <strong>Tachelhit</strong> — the variety spoken across the Souss in southern Morocco. Kabyle, Tarifit, and Central Atlas Tamazight share the underlying grammar with predictable shifts.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-neutral-100 dark:border-white/10 pt-12 mt-16 text-center">
          <p className="text-neutral-500 mb-6">See the full entry, with etymology, regional variants, and morphology.</p>
          <Link
            href={`/dictionary/${encodeURIComponent(t.entry.word)}`}
            className="inline-block px-8 py-4 bg-foreground text-background text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Open <em>{t.entry.word}</em> in the dictionary
          </Link>
        </section>
      </div>
    </>
  );
}
