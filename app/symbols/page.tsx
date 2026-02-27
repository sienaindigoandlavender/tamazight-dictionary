import { Metadata } from 'next';
import Link from 'next/link';
import { getAllSymbols, getAvailableCategories, getAvailableMedia, formatCategory, formatMedium, getSymbolsMetadata } from '@/lib/symbols';
import SymbolCard from '@/components/SymbolCard';

export const metadata: Metadata = {
  alternates: { canonical: 'https://amazigh.online/symbols' },
  title: 'Symbol Dictionary - Amawal',
  description: 'Explore Amazigh visual symbols - geometric patterns, tattoos, weaving motifs, and their meanings across Berber cultures.',
};

export default function SymbolsPage() {
  const symbols = getAllSymbols();
  const categories = getAvailableCategories();
  const media = getAvailableMedia();
  const metadata = getSymbolsMetadata();

  // Group symbols by category
  const symbolsByCategory = categories.reduce((acc, cat) => {
    acc[cat] = symbols.filter(s => s.category === cat);
    return acc;
  }, {} as Record<string, typeof symbols>);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Header */}
      <header className="mb-16">
        <nav className="mb-8 text-xs uppercase tracking-widest text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Dictionary</Link>
          <span className="mx-3">/</span>
          <span className="text-foreground">Symbols</span>
        </nav>

        <div className="max-w-3xl">
          <h1 className="font-serif text-4xl md:text-5xl mb-6">
            <span className="tifinagh block text-3xl mb-2">ⵉⵣⵎⴰⵣ</span>
            Symbol Dictionary
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Amazigh visual language — geometric patterns, tattoos, weaving motifs, and signs
            that communicate where words stop. Each symbol anchored in region, medium, and context.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>{metadata.totalSymbols} symbols documented</span>
            <span>·</span>
            <span>{categories.length} categories</span>
            <span>·</span>
            <span>{media.length} media types</span>
          </div>
        </div>
      </header>

      {/* Interpretation layers explanation */}
      <section className="mb-16 p-6 border border-foreground/10 bg-muted/5">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">How to Read These Entries</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">A</span>
              Attested Usage
            </h3>
            <p className="text-sm text-muted-foreground">
              What is documented — academic sources, fieldwork, museum collections. Regionally grounded.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold">B</span>
              Oral Interpretation
            </h3>
            <p className="text-sm text-muted-foreground">
              What people say it means — often multiple, sometimes contradictory. Living knowledge.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">C</span>
              Contemporary Reading
            </h3>
            <p className="text-sm text-muted-foreground">
              How modern artists, communities, and movements reinterpret today. Evolution in progress.
            </p>
          </div>
        </div>
      </section>

      {/* Quick filters */}
      <section className="mb-12">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Browse by Medium</h2>
        <div className="flex flex-wrap gap-2">
          {media.map(m => (
            <span
              key={m}
              className="text-sm px-3 py-1 border border-foreground/10 hover:border-foreground/30 transition-colors cursor-pointer"
            >
              {formatMedium(m)}
            </span>
          ))}
        </div>
      </section>

      {/* Symbols by category */}
      {categories.map(category => {
        const categorySymbols = symbolsByCategory[category];
        if (categorySymbols.length === 0) return null;

        return (
          <section key={category} className="mb-16">
            <h2 className="section-subtitle mb-6">{formatCategory(category)}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categorySymbols.map(symbol => (
                <SymbolCard key={symbol.id} symbol={symbol} showDetails />
              ))}
            </div>
          </section>
        );
      })}

      {/* Footer note */}
      <footer className="mt-16 pt-8 border-t border-foreground/10">
        <p className="text-sm text-muted-foreground max-w-2xl">
          This collection prioritizes rigor over completeness. Each symbol is anchored in documented
          sources with clear regional attribution. Meanings are presented as layers, not absolutes.
          The goal is clarity, not mystification.
        </p>
        <p className="text-xs text-muted-foreground mt-4">
          Last updated: {metadata.lastUpdated}
        </p>
      </footer>
    </div>
  );
}
