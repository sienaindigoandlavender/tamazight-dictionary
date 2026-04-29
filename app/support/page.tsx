import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Support this work — Tamazight Dictionary',
  description: 'tamazight.io is and stays free. If you want to help it grow, there is a quiet way to chip in.',
  alternates: { canonical: 'https://tamazight.io/support' },
  robots: { index: true, follow: true },
};

const SUPPORT_URL = process.env.NEXT_PUBLIC_SUPPORT_URL || 'https://buy.stripe.com';
const ENABLED = Boolean(process.env.NEXT_PUBLIC_SUPPORT_URL);

const TIERS: { amount: string; cadence: string; line: string }[] = [
  { amount: '€5', cadence: 'one time', line: 'A coffee. Pays for one quiet weekend of corpus work.' },
  { amount: '€25', cadence: 'one time', line: 'A book. Funds verifying and adding ~50 entries.' },
  { amount: '€10', cadence: 'a month', line: 'Steady. Lets us bring on native-speaker reviewers regularly.' },
];

export default function SupportPage() {
  return (
    <div className="px-6 md:px-[8%] lg:px-[12%] pt-20 pb-20">
      <Link
        href="/"
        className="text-sm text-neutral-500 hover:text-foreground transition-colors mb-8 inline-block"
      >
        ← Back to dictionary
      </Link>

      <p className="text-[#c53a1a] text-xs font-medium uppercase tracking-[0.3em] mb-4">Patron</p>
      <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.9] mb-8 tracking-tight">
        Free, with the<br />option to <em>help</em>
      </h1>

      <div className="grid md:grid-cols-12 gap-10 md:gap-16 mb-16">
        <div className="md:col-span-7 space-y-5 text-lg leading-relaxed">
          <p>
            tamazight.io is free, has no ads, no tracking, and no account walls — and that won&rsquo;t change. The dictionary, the grammar, the practice flashcards, the dialect atlas, all of it: yours to use, share, cite.
          </p>
          <p>
            But the work isn&rsquo;t free to do. Every entry is verified against published sources and reviewed by native speakers. The corpus grows slowly because the alternative is sloppy. If the site is useful to you and you&rsquo;d like to nudge that work forward, here are three ways.
          </p>
        </div>
      </div>

      <ul role="list" className="space-y-0 max-w-3xl mb-16">
        {TIERS.map((tier, i) => {
          const inner = (
            <>
              <div className="flex items-baseline gap-5">
                <span className="font-display text-3xl md:text-4xl text-[#c53a1a]">{tier.amount}</span>
                <span className="text-xs uppercase tracking-[0.25em] text-neutral-500">{tier.cadence}</span>
              </div>
              <span className="text-foreground text-base md:text-lg max-w-md text-right">
                {tier.line}
              </span>
            </>
          );
          return (
            <li key={i}>
              {ENABLED ? (
                <a
                  href={SUPPORT_URL}
                  rel="noopener"
                  target="_blank"
                  className="group flex items-baseline justify-between gap-6 py-6 border-b border-neutral-100 dark:border-white/10 hover:border-foreground transition-colors"
                >
                  {inner}
                </a>
              ) : (
                <div
                  aria-disabled="true"
                  className="flex items-baseline justify-between gap-6 py-6 border-b border-neutral-100 dark:border-white/10 opacity-60"
                >
                  {inner}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {!ENABLED && (
        <div className="border-l-2 border-[#d4931a] pl-6 max-w-2xl mb-12">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#d4931a] mb-2">Patron program opening soon</p>
          <p className="text-foreground leading-relaxed">
            We&rsquo;re finalising the payment side. Until then, if you&rsquo;d like to support the project, the most valuable thing you can do is share it with someone learning Tamazight, or send corrections via the{' '}
            <Link href="/contact" className="underline decoration-dotted underline-offset-4 hover:text-[#c53a1a]">
              contact form
            </Link>
            . Both are free and both compound.
          </p>
        </div>
      )}

      <div className="max-w-3xl space-y-8">
        <section>
          <h2 className="font-display text-2xl md:text-3xl mb-4 tracking-tight">What we won&rsquo;t do</h2>
          <ul className="space-y-3 text-foreground leading-relaxed list-none pl-0">
            <li>— Put a paywall on the dictionary, the grammar, or any reference content. Knowledge of Tamazight is heritage, not a product.</li>
            <li>— Sell, share, or rent your data. We don&rsquo;t collect any to begin with — just the email if you subscribe to the weekly word.</li>
            <li>— Run ads. The reading experience stays clean.</li>
            <li>— Use accounts to gate features that currently work without them.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl md:text-3xl mb-4 tracking-tight">What support funds</h2>
          <ul className="space-y-3 text-foreground leading-relaxed list-none pl-0">
            <li>— Corpus expansion: more Tachelhit entries, then Central Atlas, Tarifit, Kabyle, Tuareg.</li>
            <li>— Native-speaker review for every entry before it goes live.</li>
            <li>— Audio recordings from speakers across regions, when we&rsquo;re ready to ship them.</li>
            <li>— French and Arabic translations of the long-form pages (grammar, legal, learning surfaces).</li>
            <li>— Server costs and the small slice of dignity that makes this possible to keep doing.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
