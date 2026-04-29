import Link from 'next/link';
import regionsData from '@/data/regions.json';

interface RegionInfo {
  id: string;
  name: string;
  nameTifinagh?: string;
  speakers: string;
  status?: string;
  color: string;
  country?: string;
  countries?: string[];
  description?: string;
}

/**
 * Map preview just above the footer. Lists all 7 Berber varieties, grouped
 * Morocco-first then beyond, with status badges. Pan-Berber roadmap visible,
 * Tachelhit-today honest. Static (no Mapbox bundle on home).
 */
export default function MapPreview() {
  const regions = regionsData.regions as RegionInfo[];
  const isMorocco = (r: RegionInfo) => (r.countries || [r.country]).includes('Morocco');
  const moroccan = regions.filter(isMorocco);
  const beyond = regions.filter(r => !isMorocco(r));

  const renderRow = (r: RegionInfo) => {
    const isLive = r.status === 'active' || !r.status;
    return (
      <li key={r.id}>
        <Link
          href={`/map/${r.id}`}
          className="group flex items-baseline gap-4 py-3 border-b border-neutral-100 dark:border-white/10 hover:border-foreground transition-colors"
        >
          <span
            aria-hidden="true"
            className="w-3 h-3 rounded-full shrink-0 mt-1.5"
            style={{ backgroundColor: r.color }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="font-display text-lg md:text-xl group-hover:text-[#c53a1a] transition-colors">
                {r.name}
              </span>
              {r.nameTifinagh && (
                <span className="tifinagh text-base text-[#c53a1a]">{r.nameTifinagh}</span>
              )}
              {!isLive && (
                <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 border border-neutral-200 dark:border-white/15 px-1.5 py-0.5">
                  Soon
                </span>
              )}
            </div>
          </div>
          <span className="text-xs text-neutral-500 shrink-0 text-right">
            {r.speakers}
          </span>
        </Link>
      </li>
    );
  };

  return (
    <section
      className="border-t border-neutral-100 dark:border-white/10 px-6 md:px-[8%] lg:px-[12%] py-14 md:py-24"
      aria-labelledby="map-preview-heading"
    >
      <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
        <div className="md:col-span-5">
          <p className="text-[#c53a1a] text-[11px] font-medium uppercase tracking-[0.3em] mb-4">
            Linguistic atlas
          </p>
          <h2
            id="map-preview-heading"
            className="font-display text-3xl md:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-6"
          >
            Where it&rsquo;s<br />spoken
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-8 max-w-md">
            Tamazight isn&rsquo;t one language — it&rsquo;s a family. {regions.length} varieties stretch from the Atlantic coast to the Siwa oasis, each with its own rhythm and script tradition. We start with Tachelhit and grow outward.
          </p>
          <Link
            href="/map"
            className="inline-block px-6 py-3 bg-foreground text-background text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Open the atlas →
          </Link>
        </div>

        <div className="md:col-span-7 md:col-start-7 space-y-8">
          {moroccan.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 mb-3">Morocco</p>
              <ul role="list">{moroccan.map(renderRow)}</ul>
            </div>
          )}
          {beyond.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 mb-3">Beyond Morocco</p>
              <ul role="list">{beyond.map(renderRow)}</ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
