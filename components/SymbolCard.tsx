import Link from 'next/link';
import { SymbolEntry } from '@/types';
import { formatMedium, formatStatus } from '@/lib/symbols';

interface SymbolCardProps {
  symbol: SymbolEntry;
  showDetails?: boolean;
}

// Status colors
const statusColors: Record<SymbolEntry['status'], string> = {
  'active': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'declining': 'bg-amber-100 text-amber-800 border-amber-200',
  'archaic': 'bg-gray-100 text-gray-600 border-gray-200',
  'reviving': 'bg-blue-100 text-blue-800 border-blue-200',
  'extinct': 'bg-red-100 text-red-800 border-red-200',
};

export default function SymbolCard({ symbol, showDetails = false }: SymbolCardProps) {
  // Get primary meaning from attested usage
  const primaryMeaning = symbol.attestedUsage[0]?.meaning ||
    symbol.oralInterpretations[0]?.meaning || '';

  // Truncate meaning for card display
  const truncatedMeaning = primaryMeaning.length > 120
    ? primaryMeaning.slice(0, 120) + '...'
    : primaryMeaning;

  return (
    <Link href={`/symbols/${symbol.id}`}>
      <article className="card hover:border-foreground/30 transition-colors cursor-pointer group h-full">
        <div className="flex flex-col h-full">
          {/* Symbol visual */}
          <div className="flex items-center justify-center h-24 mb-4 bg-muted/30 border border-foreground/5">
            {symbol.visual.svgPath ? (
              <svg
                viewBox="0 0 24 24"
                className="w-12 h-12 text-foreground"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d={symbol.visual.svgPath} />
              </svg>
            ) : (
              <span className="tifinagh text-4xl">{symbol.nameTifinagh || '◇'}</span>
            )}
          </div>

          {/* Name */}
          <div className="mb-3">
            {symbol.nameTifinagh && (
              <span className="tifinagh text-xl block mb-1">{symbol.nameTifinagh}</span>
            )}
            <h3 className="font-serif text-lg capitalize">{symbol.name}</h3>
            {symbol.nameEnglish && symbol.nameEnglish !== symbol.name && (
              <p className="text-sm text-muted-foreground">{symbol.nameEnglish}</p>
            )}
          </div>

          {/* Category and status */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs px-2 py-0.5 border border-foreground/10 text-muted-foreground capitalize">
              {symbol.category}
            </span>
            <span className={`text-xs px-2 py-0.5 border ${statusColors[symbol.status]}`}>
              {formatStatus(symbol.status)}
            </span>
          </div>

          {/* Primary meaning */}
          <p className="text-sm text-muted-foreground flex-1 mb-3">
            {truncatedMeaning}
          </p>

          {/* Media tags */}
          {showDetails && (
            <div className="flex flex-wrap gap-1 mt-auto pt-3 border-t border-foreground/5">
              {symbol.media.slice(0, 3).map(medium => (
                <span
                  key={medium}
                  className="text-[10px] px-1.5 py-0.5 bg-foreground/5 text-muted-foreground"
                >
                  {formatMedium(medium)}
                </span>
              ))}
              {symbol.media.length > 3 && (
                <span className="text-[10px] px-1.5 py-0.5 text-muted-foreground">
                  +{symbol.media.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Arrow indicator */}
          <div className="flex justify-end mt-3">
            <svg
              className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  );
}

// Compact version for lists
export function SymbolCardCompact({ symbol }: { symbol: SymbolEntry }) {
  return (
    <Link href={`/symbols/${symbol.id}`}>
      <div className="flex items-center gap-4 p-3 border border-foreground/10 hover:border-foreground/30 transition-colors">
        {/* Symbol visual */}
        <div className="flex items-center justify-center w-12 h-12 bg-muted/30 flex-shrink-0">
          {symbol.visual.svgPath ? (
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 text-foreground"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d={symbol.visual.svgPath} />
            </svg>
          ) : (
            <span className="tifinagh text-xl">{symbol.nameTifinagh || '◇'}</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {symbol.nameTifinagh && (
              <span className="tifinagh">{symbol.nameTifinagh}</span>
            )}
            <h3 className="font-serif capitalize truncate">{symbol.name}</h3>
          </div>
          <p className="text-xs text-muted-foreground capitalize">
            {symbol.category} · {formatStatus(symbol.status)}
          </p>
        </div>

        {/* Arrow */}
        <svg
          className="w-4 h-4 text-muted-foreground flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
