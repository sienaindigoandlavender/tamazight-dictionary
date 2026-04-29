import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface LegalPage {
  title: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
}

const PAGES: Record<string, LegalPage> = {
  privacy: {
    title: 'Privacy',
    intro: "tamazight.io collects as little personal information as it can while still being useful. This page explains what's stored, where, and why.",
    sections: [
      {
        heading: 'What we store on your device',
        body: [
          'Your locale preference (English / French) — stored in your browser under amawal-locale so the site loads in the right language next time.',
          'A list of recently-viewed dictionary entries (up to 8) — stored under amawal_recent_v1 so the home page can show your trail. Cleared when you clear browser storage.',
          'Practice flashcard progress — level and next-review timestamp per word, stored under amawal-progress-v1. Used by the spaced-repetition scheduler. Stays on your device.',
        ],
      },
      {
        heading: 'What we send to third parties',
        body: [
          'Anonymous page-view analytics via Google Analytics. We never sell or share data. You can block this with any standard privacy extension and the site will continue to work.',
          'No accounts, no email, no advertising network, no cross-site tracking pixels.',
        ],
      },
      {
        heading: 'Cookies',
        body: [
          'The only cookie we set is the Google Analytics one. Everything else uses localStorage, which never leaves your device.',
        ],
      },
      {
        heading: 'Contact',
        body: [
          'For questions about this policy, email contact@dancingwiththelions.com or use the contact form.',
        ],
      },
    ],
  },
  terms: {
    title: 'Terms of use',
    intro: 'tamazight.io is a free educational reference. By using it you agree to a few simple rules.',
    sections: [
      {
        heading: 'Educational use',
        body: [
          'The dictionary, grammar, and learning surfaces are provided for personal study and research. You may quote entries with attribution to tamazight.io. Bulk reproduction, commercial republication, and AI training without permission are not permitted.',
        ],
      },
      {
        heading: 'Accuracy',
        body: [
          'We work hard to verify entries against published sources and native-speaker review, but Tamazight has many varieties and any reference will contain gaps and errors. If you find one, the contact form is the fastest way to let us know.',
        ],
      },
      {
        heading: 'Attribution',
        body: [
          'When citing the dictionary, please use: Dancing with Lions. (2026). Amawal: Tamazight Dictionary [Online resource]. https://tamazight.io',
        ],
      },
      {
        heading: 'Liability',
        body: [
          'The site is provided as-is. We make no warranties about fitness for any specific purpose. Use it for learning, travel, and curiosity — not for legal or medical translation without a qualified human reviewer.',
        ],
      },
    ],
  },
  accessibility: {
    title: 'Accessibility',
    intro: "We aim for tamazight.io to be usable by everyone. This page describes what's in place today and what we know is still rough.",
    sections: [
      {
        heading: 'What works',
        body: [
          'Semantic HTML throughout: every page uses proper headings, lists, and landmarks so screen readers can navigate.',
          'Keyboard support across the practice flashcards: space to flip, → got it, ← again. The home search and locale switcher are also fully reachable by keyboard.',
          'Light and dark themes follow your system preference and can be overridden with the theme toggle. Both modes meet WCAG AA contrast for body text.',
          'Tifinagh script renders via Noto Sans Tifinagh, with font swap so the page stays readable while the font loads.',
        ],
      },
      {
        heading: 'What we know is incomplete',
        body: [
          'The linguistic atlas (interactive map) is currently visual-only. A text-equivalent table of regions is on the roadmap.',
          'Audio playback (where available) does not yet have synchronised captions.',
        ],
      },
      {
        heading: 'Reporting an issue',
        body: [
          'Found something that’s hard to use, illegible, or broken? The contact form goes to a human. Be specific about the page and the assistive technology you’re using if relevant.',
        ],
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(PAGES).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) return { title: 'Not found' };
  return {
    title: `${page.title} — Tamazight Dictionary`,
    description: page.intro,
    alternates: { canonical: `https://tamazight.io/legal/${slug}` },
    robots: { index: false, follow: true },
  };
}

export default async function LegalPage({ params }: PageProps) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) notFound();

  return (
    <div className="px-6 md:px-[8%] lg:px-[12%] pt-20 pb-20">
      <Link
        href="/"
        className="text-sm text-neutral-500 hover:text-foreground transition-colors mb-8 inline-block"
      >
        ← Back to dictionary
      </Link>
      <p className="text-[#c53a1a] text-xs font-medium uppercase tracking-[0.3em] mb-4">Legal</p>
      <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[0.95] tracking-tight mb-8">
        {page.title}
      </h1>
      <p className="text-lg text-neutral-700 dark:text-neutral-300 max-w-3xl leading-relaxed mb-16">
        {page.intro}
      </p>

      <div className="max-w-3xl space-y-12">
        {page.sections.map(s => (
          <section key={s.heading}>
            <h2 className="font-display text-2xl md:text-3xl mb-5 tracking-tight">
              {s.heading}
            </h2>
            <div className="space-y-4 text-foreground leading-relaxed">
              {s.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="text-xs text-neutral-500 mt-16">
        Last reviewed April 2026.
      </p>
    </div>
  );
}
