import Link from 'next/link';
import { DictionaryEntry } from '@/types';

interface WordCardProps {
  entry: DictionaryEntry;
  showAllLanguages?: boolean;
}

export default function WordCard({ entry, showAllLanguages = false }: WordCardProps) {
  const enDef = entry.definitions.find(d => d.language === 'en');
  const frDef = entry.definitions.find(d => d.language === 'fr');
  const arDef = entry.definitions.find(d => d.language === 'ar');

  return (
    <Link href={`/dictionary/${encodeURIComponent(entry.word)}`}>
      <article className="card hover:border-foreground/30 transition-colors cursor-pointer group">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <span className="tifinagh text-3xl">
                {entry.tifinagh}
              </span>
              <h3 className="font-serif text-2xl">{entry.word}</h3>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
              <span className="uppercase tracking-widest">
                {entry.partOfSpeech}
              </span>
              {entry.gender && (
                <>
                  <span>·</span>
                  <span>{entry.gender === 'masculine' ? 'masc.' : 'fem.'}</span>
                </>
              )}
              <span>·</span>
              <span>{entry.pronunciation}</span>
              {entry.frequency && (
                <>
                  <span>·</span>
                  <span>{entry.frequency}</span>
                </>
              )}
            </div>

            {/* Definitions */}
            <div className="space-y-1">
              {enDef && <p className="text-sm">{enDef.meaning}</p>}
              {frDef && (
                <p className="text-sm text-muted-foreground italic">{frDef.meaning}</p>
              )}
              {showAllLanguages && arDef && (
                <p className="text-sm text-muted-foreground" dir="rtl">{arDef.meaning}</p>
              )}
            </div>

            {/* Semantic fields */}
            {entry.semanticFields && entry.semanticFields.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {entry.semanticFields.slice(0, 3).map(field => (
                  <span
                    key={field}
                    className="text-xs px-2 py-0.5 border border-foreground/10 text-muted-foreground capitalize"
                  >
                    {field}
                  </span>
                ))}
              </div>
            )}
          </div>

          <svg
            className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0 mt-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </article>
    </Link>
  );
}
