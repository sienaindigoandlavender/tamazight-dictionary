import { Metadata } from 'next';
import Link from 'next/link';
import { getAllVerbs } from '@/lib/conjugation';

export const metadata: Metadata = {
  alternates: { canonical: 'https://amazigh.online/conjugation' },
  title: 'Verb Conjugation - Amawal Tamazight Dictionary',
  description: 'Learn Tachelhit verb conjugations including aorist, preterite, imperative, and intensive forms.',
};

export default function ConjugationPage() {
  const verbs = getAllVerbs('tachelhit');

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-20">
        <p className="section-subtitle mb-6">Grammar</p>
        <h1 className="tifinagh text-6xl md:text-8xl mb-6">ⵉⵎⵢⴰⴳⵏ</h1>
        <h2 className="section-title mb-6">Verb Conjugation</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Tachelhit verbs conjugate for person, number, and gender. Learn the main tenses:
          imperative, aorist, preterite, and intensive.
        </p>
      </div>

      {/* Tense Overview */}
      <section className="mb-20">
        <div className="mb-8">
          <p className="section-subtitle mb-2">Overview</p>
          <h3 className="font-serif text-3xl">Tenses</h3>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="card">
            <h4 className="font-serif text-xl mb-3">Imperative</h4>
            <p className="text-sm text-muted-foreground">
              Commands and requests. Has singular and plural forms.
            </p>
          </div>
          <div className="card">
            <h4 className="font-serif text-xl mb-3">Aorist</h4>
            <p className="text-sm text-muted-foreground">
              Non-past, general actions. Used with particles for future.
            </p>
          </div>
          <div className="card">
            <h4 className="font-serif text-xl mb-3">Preterite</h4>
            <p className="text-sm text-muted-foreground">
              Completed past actions. The main past tense.
            </p>
          </div>
          <div className="card">
            <h4 className="font-serif text-xl mb-3">Intensive</h4>
            <p className="text-sm text-muted-foreground">
              Habitual or ongoing actions. Also called imperfective.
            </p>
          </div>
        </div>
      </section>

      {/* Verb List */}
      <section className="mb-20">
        <div className="mb-8">
          <p className="section-subtitle mb-2">Dictionary</p>
          <h3 className="font-serif text-3xl">Common Verbs</h3>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {verbs.map(verb => (
            <Link
              key={verb.id}
              href={`/conjugation/${encodeURIComponent(verb.infinitive)}`}
              className="card hover:border-foreground/30 transition-colors group"
            >
              <div className="flex items-center gap-6">
                <span className="tifinagh text-3xl">
                  {verb.tifinagh}
                </span>
                <div className="flex-1">
                  <h4 className="font-serif text-xl mb-1">{verb.infinitive}</h4>
                  <p className="text-sm text-muted-foreground">
                    {verb.meaning}
                  </p>
                </div>
                <svg
                  className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Pronoun Reference */}
      <section className="border-t border-foreground/10 pt-16">
        <div className="max-w-3xl">
          <p className="section-subtitle mb-4">Reference</p>
          <h3 className="font-serif text-3xl mb-8">Pronoun Guide</h3>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">1s</span>
              <span>I</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">2s</span>
              <span>You (singular)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">3sm</span>
              <span>He</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">3sf</span>
              <span>She</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">1p</span>
              <span>We</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">2pm/2pf</span>
              <span>You (plural)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">3pm/3pf</span>
              <span>They</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
