import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getVerbByInfinitive, getAllVerbs } from '@/lib/conjugation';
import ConjugationTable from '@/components/ConjugationTable';
import AudioPlayer from '@/components/AudioPlayer';

interface PageProps {
  params: Promise<{ verb: string }>;
}

export async function generateStaticParams() {
  const verbs = getAllVerbs('tachelhit');
  return verbs.map(verb => ({
    verb: verb.infinitive,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { verb } = await params;
  const decodedVerb = decodeURIComponent(verb);
  const entry = getVerbByInfinitive(decodedVerb, 'tachelhit');

  if (!entry) {
    return { title: 'Verb Not Found - Amawal' };
  }

  return {
    title: `${entry.infinitive} (${entry.tifinagh}) Conjugation - Amawal`,
    description: `Complete conjugation of the Tachelhit verb "${entry.infinitive}" meaning "${entry.meaning}".`,
  };
}

export default async function VerbPage({ params }: PageProps) {
  const { verb } = await params;
  const decodedVerb = decodeURIComponent(verb);
  const entry = getVerbByInfinitive(decodedVerb, 'tachelhit');

  if (!entry) {
    notFound();
  }

  const allVerbs = getAllVerbs('tachelhit');
  const otherVerbs = allVerbs.filter(v => v.id !== entry.id).slice(0, 4);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Breadcrumb */}
      <nav className="mb-12 text-xs uppercase tracking-widest text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Dictionary</Link>
        <span className="mx-3">/</span>
        <Link href="/conjugation" className="hover:text-foreground transition-colors">Conjugation</Link>
        <span className="mx-3">/</span>
        <span className="text-foreground">{entry.infinitive}</span>
      </nav>

      {/* Verb Header */}
      <div className="mb-16">
        <div className="flex items-start justify-between gap-6 mb-8">
          <div>
            <span className="tifinagh text-5xl md:text-6xl block mb-4">
              {entry.tifinagh}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl mb-4">{entry.infinitive}</h1>
            <p className="text-muted-foreground">
              <span className="uppercase tracking-widest text-xs">EN</span>
              <span className="ml-3">{entry.meaning}</span>
            </p>
            <p className="text-muted-foreground">
              <span className="uppercase tracking-widest text-xs">FR</span>
              <span className="ml-3">{entry.meaningFr}</span>
            </p>
          </div>
          <AudioPlayer
            src={entry.audioFile ? `/audio/${entry.audioFile}` : undefined}
            word={entry.infinitive}
          />
        </div>
      </div>

      {/* Conjugation Table */}
      <ConjugationTable verb={entry} />

      {/* Other Verbs */}
      {otherVerbs.length > 0 && (
        <section className="mt-20 border-t border-foreground/10 pt-16">
          <p className="section-subtitle mb-6">More Verbs</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {otherVerbs.map(v => (
              <Link
                key={v.id}
                href={`/conjugation/${encodeURIComponent(v.infinitive)}`}
                className="card hover:border-foreground/30 transition-colors flex items-center gap-4"
              >
                <span className="tifinagh text-2xl">{v.tifinagh}</span>
                <div>
                  <span className="font-serif text-lg">{v.infinitive}</span>
                  <span className="text-sm text-muted-foreground ml-3">{v.meaning}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Back Links */}
      <div className="mt-16 flex gap-8 justify-center">
        <Link href="/conjugation" className="nav-link">
          ← All Verbs
        </Link>
        <Link href="/" className="nav-link">
          Dictionary
        </Link>
      </div>
    </div>
  );
}
