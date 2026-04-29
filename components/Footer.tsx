'use client';

import Link from 'next/link';

export default function Footer() {
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
                A living dictionary and linguistic atlas preserving Tamazight languages across North Africa.
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mt-5">
                Sibling site
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
              <h3 className="uppercase tracking-widest text-[10px] text-white/80 mb-3">Learn</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-xs text-white/90 hover:text-white transition-colors">Dictionary</Link></li>
                <li><Link href="/dictionary" className="text-xs text-white/90 hover:text-white transition-colors">Browse all words</Link></li>
                <li><Link href="/first-day" className="text-xs text-white/90 hover:text-white transition-colors">First Day</Link></li>
                <li><Link href="/practice" className="text-xs text-white/90 hover:text-white transition-colors">Practice</Link></li>
                <li><Link href="/grammar" className="text-xs text-white/90 hover:text-white transition-colors">Grammar</Link></li>
                <li><Link href="/how-to-say" className="text-xs text-white/90 hover:text-white transition-colors">Phrases</Link></li>
              </ul>
            </div>

            {/* Explore */}
            <div>
              <h3 className="uppercase tracking-widest text-[10px] text-white/80 mb-3">Explore</h3>
              <ul className="space-y-2">
                <li><Link href="/map" className="text-xs text-white/90 hover:text-white transition-colors">Linguistic Atlas</Link></li>
                <li><Link href="/symbols" className="text-xs text-white/90 hover:text-white transition-colors">Symbol Dictionary</Link></li>
                <li><Link href="/alphabet" className="text-xs text-white/90 hover:text-white transition-colors">Tifinagh Alphabet</Link></li>
                <li><Link href="/conjugation" className="text-xs text-white/90 hover:text-white transition-colors">Verb Conjugation</Link></li>
              </ul>
            </div>

            {/* Project */}
            <div>
              <h3 className="uppercase tracking-widest text-[10px] text-white/80 mb-3">Project</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-xs text-white/90 hover:text-white transition-colors">About</Link></li>
                <li><Link href="/methodology" className="text-xs text-white/90 hover:text-white transition-colors">Methodology</Link></li>
                <li><Link href="/contact" className="text-xs text-white/90 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Level 2 — Legal */}
      <div style={{ backgroundColor: '#161616' }}>
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex flex-wrap items-center gap-6 text-xs">
            <Link href="/legal/privacy" className="text-white/85 hover:text-white transition-colors">Privacy</Link>
            <Link href="/legal/terms" className="text-white/85 hover:text-white transition-colors">Terms of Use</Link>
            <Link href="/legal/accessibility" className="text-white/85 hover:text-white transition-colors">Accessibility</Link>
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
