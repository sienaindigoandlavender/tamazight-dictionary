import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getEntryByWord, getAllEntries, getEntriesByRoot } from '@/lib/dictionary';
import AudioPlayer from '@/components/AudioPlayer';
import WordHeatMap from '@/components/WordHeatMap';
import { DictionaryEntry, Example, CrossReference, UsageNote, Variant, RegionalUsage, SemanticShift } from '@/types';

interface PageProps {
  params: Promise<{ word: string }>;
}

export async function generateStaticParams() {
  const entries = getAllEntries('tachelhit');
  return entries.map(entry => ({
    word: entry.word,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { word } = await params;
  const decodedWord = decodeURIComponent(word);
  const entry = getEntryByWord(decodedWord, 'tachelhit');

  if (!entry) {
    return { title: 'Word Not Found - Amawal' };
  }

  return {
    title: `${entry.word} (${entry.tifinagh}) - Amawal Tamazight Dictionary`,
    description: `${entry.word} means "${entry.definitions[0]?.meaning}" in Tachelhit. Tifinagh: ${entry.tifinagh}. Learn pronunciation, etymology, and examples.`,
    alternates: { canonical: `https://amazigh.online/dictionary/${encodeURIComponent(entry.word)}` },
  };
}

// Region labels for display
const regionLabels: Record<string, string> = {
  tachelhit: 'Tachelhit',
  kabyle: 'Kabyle',
  tarifit: 'Tarifit',
  'central-atlas': 'Central Atlas',
  tuareg: 'Tuareg',
  zenaga: 'Zenaga',
  ghomara: 'Ghomara',
};

// Usage note type labels
const usageNoteLabels: Record<string, string> = {
  grammar: 'Grammar',
  semantic: 'Meaning',
  pragmatic: 'Usage',
  cultural: 'Cultural',
  warning: 'Note',
};

// Cross-reference type labels
const crossRefLabels: Record<string, string> = {
  synonym: 'Synonym',
  antonym: 'Antonym',
  'see-also': 'See also',
  compare: 'Compare',
  derived: 'Derived',
  root: 'Root',
};

// Section component for consistency
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <h2 className="section-subtitle mb-6">{title}</h2>
      {children}
    </div>
  );
}

// Definitions section with all languages
function DefinitionsSection({ entry }: { entry: DictionaryEntry }) {
  // Group definitions by language
  const enDefs = entry.definitions.filter(d => d.language === 'en');
  const frDefs = entry.definitions.filter(d => d.language === 'fr');
  const arDefs = entry.definitions.filter(d => d.language === 'ar');
  const esDefs = entry.definitions.filter(d => d.language === 'es');

  return (
    <Section title="Definitions">
      <div className="space-y-6">
        {enDefs.length > 0 && (
          <div className="flex items-start gap-4">
            <span className="text-xs uppercase tracking-widest text-muted-foreground w-16 pt-1">EN</span>
            <div className="flex-1">
              {enDefs.map((def, i) => (
                <p key={i} className="font-serif text-xl">
                  {def.meaning}
                  {def.context && (
                    <span className="text-sm text-muted-foreground ml-2">({def.context})</span>
                  )}
                </p>
              ))}
            </div>
          </div>
        )}
        {frDefs.length > 0 && (
          <div className="flex items-start gap-4">
            <span className="text-xs uppercase tracking-widest text-muted-foreground w-16 pt-1">FR</span>
            <div className="flex-1">
              {frDefs.map((def, i) => (
                <p key={i} className="font-serif text-xl text-foreground/80">
                  {def.meaning}
                  {def.context && (
                    <span className="text-sm text-muted-foreground ml-2">({def.context})</span>
                  )}
                </p>
              ))}
            </div>
          </div>
        )}
        {arDefs.length > 0 && (
          <div className="flex items-start gap-4">
            <span className="text-xs uppercase tracking-widest text-muted-foreground w-16 pt-1">AR</span>
            <div className="flex-1" dir="rtl">
              {arDefs.map((def, i) => (
                <p key={i} className="font-serif text-xl text-foreground/80">
                  {def.meaning}
                </p>
              ))}
            </div>
          </div>
        )}
        {esDefs.length > 0 && (
          <div className="flex items-start gap-4">
            <span className="text-xs uppercase tracking-widest text-muted-foreground w-16 pt-1">ES</span>
            <div className="flex-1">
              {esDefs.map((def, i) => (
                <p key={i} className="font-serif text-xl text-foreground/80">
                  {def.meaning}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}

// Etymology section
function EtymologySection({ entry }: { entry: DictionaryEntry }) {
  if (!entry.etymology) return null;
  const { etymology } = entry;

  return (
    <Section title="Etymology">
      <div className="space-y-4 border-l border-foreground/10 pl-6">
        {/* Root */}
        {etymology.root && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Root:</span>
            <span className="font-serif text-lg">{etymology.root}</span>
            {etymology.rootTifinagh && (
              <span className="tifinagh text-lg">{etymology.rootTifinagh}</span>
            )}
          </div>
        )}

        {/* Origin */}
        {etymology.origin && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Origin:</span>
            <span className="text-sm capitalize">{etymology.origin.replace('-', ' ')}</span>
          </div>
        )}

        {/* Borrowed from */}
        {etymology.borrowedFrom && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Borrowed from:</span>
            <span className="text-sm">
              {etymology.borrowedFrom.language}: <em>{etymology.borrowedFrom.word}</em>
              {etymology.borrowedFrom.meaning && ` (${etymology.borrowedFrom.meaning})`}
            </span>
          </div>
        )}

        {/* Cognates */}
        {etymology.cognates && etymology.cognates.length > 0 && (
          <div>
            <span className="text-sm text-muted-foreground block mb-3">Cognates across Berber varieties:</span>
            <div className="flex flex-wrap gap-3">
              {etymology.cognates.map((cognate, i) => (
                <div
                  key={i}
                  className="px-4 py-2 border border-foreground/10 text-sm"
                >
                  <span className="text-muted-foreground">{regionLabels[cognate.region] || cognate.region}:</span>
                  <span className="ml-2 font-medium">{cognate.word}</span>
                  <span className="tifinagh ml-2">{cognate.tifinagh}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Historical notes */}
        {etymology.notes && (
          <p className="text-sm text-muted-foreground italic mt-4">{etymology.notes}</p>
        )}
      </div>
    </Section>
  );
}

// Morphology section
function MorphologySection({ entry }: { entry: DictionaryEntry }) {
  if (!entry.morphology) return null;
  const { morphology } = entry;

  return (
    <Section title="Morphology">
      <div className="space-y-4 border-l border-foreground/10 pl-6">
        {/* Root and pattern */}
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Root:</span>
            <span className="font-serif text-lg">{morphology.root}</span>
            <span className="tifinagh text-lg">{morphology.rootTifinagh}</span>
          </div>
          {morphology.pattern && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Pattern:</span>
              <span className="font-mono text-sm">{morphology.pattern}</span>
            </div>
          )}
          {morphology.state && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">State:</span>
              <span className="text-sm capitalize">{morphology.state}</span>
            </div>
          )}
        </div>

        {/* Feminine form */}
        {morphology.feminine && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Feminine:</span>
            <span className="font-serif text-lg">{morphology.feminine.word}</span>
            <span className="tifinagh">{morphology.feminine.tifinagh}</span>
          </div>
        )}

        {/* Singulative (for collective nouns) */}
        {morphology.singulative && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Singulative:</span>
            <span className="font-serif text-lg">{morphology.singulative.word}</span>
            <span className="tifinagh">{morphology.singulative.tifinagh}</span>
          </div>
        )}

        {/* Derived forms */}
        {morphology.derivedForms && morphology.derivedForms.length > 0 && (
          <div>
            <span className="text-sm text-muted-foreground block mb-3">Derived forms:</span>
            <div className="grid gap-2">
              {morphology.derivedForms.map((form, i) => (
                <div key={i} className="flex items-center gap-4 py-2 px-4 border border-foreground/10">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground w-24">{form.type}</span>
                  <span className="font-serif">{form.word}</span>
                  <span className="tifinagh">{form.tifinagh}</span>
                  <span className="text-sm text-muted-foreground">— {form.meaning}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}

// Regional distribution section with heat map
function RegionalDistributionSection({ entry }: { entry: DictionaryEntry }) {
  if (!entry.regionalUsage || entry.regionalUsage.length === 0) return null;

  return (
    <Section title="Regional Distribution">
      <WordHeatMap
        word={entry.word}
        tifinagh={entry.tifinagh}
        regionalUsage={entry.regionalUsage as RegionalUsage[]}
        semanticShifts={entry.semanticShifts as SemanticShift[]}
        isUniversal={entry.distribution?.isUniversal}
        isPanBerber={entry.distribution?.isPanBerber}
      />
      {entry.distribution && (
        <div className="mt-4 flex flex-wrap gap-3">
          {entry.distribution.isUniversal && (
            <span className="text-xs px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200">
              Universal across regions
            </span>
          )}
          {entry.distribution.isPanBerber && (
            <span className="text-xs px-3 py-1 bg-blue-100 text-blue-800 border border-blue-200">
              Pan-Berber term
            </span>
          )}
          {entry.distribution.attestedSince && (
            <span className="text-xs px-3 py-1 bg-amber-100 text-amber-800 border border-amber-200">
              Attested since: {entry.distribution.attestedSince}
            </span>
          )}
        </div>
      )}
      {entry.distribution?.historicalNotes && (
        <p className="text-sm text-muted-foreground italic mt-4">
          {entry.distribution.historicalNotes}
        </p>
      )}
    </Section>
  );
}

// Examples section with source attribution
function ExamplesSection({ examples }: { examples: Example[] }) {
  if (!examples || examples.length === 0) return null;

  return (
    <Section title="Examples">
      <div className="space-y-6">
        {examples.map((example, index) => (
          <div key={index} className="border-l border-foreground/20 pl-6">
            <div className="flex flex-wrap items-center gap-4 mb-3">
              <span className="tifinagh text-xl">{example.tifinagh}</span>
              <span className="font-serif text-lg">{example.text}</span>
            </div>
            <div className="space-y-1 ml-0">
              {example.translations.map((trans, i) => (
                <p key={i} className="text-muted-foreground">
                  <span className="text-xs uppercase tracking-widest mr-2">{trans.language}</span>
                  <span className="italic">&ldquo;{trans.text}&rdquo;</span>
                </p>
              ))}
            </div>
            {example.source && (
              <p className="text-xs text-muted-foreground mt-2">
                — {example.source.type === 'proverb' ? 'Proverb' : example.source.type}
                {example.source.attribution && `: ${example.source.attribution}`}
              </p>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}

// Usage notes section
function UsageNotesSection({ notes }: { notes: UsageNote[] }) {
  if (!notes || notes.length === 0) return null;

  return (
    <Section title="Usage Notes">
      <div className="space-y-3">
        {notes.map((note, index) => (
          <div key={index} className="flex items-start gap-4 py-3 px-4 border border-foreground/10">
            <span className="text-xs uppercase tracking-widest text-muted-foreground w-20">
              {usageNoteLabels[note.type] || note.type}
            </span>
            <p className="text-sm flex-1">{note.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

// Dialectal variants section
function VariantsSection({ variants }: { variants: Variant[] }) {
  if (!variants || variants.length === 0) return null;

  return (
    <Section title="Regional Variants">
      <div className="grid gap-3 sm:grid-cols-2">
        {variants.map((variant, index) => (
          <div key={index} className="py-3 px-4 border border-foreground/10">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              {regionLabels[variant.region] || variant.region}
            </div>
            <div className="flex items-center gap-3">
              <span className="tifinagh text-xl">{variant.tifinagh}</span>
              <span className="font-serif text-lg">{variant.word}</span>
              <span className="text-sm text-muted-foreground">{variant.pronunciation}</span>
            </div>
            {variant.notes && (
              <p className="text-sm text-muted-foreground mt-2">{variant.notes}</p>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}

// Cross-references section
function CrossReferencesSection({ crossRefs }: { crossRefs: CrossReference[] }) {
  if (!crossRefs || crossRefs.length === 0) return null;

  // Group by type
  const grouped = crossRefs.reduce((acc, ref) => {
    if (!acc[ref.type]) acc[ref.type] = [];
    acc[ref.type].push(ref);
    return acc;
  }, {} as Record<string, CrossReference[]>);

  return (
    <Section title="Related">
      <div className="space-y-4">
        {Object.entries(grouped).map(([type, refs]) => (
          <div key={type} className="flex items-start gap-4">
            <span className="text-xs uppercase tracking-widest text-muted-foreground w-20 pt-1">
              {crossRefLabels[type] || type}
            </span>
            <div className="flex flex-wrap gap-2">
              {refs.map((ref, i) => (
                <Link
                  key={i}
                  href={`/dictionary/${encodeURIComponent(ref.word)}`}
                  className="inline-flex items-center gap-2 px-3 py-1 border border-foreground/10 hover:border-foreground/30 transition-colors"
                >
                  <span className="tifinagh">{ref.tifinagh}</span>
                  <span className="text-sm">{ref.word}</span>
                  {ref.notes && (
                    <span className="text-xs text-muted-foreground">({ref.notes})</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// Related by root section
function RelatedByRootSection({ entry }: { entry: DictionaryEntry }) {
  const root = entry.morphology?.root || entry.etymology?.root;
  if (!root) return null;

  const relatedByRoot = getEntriesByRoot(root, 'tachelhit').filter(e => e.id !== entry.id);
  if (relatedByRoot.length === 0) return null;

  return (
    <section className="border-t border-foreground/10 pt-12 mt-12">
      <h2 className="section-subtitle mb-6">Words with root {root}</h2>
      <div className="flex flex-wrap gap-3">
        {relatedByRoot.map(related => (
          <Link
            key={related.id}
            href={`/dictionary/${encodeURIComponent(related.word)}`}
            className="inline-flex items-center gap-3 px-4 py-2 border border-foreground/10 hover:border-foreground/30 transition-colors"
          >
            <span className="tifinagh">{related.tifinagh}</span>
            <span className="font-serif">{related.word}</span>
            <span className="text-xs text-muted-foreground">
              {related.definitions[0]?.meaning.split(',')[0]}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

// Generate JSON-LD structured data for dictionary entry
function generateJsonLd(entry: DictionaryEntry) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amazigh.online';

  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "name": entry.word,
    "alternateName": entry.tifinagh,
    "description": entry.definitions.find(d => d.language === 'en')?.meaning || entry.definitions[0]?.meaning,
    "inDefinedTermSet": {
      "@type": "DefinedTermSet",
      "name": "Amawal Tamazight Dictionary",
      "url": siteUrl,
    },
    "termCode": entry.pronunciation,
    "url": `${siteUrl}/dictionary/${encodeURIComponent(entry.word)}`,
    ...(entry.etymology?.root && {
      "additionalProperty": {
        "@type": "PropertyValue",
        "name": "root",
        "value": entry.etymology.root,
      },
    }),
  };
}

export default async function WordPage({ params }: PageProps) {
  const { word } = await params;
  const decodedWord = decodeURIComponent(word);
  const entry = getEntryByWord(decodedWord, 'tachelhit');

  if (!entry) {
    notFound();
  }

  const jsonLd = generateJsonLd(entry);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Breadcrumb */}
      <nav className="mb-12 text-xs uppercase tracking-widest text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Dictionary</Link>
        <span className="mx-3">/</span>
        <span className="text-foreground">{entry.word}</span>
      </nav>

      {/* Main Entry Header */}
      <article className="mb-16">
        <div className="flex items-start justify-between gap-6 mb-8">
          <div>
            <span className="tifinagh text-5xl md:text-6xl block mb-4">{entry.tifinagh}</span>
            <h1 className="font-serif text-4xl md:text-5xl mb-4">{entry.word}</h1>
            {entry.plural && (
              <p className="text-muted-foreground">
                Plural: <span className="font-medium text-foreground">{entry.plural}</span>
                {entry.pluralTifinagh && (
                  <span className="tifinagh ml-3">{entry.pluralTifinagh}</span>
                )}
              </p>
            )}
          </div>
          {entry.audio ? (
            <AudioPlayer audio={entry.audio} word={entry.word} />
          ) : (
            <AudioPlayer
              src={entry.audioFile ? `/audio/${entry.audioFile}` : undefined}
              word={entry.word}
            />
          )}
        </div>

        {/* Metadata line */}
        <div className="flex flex-wrap gap-4 mb-8 text-xs uppercase tracking-widest text-muted-foreground">
          <span>{entry.partOfSpeech}</span>
          {entry.gender && (
            <>
              <span>·</span>
              <span>{entry.gender}</span>
            </>
          )}
          <span>·</span>
          <span>Tachelhit</span>
          <span>·</span>
          <span>{entry.pronunciation}</span>
          {entry.frequency && (
            <>
              <span>·</span>
              <span>{entry.frequency}</span>
            </>
          )}
        </div>

        {/* Semantic fields */}
        {entry.semanticFields && entry.semanticFields.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12">
            {entry.semanticFields.map(field => (
              <span
                key={field}
                className="text-xs px-3 py-1 border border-foreground/10 capitalize"
              >
                {field}
              </span>
            ))}
          </div>
        )}

        {/* Definitions - multilingual */}
        <DefinitionsSection entry={entry} />

        {/* Etymology */}
        <EtymologySection entry={entry} />

        {/* Morphology */}
        <MorphologySection entry={entry} />

        {/* Regional Distribution Map */}
        <RegionalDistributionSection entry={entry} />

        {/* Examples with source attribution */}
        <ExamplesSection examples={entry.examples as Example[]} />

        {/* Usage Notes */}
        <UsageNotesSection notes={entry.usageNotes as UsageNote[]} />

        {/* Regional Variants */}
        <VariantsSection variants={entry.variants as Variant[]} />

        {/* Cross-references */}
        <CrossReferencesSection crossRefs={entry.crossReferences as CrossReference[]} />
      </article>

      {/* Related by root */}
      <RelatedByRootSection entry={entry} />

      {/* Back Link */}
      <div className="mt-16 text-center">
        <Link href="/" className="nav-link">
          ← Back to Dictionary
        </Link>
      </div>
    </div>
    </>
  );
}
