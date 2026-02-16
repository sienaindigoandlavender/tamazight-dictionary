import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import regionsData from '@/data/regions.json';
import { getAllEntries } from '@/lib/dictionary';
import { RegionInfo } from '@/types';

// Dynamic import to avoid SSR issues with Mapbox
const LanguageMap = dynamic(() => import('@/components/LanguageMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted/10">
      <div className="text-center">
        <div className="tifinagh text-4xl mb-4 animate-pulse">ⵜⴰⵎⴰⵣⵉⵖⵜ</div>
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
  ),
});

export const metadata: Metadata = {
  title: 'Linguistic Atlas - Amawal Tamazight Dictionary',
  description: 'Explore the geographic distribution of Tamazight languages across North Africa. Interactive map showing Tachelhit, Kabyle, Tarifit, Central Atlas, Tuareg, and more.',
};

export default function MapPage() {
  const regions = regionsData.regions as RegionInfo[];
  const entries = getAllEntries('tachelhit');

  // Get statistics
  const totalSpeakers = regions.reduce((sum, r) => sum + r.speakersNumeric, 0);
  const activeRegions = regions.filter(r => r.status === 'active').length;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-foreground/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <Link href="/" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
              ← Dictionary
            </Link>
            <h1 className="font-serif text-2xl mt-1">Linguistic Atlas</h1>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <p><span className="text-foreground font-medium">{regions.length}</span> dialect regions</p>
            <p><span className="text-foreground font-medium">{(totalSpeakers / 1000000).toFixed(0)}M+</span> speakers</p>
          </div>
        </div>
      </header>

      {/* Map Container */}
      <div className="flex-1 relative min-h-[400px] h-[50vh]">
        <LanguageMap regions={regions} entries={entries} />
      </div>

      {/* Bottom Panel - Region Overview */}
      <div className="border-t border-foreground/10 bg-background">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between gap-8 mb-8">
            <div>
              <h2 className="section-subtitle mb-2">The Tamazight Continuum</h2>
              <p className="text-sm text-muted-foreground max-w-2xl">
                {regionsData.dialectContinuum.description}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Available</p>
              <p className="text-2xl font-serif">{activeRegions} of {regions.length}</p>
            </div>
          </div>

          {/* Region Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {regions.map(region => (
              <Link
                key={region.id}
                href={region.status === 'active' ? `/map/${region.id}` : '#'}
                className={`border border-foreground/10 p-4 transition-all ${
                  region.status === 'active'
                    ? 'hover:border-foreground/30 cursor-pointer'
                    : 'opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="tifinagh text-lg">{region.nameTifinagh}</span>
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                    style={{ backgroundColor: region.color }}
                  />
                </div>
                <h3 className="font-serif text-lg mb-1">{region.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{region.countries.join(', ')}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{region.speakers}</span>
                  {region.status === 'active' ? (
                    <span className="text-green-700">Explore</span>
                  ) : (
                    <span className="text-muted-foreground">Coming soon</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
