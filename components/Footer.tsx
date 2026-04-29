'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import regionsData from '@/data/regions.json';

interface RegionInfo {
  id: string;
  name: string;
  status?: string;
  country?: string;
  countries?: string[];
}

export default function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const regions = regionsData.regions as RegionInfo[];
  const isMorocco = (r: RegionInfo) => (r.countries || [r.country]).includes('Morocco');
  const moroccan = regions.filter(isMorocco);
  const beyond = regions.filter(r => !isMorocco(r));
  return (
    <footer className="mt-20">
      {/* Level 1 — Navigation */}
      <div style={{ backgroundColor: '#1f1f1f' }}>
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <Link href="/" className="flex items-center gap-3 mb-3">
                <span className="tifinagh text-2xl text-white/90">ⴰⵎⴰⵡⴰⵍ</span>
                <span className="uppercase tracking-widest text-[10px] text-white/70">Amawal</span>
              </Link>
              <p className="text-xs text-white/70 leading-relaxed max-w-xs">
                {t('tagline')}
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mt-5">
                {t('siblingSite')}
              </p>
              <a
                href="https://darija.io"
                rel="noopener"
                className="text-xs text-white/85 hover:text-white transition-colors mt-1 inline-block"
              >
                darija.io <span className="text-white/40">— Moroccan Arabic dictionary</span>
              </a>
            </div>

            {/* Learn */}
            <div>
              <h3 className="uppercase tracking-widest text-[10px] text-white/80 mb-3">{t('learn')}</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-xs text-white/90 hover:text-white transition-colors">{tNav('dictionary')}</Link></li>
                <li><Link href="/dictionary" className="text-xs text-white/90 hover:text-white transition-colors">{t('browseAll')}</Link></li>
                <li><Link href="/first-day" className="text-xs text-white/90 hover:text-white transition-colors">{tNav('firstDay')}</Link></li>
                <li><Link href="/practice" className="text-xs text-white/90 hover:text-white transition-colors">{tNav('practice')}</Link></li>
                <li><Link href="/grammar" className="text-xs text-white/90 hover:text-white transition-colors">{tNav('grammar')}</Link></li>
                <li><Link href="/how-to-say" className="text-xs text-white/90 hover:text-white transition-colors">{tNav('phrases')}</Link></li>
              </ul>
            </div>

            {/* Explore */}
            <div>
              <h3 className="uppercase tracking-widest text-[10px] text-white/80 mb-3">{t('explore')}</h3>
              <ul className="space-y-2">
                <li><Link href="/map" className="text-xs text-white/90 hover:text-white transition-colors">{t('linguisticAtlas')}</Link></li>
                <li><Link href="/symbols" className="text-xs text-white/90 hover:text-white transition-colors">{t('symbolDictionary')}</Link></li>
                <li><Link href="/alphabet" className="text-xs text-white/90 hover:text-white transition-colors">{t('tifinaghAlphabet')}</Link></li>
                <li><Link href="/conjugation" className="text-xs text-white/90 hover:text-white transition-colors">{t('verbConjugation')}</Link></li>
              </ul>
            </div>

            {/* Project */}
            <div>
              <h3 className="uppercase tracking-widest text-[10px] text-white/80 mb-3">{t('project')}</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-xs text-white/90 hover:text-white transition-colors">{tNav('about')}</Link></li>
                <li><Link href="/methodology" className="text-xs text-white/90 hover:text-white transition-colors">{t('methodology')}</Link></li>
                <li><Link href="/contact" className="text-xs text-white/90 hover:text-white transition-colors">{t('contact')}</Link></li>
                <li><Link href="/support" className="text-xs text-white/90 hover:text-white transition-colors">{t('support')}</Link></li>
              </ul>
            </div>
          </div>

          {/* Dialects — pan-Berber roadmap, Tachelhit-today honest */}
          <div className="mt-10 pt-8 border-t border-white/10">
            <h3 className="uppercase tracking-widest text-[10px] text-white/80 mb-5">{t('dialectsHeading')}</h3>
            <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-3">{t('dialectsMorocco')}</p>
                <ul className="flex flex-wrap gap-x-4 gap-y-2">
                  {moroccan.map(r => {
                    const live = r.status === 'active' || !r.status;
                    return (
                      <li key={r.id}>
                        <Link
                          href={`/map/${r.id}`}
                          className="inline-flex items-baseline gap-2 text-xs text-white/85 hover:text-white transition-colors"
                        >
                          <span>{r.name}</span>
                          <span className={live ? 'text-[#e8572e]' : 'text-white/40'}>
                            {live ? '· live' : '· soon'}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-3">{t('dialectsBeyond')}</p>
                <ul className="flex flex-wrap gap-x-4 gap-y-2">
                  {beyond.map(r => {
                    const live = r.status === 'active' || !r.status;
                    return (
                      <li key={r.id}>
                        <Link
                          href={`/map/${r.id}`}
                          className="inline-flex items-baseline gap-2 text-xs text-white/85 hover:text-white transition-colors"
                        >
                          <span>{r.name}</span>
                          <span className={live ? 'text-[#e8572e]' : 'text-white/40'}>
                            {live ? '· live' : '· soon'}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Level 2 — Legal */}
      <div style={{ backgroundColor: '#161616' }}>
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex flex-wrap items-center gap-6 text-xs">
            <Link href="/legal/privacy" className="text-white/85 hover:text-white transition-colors">{t('privacy')}</Link>
            <Link href="/legal/terms" className="text-white/85 hover:text-white transition-colors">{t('terms')}</Link>
            <Link href="/legal/accessibility" className="text-white/85 hover:text-white transition-colors">{t('accessibility')}</Link>
          </div>
        </div>
      </div>

      {/* Level 3 — Powered by */}
      <div style={{ backgroundColor: '#0e0e0e' }}>
        <div className="max-w-7xl mx-auto px-6 py-3">
          <p className="text-[9px] tracking-[0.15em] uppercase text-white/70 text-center">
            A <a href="https://www.slowmorocco.com" target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white transition-colors">Slow Morocco</a> project / Powered by <a href="https://www.dancingwiththelions.com" target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white transition-colors">Dancing with Lions</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
