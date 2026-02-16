import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  getSymbolById,
  getAllSymbols,
  getRelatedSymbols,
  formatMedium,
  formatContext,
  formatCategory,
  formatStatus
} from '@/lib/symbols';
import { SymbolEntry, AttestedMeaning, OralMeaning, ModernMeaning, Region } from '@/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Region labels
const regionLabels: Record<Region, string> = {
  'tachelhit': 'Tachelhit',
  'kabyle': 'Kabyle',
  'tarifit': 'Tarifit',
  'central-atlas': 'Central Atlas',
  'tuareg': 'Tuareg',
  'zenaga': 'Zenaga',
  'ghomara': 'Ghomara',
};

// Status colors
const statusColors: Record<SymbolEntry['status'], string> = {
  'active': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'declining': 'bg-amber-100 text-amber-800 border-amber-200',
  'archaic': 'bg-gray-100 text-gray-600 border-gray-200',
  'reviving': 'bg-blue-100 text-blue-800 border-blue-200',
  'extinct': 'bg-red-100 text-red-800 border-red-200',
};

export async function generateStaticParams() {
  const symbols = getAllSymbols();
  return symbols.map(symbol => ({ id: symbol.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const symbol = getSymbolById(id);

  if (!symbol) {
    return { title: 'Symbol Not Found - Amawal' };
  }

  const meaning = symbol.attestedUsage[0]?.meaning || '';

  return {
    title: `${symbol.name} ${symbol.nameTifinagh ? `(${symbol.nameTifinagh})` : ''} - Symbol Dictionary - Amawal`,
    description: `${symbol.nameEnglish || symbol.name}: ${meaning.slice(0, 150)}...`,
  };
}

// Section component
function Section({ title, children, badge }: { title: string; children: React.ReactNode; badge?: React.ReactNode }) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        {badge}
        <h2 className="section-subtitle">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// Layer badge
function LayerBadge({ layer }: { layer: 'A' | 'B' | 'C' }) {
  const colors = {
    'A': 'bg-emerald-100 text-emerald-800',
    'B': 'bg-blue-100 text-blue-800',
    'C': 'bg-amber-100 text-amber-800',
  };

  return (
    <span className={`w-6 h-6 rounded-full ${colors[layer]} flex items-center justify-center text-xs font-bold flex-shrink-0`}>
      {layer}
    </span>
  );
}

// Attested meaning component
function AttestedMeaningCard({ meaning }: { meaning: AttestedMeaning }) {
  return (
    <div className="border-l-2 border-emerald-300 pl-6 py-4">
      <p className="text-lg mb-3">{meaning.meaning}</p>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className="text-xs px-2 py-0.5 bg-foreground/5">
          {regionLabels[meaning.region]}
        </span>
        {meaning.subRegion && (
          <span className="text-xs px-2 py-0.5 bg-foreground/5 capitalize">
            {meaning.subRegion.replace(/-/g, ' ')}
          </span>
        )}
        {meaning.medium.map(m => (
          <span key={m} className="text-xs px-2 py-0.5 border border-foreground/10 text-muted-foreground">
            {formatMedium(m)}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {meaning.context.map(c => (
          <span key={c} className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200">
            {formatContext(c)}
          </span>
        ))}
      </div>

      <div className="text-sm text-muted-foreground">
        <p className="mb-1">
          <span className="text-xs uppercase tracking-widest mr-2">Source:</span>
          {meaning.source}
        </p>
        <p className="text-xs">
          {meaning.sourceType} · {meaning.confidence} confidence
        </p>
      </div>

      {meaning.notes && (
        <p className="text-sm text-muted-foreground italic mt-3 border-t border-foreground/5 pt-3">
          {meaning.notes}
        </p>
      )}
    </div>
  );
}

// Oral meaning component
function OralMeaningCard({ meaning }: { meaning: OralMeaning }) {
  return (
    <div className="border-l-2 border-blue-300 pl-6 py-4">
      <p className="text-lg mb-3 italic">&ldquo;{meaning.meaning}&rdquo;</p>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className="text-xs px-2 py-0.5 bg-foreground/5">
          {regionLabels[meaning.region]}
        </span>
        {meaning.subRegion && (
          <span className="text-xs px-2 py-0.5 bg-foreground/5 capitalize">
            {meaning.subRegion.replace(/-/g, ' ')}
          </span>
        )}
      </div>

      {meaning.speakerContext && (
        <p className="text-sm text-muted-foreground mb-2">
          — {meaning.speakerContext}
          {meaning.collectedIn && `, ${meaning.collectedIn}`}
          {meaning.collectedAt && ` (${meaning.collectedAt})`}
        </p>
      )}

      {meaning.contradicts && (
        <p className="text-xs text-amber-600 mt-2">
          Note: {meaning.contradicts}
        </p>
      )}

      {meaning.notes && (
        <p className="text-sm text-muted-foreground italic mt-2">{meaning.notes}</p>
      )}
    </div>
  );
}

// Modern meaning component
function ModernMeaningCard({ meaning }: { meaning: ModernMeaning }) {
  return (
    <div className="border-l-2 border-amber-300 pl-6 py-4">
      <p className="text-lg mb-3">{meaning.meaning}</p>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 capitalize">
          {meaning.interpreterType.replace(/-/g, ' ')}
        </span>
        {meaning.year && (
          <span className="text-xs px-2 py-0.5 bg-foreground/5">
            {meaning.year}
          </span>
        )}
      </div>

      <p className="text-sm text-muted-foreground mb-2">
        <span className="text-xs uppercase tracking-widest mr-2">By:</span>
        {meaning.interpreter}
      </p>

      <p className="text-sm text-muted-foreground">
        <span className="text-xs uppercase tracking-widest mr-2">Context:</span>
        {meaning.context}
      </p>

      {meaning.url && (
        <a
          href={meaning.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-foreground hover:underline mt-2 inline-block"
        >
          View source →
        </a>
      )}
    </div>
  );
}

// Linked words section
function LinkedWordsSection({ symbol }: { symbol: SymbolEntry }) {
  if (!symbol.linkedWords?.length && !symbol.linkedRoots?.length && !symbol.linkedPhrases?.length) {
    return null;
  }

  return (
    <Section title="Language Connections">
      {/* Linked words */}
      {symbol.linkedWords && symbol.linkedWords.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Linked Words</h3>
          <div className="space-y-2">
            {symbol.linkedWords.map((link, i) => (
              <Link
                key={i}
                href={`/dictionary/${encodeURIComponent(link.word)}`}
                className="flex items-center gap-4 p-3 border border-foreground/10 hover:border-foreground/30 transition-colors"
              >
                <span className="tifinagh text-xl">{link.tifinagh}</span>
                <span className="font-serif">{link.word}</span>
                <span className="text-xs px-2 py-0.5 bg-foreground/5 text-muted-foreground capitalize">
                  {link.relationship.replace(/-/g, ' ')}
                </span>
                {link.notes && (
                  <span className="text-sm text-muted-foreground flex-1">{link.notes}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Linked roots */}
      {symbol.linkedRoots && symbol.linkedRoots.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Related Roots</h3>
          <div className="space-y-2">
            {symbol.linkedRoots.map((root, i) => (
              <div key={i} className="p-3 border border-foreground/10">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono">{root.root}</span>
                  {root.rootTifinagh && (
                    <span className="tifinagh">{root.rootTifinagh}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{root.meaning}</p>
                {root.notes && (
                  <p className="text-xs text-muted-foreground italic mt-1">{root.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Linked phrases */}
      {symbol.linkedPhrases && symbol.linkedPhrases.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Associated Phrases</h3>
          <div className="space-y-3">
            {symbol.linkedPhrases.map((phrase, i) => (
              <div key={i} className="p-4 border border-foreground/10 bg-muted/5">
                <p className="tifinagh text-lg mb-1">{phrase.phraseTifinagh}</p>
                <p className="font-serif mb-2">{phrase.phrase}</p>
                <p className="text-sm text-muted-foreground italic">&ldquo;{phrase.meaning}&rdquo;</p>
                {phrase.context && (
                  <p className="text-xs text-muted-foreground mt-2">{phrase.context}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}

export default async function SymbolPage({ params }: PageProps) {
  const { id } = await params;
  const symbol = getSymbolById(id);

  if (!symbol) {
    notFound();
  }

  const relatedSymbols = getRelatedSymbols(symbol);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Breadcrumb */}
      <nav className="mb-12 text-xs uppercase tracking-widest text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Dictionary</Link>
        <span className="mx-3">/</span>
        <Link href="/symbols" className="hover:text-foreground transition-colors">Symbols</Link>
        <span className="mx-3">/</span>
        <span className="text-foreground capitalize">{symbol.name}</span>
      </nav>

      {/* Header */}
      <header className="mb-16">
        <div className="flex items-start gap-8 mb-8">
          {/* Symbol visual */}
          <div className="flex items-center justify-center w-32 h-32 bg-muted/30 border border-foreground/10 flex-shrink-0">
            {symbol.visual.svgPath ? (
              <svg
                viewBox="0 0 24 24"
                className="w-16 h-16 text-foreground"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d={symbol.visual.svgPath} />
              </svg>
            ) : (
              <span className="tifinagh text-5xl">{symbol.nameTifinagh || '◇'}</span>
            )}
          </div>

          {/* Name and basic info */}
          <div>
            {symbol.nameTifinagh && (
              <span className="tifinagh text-4xl block mb-2">{symbol.nameTifinagh}</span>
            )}
            <h1 className="font-serif text-4xl mb-2 capitalize">{symbol.name}</h1>
            {symbol.nameEnglish && symbol.nameEnglish !== symbol.name && (
              <p className="text-lg text-muted-foreground mb-2">{symbol.nameEnglish}</p>
            )}
            {symbol.alternateNames && symbol.alternateNames.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Also: {symbol.alternateNames.join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="text-xs px-3 py-1 border border-foreground/10 capitalize">
            {formatCategory(symbol.category)}
          </span>
          <span className={`text-xs px-3 py-1 border ${statusColors[symbol.status]}`}>
            {formatStatus(symbol.status)}
          </span>
          <span className="text-xs px-3 py-1 border border-foreground/10">
            {regionLabels[symbol.primaryRegion]}
          </span>
          {symbol.confidence && (
            <span className="text-xs px-3 py-1 bg-foreground/5 text-muted-foreground">
              {symbol.confidence} confidence
            </span>
          )}
        </div>

        {/* Media and contexts */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs text-muted-foreground uppercase tracking-widest mr-2">Found in:</span>
          {symbol.media.map(m => (
            <span key={m} className="text-xs px-2 py-0.5 bg-foreground/5">
              {formatMedium(m)}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground uppercase tracking-widest mr-2">Context:</span>
          {symbol.contexts.map(c => (
            <span key={c} className="text-xs px-2 py-0.5 border border-foreground/10">
              {formatContext(c)}
            </span>
          ))}
        </div>
      </header>

      {/* Layer A: Attested Usage */}
      {symbol.attestedUsage.length > 0 && (
        <Section title="Attested Usage" badge={<LayerBadge layer="A" />}>
          <p className="text-sm text-muted-foreground mb-6">
            What is documented — academic sources, fieldwork, museum collections
          </p>
          <div className="space-y-4">
            {symbol.attestedUsage.map((meaning, i) => (
              <AttestedMeaningCard key={i} meaning={meaning} />
            ))}
          </div>
        </Section>
      )}

      {/* Layer B: Oral Interpretations */}
      {symbol.oralInterpretations.length > 0 && (
        <Section title="Oral Interpretations" badge={<LayerBadge layer="B" />}>
          <p className="text-sm text-muted-foreground mb-6">
            What people say it means — often multiple, sometimes contradictory
          </p>
          <div className="space-y-4">
            {symbol.oralInterpretations.map((meaning, i) => (
              <OralMeaningCard key={i} meaning={meaning} />
            ))}
          </div>
        </Section>
      )}

      {/* Layer C: Contemporary Readings */}
      {symbol.contemporaryReadings && symbol.contemporaryReadings.length > 0 && (
        <Section title="Contemporary Readings" badge={<LayerBadge layer="C" />}>
          <p className="text-sm text-muted-foreground mb-6">
            How modern artists, communities, and movements reinterpret today
          </p>
          <div className="space-y-4">
            {symbol.contemporaryReadings.map((meaning, i) => (
              <ModernMeaningCard key={i} meaning={meaning} />
            ))}
          </div>
        </Section>
      )}

      {/* Language connections */}
      <LinkedWordsSection symbol={symbol} />

      {/* Ritual use and taboos */}
      {(symbol.ritualUse || symbol.taboos) && (
        <Section title="Usage Notes">
          {symbol.ritualUse && (
            <div className="mb-4 p-4 border border-foreground/10">
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Ritual Use</h3>
              <p className="text-sm">{symbol.ritualUse}</p>
            </div>
          )}
          {symbol.taboos && (
            <div className="p-4 border border-amber-200 bg-amber-50">
              <h3 className="text-xs uppercase tracking-widest text-amber-700 mb-2">Note</h3>
              <p className="text-sm text-amber-800">{symbol.taboos}</p>
            </div>
          )}
        </Section>
      )}

      {/* Historical notes */}
      {(symbol.historicalNotes || symbol.archaeologicalEvidence) && (
        <Section title="Historical Context">
          {symbol.attestedSince && (
            <p className="text-sm mb-3">
              <span className="text-xs uppercase tracking-widest text-muted-foreground mr-2">Attested since:</span>
              <span className="capitalize">{symbol.attestedSince}</span>
            </p>
          )}
          {symbol.historicalNotes && (
            <p className="text-sm text-muted-foreground mb-3">{symbol.historicalNotes}</p>
          )}
          {symbol.archaeologicalEvidence && (
            <p className="text-sm text-muted-foreground">
              <span className="text-xs uppercase tracking-widest mr-2">Archaeological evidence:</span>
              {symbol.archaeologicalEvidence}
            </p>
          )}
        </Section>
      )}

      {/* Related symbols */}
      {relatedSymbols.length > 0 && (
        <Section title="Related Symbols">
          <div className="grid sm:grid-cols-2 gap-4">
            {relatedSymbols.map(related => {
              const relationship = symbol.relatedSymbols?.find(r => r.symbolId === related.id);
              return (
                <Link
                  key={related.id}
                  href={`/symbols/${related.id}`}
                  className="flex items-center gap-4 p-4 border border-foreground/10 hover:border-foreground/30 transition-colors"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-muted/30 flex-shrink-0">
                    {related.visual.svgPath ? (
                      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d={related.visual.svgPath} />
                      </svg>
                    ) : (
                      <span className="tifinagh">{related.nameTifinagh || '◇'}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-serif capitalize">{related.name}</p>
                    {relationship && (
                      <p className="text-xs text-muted-foreground capitalize">
                        {relationship.relationship.replace(/-/g, ' ')}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </Section>
      )}

      {/* Sources */}
      <section className="border-t border-foreground/10 pt-8 mt-12">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Sources</h2>
        <ul className="text-sm text-muted-foreground space-y-1">
          {symbol.sources.map((source, i) => (
            <li key={i}>{source}</li>
          ))}
        </ul>
        {symbol.lastUpdated && (
          <p className="text-xs text-muted-foreground mt-4">Last updated: {symbol.lastUpdated}</p>
        )}
      </section>

      {/* Back link */}
      <div className="mt-16 text-center">
        <Link href="/symbols" className="nav-link">← Back to Symbol Dictionary</Link>
      </div>
    </div>
  );
}
