import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import regionsData from '@/data/regions.json';
import { getAllEntries } from '@/lib/dictionary';
import { RegionInfo, DictionaryEntry, Region } from '@/types';
import WordCard from '@/components/WordCard';

// Dynamic import for the mini map
const LanguageMap = dynamic(() => import('@/components/LanguageMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted/10 animate-pulse" />,
});

interface PageProps {
  params: Promise<{ region: string }>;
}

export async function generateStaticParams() {
  return regionsData.regions
    .filter(r => r.status === 'active')
    .map(region => ({
      region: region.id,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region: regionId } = await params;
  const region = regionsData.regions.find(r => r.id === regionId) as RegionInfo | undefined;

  if (!region) {
    return { title: 'Region Not Found - Amawal' };
  }

  return {
    title: `${region.name} (${region.nameTifinagh}) - Amawal Linguistic Atlas`,
    description: `Explore ${region.name} Tamazight: ${region.speakers} speakers in ${region.countries.join(', ')}. ${region.description}`,
  };
}

// Component to display word variations across regions
function WordVariationCard({ entry, allRegions }: { entry: DictionaryEntry; allRegions: RegionInfo[] }) {
  const hasVariants = entry.variants && entry.variants.length > 0;
  const hasCognates = entry.etymology?.cognates && entry.etymology.cognates.length > 0;

  if (!hasVariants && !hasCognates) {
    return null;
  }

  // Combine variants and cognates for display
  const variations: { region: string; word: string; tifinagh: string; notes?: string }[] = [];

  if (entry.variants) {
    entry.variants.forEach(v => {
      variations.push({
        region: v.region,
        word: v.word,
        tifinagh: v.tifinagh,
        notes: v.notes,
      });
    });
  }

  if (entry.etymology?.cognates) {
    entry.etymology.cognates.forEach(c => {
      if (!variations.find(v => v.region === c.region)) {
        variations.push({
          region: c.region,
          word: c.word,
          tifinagh: c.tifinagh,
        });
      }
    });
  }

  const getRegionColor = (regionId: string) => {
    const region = allRegions.find(r => r.id === regionId);
    return region?.color || '#737373';
  };

  const getRegionName = (regionId: string) => {
    const region = allRegions.find(r => r.id === regionId);
    return region?.name || regionId;
  };

  return (
    <div className="border border-foreground/10 p-4">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="tifinagh text-2xl">{entry.tifinagh}</span>
            <span className="font-serif text-xl">{entry.word}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {entry.definitions.find(d => d.language === 'en')?.meaning}
          </p>
        </div>
        <Link
          href={`/dictionary/${encodeURIComponent(entry.word)}`}
          className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
        >
          View entry
        </Link>
      </div>

      {/* Variations across regions */}
      <div className="border-t border-foreground/10 pt-4">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Across Dialects
        </p>
        <div className="flex flex-wrap gap-2">
          {/* Current region */}
          <div className="flex items-center gap-2 px-3 py-1.5 border border-foreground/20 bg-foreground/5">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: getRegionColor(entry.region) }}
            />
            <span className="text-xs text-muted-foreground">{getRegionName(entry.region)}:</span>
            <span className="tifinagh text-sm">{entry.tifinagh}</span>
            <span className="text-sm">{entry.word}</span>
          </div>

          {/* Variations */}
          {variations.map((v, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-1.5 border border-foreground/10"
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: getRegionColor(v.region) }}
              />
              <span className="text-xs text-muted-foreground">{getRegionName(v.region)}:</span>
              <span className="tifinagh text-sm">{v.tifinagh}</span>
              <span className="text-sm">{v.word}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function RegionPage({ params }: PageProps) {
  const { region: regionId } = await params;
  const region = regionsData.regions.find(r => r.id === regionId) as RegionInfo | undefined;
  const allRegions = regionsData.regions as RegionInfo[];

  if (!region || region.status !== 'active') {
    notFound();
  }

  const entries = getAllEntries(regionId as Region);

  // Group entries by semantic field
  const entriesByField: Record<string, DictionaryEntry[]> = {};
  entries.forEach(entry => {
    if (entry.semanticFields) {
      entry.semanticFields.forEach(field => {
        if (!entriesByField[field]) entriesByField[field] = [];
        if (!entriesByField[field].find(e => e.id === entry.id)) {
          entriesByField[field].push(entry);
        }
      });
    }
  });

  // Get entries with regional variations
  const entriesWithVariations = entries.filter(
    e => (e.variants && e.variants.length > 0) || (e.etymology?.cognates && e.etymology.cognates.length > 0)
  );

  return (
    <div className="min-h-screen">
      {/* Header with mini map */}
      <header className="border-b border-foreground/10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Region info */}
            <div className="flex-1">
              <Link
                href="/map"
                className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors inline-block mb-4"
              >
                ← Linguistic Atlas
              </Link>

              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-4 h-4 rounded-full mt-2 flex-shrink-0"
                  style={{ backgroundColor: region.color }}
                />
                <div>
                  <span className="tifinagh text-4xl block mb-2">{region.nameTifinagh}</span>
                  <h1 className="font-serif text-4xl md:text-5xl">{region.name}</h1>
                  <p className="text-muted-foreground mt-2">{region.nameNative}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 text-sm mb-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground block">Speakers</span>
                  <span className="font-medium">{region.speakers}</span>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground block">Countries</span>
                  <span className="font-medium">{region.countries.join(', ')}</span>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground block">Words</span>
                  <span className="font-medium">{entries.length} entries</span>
                </div>
              </div>

              <p className="text-muted-foreground max-w-2xl">{region.description}</p>
            </div>

            {/* Mini map */}
            <div className="w-full lg:w-80 h-48 lg:h-auto border border-foreground/10 relative overflow-hidden">
              <LanguageMap
                regions={allRegions}
                selectedRegion={regionId}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Linguistic Characteristics */}
        {region.characteristics && (
          <section className="mb-16">
            <h2 className="section-subtitle mb-6">Linguistic Characteristics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-foreground/10 p-4">
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Phonology</h3>
                <p className="text-sm">{region.characteristics.phonology}</p>
              </div>
              <div className="border border-foreground/10 p-4">
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Grammar</h3>
                <p className="text-sm">{region.characteristics.grammar}</p>
              </div>
              <div className="border border-foreground/10 p-4">
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Vocabulary</h3>
                <p className="text-sm">{region.characteristics.vocabulary}</p>
              </div>
              <div className="border border-foreground/10 p-4">
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Writing System</h3>
                <p className="text-sm">{region.characteristics.writingSystem}</p>
              </div>
            </div>
          </section>
        )}

        {/* Sub-regions */}
        {region.subRegions && region.subRegions.length > 0 && (
          <section className="mb-16">
            <h2 className="section-subtitle mb-6">Sub-Regions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {region.subRegions.map((sub, i) => (
                <div key={i} className="border border-foreground/10 p-4">
                  <h3 className="font-serif text-lg mb-1">{sub.name}</h3>
                  {sub.notes && (
                    <p className="text-sm text-muted-foreground">{sub.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Word Variations - The Heart of the Linguistic Atlas */}
        {entriesWithVariations.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-subtitle">Words Across Dialects</h2>
              <span className="text-xs text-muted-foreground">
                {entriesWithVariations.length} words with regional data
              </span>
            </div>
            <div className="grid gap-4">
              {entriesWithVariations.slice(0, 10).map(entry => (
                <WordVariationCard
                  key={entry.id}
                  entry={entry}
                  allRegions={allRegions}
                />
              ))}
            </div>
            {entriesWithVariations.length > 10 && (
              <p className="text-center text-sm text-muted-foreground mt-6">
                Showing 10 of {entriesWithVariations.length} words with variations
              </p>
            )}
          </section>
        )}

        {/* Cultural Notes */}
        {region.culturalNotes && region.culturalNotes.length > 0 && (
          <section className="mb-16">
            <h2 className="section-subtitle mb-6">Cultural Context</h2>
            <div className="border-l border-foreground/20 pl-6 space-y-3">
              {region.culturalNotes.map((note, i) => (
                <p key={i} className="text-sm">{note}</p>
              ))}
            </div>
          </section>
        )}

        {/* Browse by Semantic Field */}
        {Object.keys(entriesByField).length > 0 && (
          <section className="mb-16">
            <h2 className="section-subtitle mb-6">Browse by Category</h2>
            <div className="flex flex-wrap gap-2 mb-8">
              {Object.entries(entriesByField)
                .sort((a, b) => b[1].length - a[1].length)
                .map(([field, fieldEntries]) => (
                  <span
                    key={field}
                    className="px-3 py-1 border border-foreground/10 text-sm capitalize"
                  >
                    {field} ({fieldEntries.length})
                  </span>
                ))}
            </div>
          </section>
        )}

        {/* All Words */}
        <section>
          <h2 className="section-subtitle mb-6">All {region.name} Words</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {entries.map(entry => (
              <WordCard key={entry.id} entry={entry} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
