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
  description?: string;
}

/**
 * Map preview just above the footer. A calm static preview — list of
 * dialect regions with coloured markers, plus a CTA into the full
 * interactive atlas at /map. Keeps the home page light (no Mapbox bundle
 * loaded here) and gives the marquee feature constant visibility.
 */
export default function MapPreview() {
  const regions = regionsData.regions as RegionInfo[];
  const active = regions.filter(r => r.status === 'active' || !r.status);

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
            Tamazight isn&rsquo;t one language — it&rsquo;s a family. {regions.length} varieties stretch from the Atlantic coast to the Siwa oasis, each with its own corpus, script tradition, and rhythms. The interactive atlas shows you which words live where.
          </p>
          <Link
            href="/map"
            className="inline-block px-6 py-3 bg-foreground text-background text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Open the atlas →
          </Link>
        </div>

        <div className="md:col-span-7 md:col-start-7">
          <ul role="list" className="space-y-3">
            {active.map(region => (
              <li key={region.id}>
                <Link
                  href={`/map/${region.id}`}
                  className="group flex items-baseline gap-4 py-3 border-b border-neutral-100 dark:border-white/10 hover:border-foreground transition-colors"
                >
                  <span
                    aria-hidden="true"
                    className="w-3 h-3 rounded-full shrink-0 mt-1.5"
                    style={{ backgroundColor: region.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <span className="font-display text-lg md:text-xl group-hover:text-[#c53a1a] transition-colors">
                        {region.name}
                      </span>
                      {region.nameTifinagh && (
                        <span className="tifinagh text-base text-[#c53a1a]">
                          {region.nameTifinagh}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-neutral-500 shrink-0 text-right">
                    {region.speakers}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
