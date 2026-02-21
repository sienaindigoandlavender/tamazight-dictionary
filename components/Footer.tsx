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
            </div>

            {/* Explore */}
            <div>
              <h3 className="uppercase tracking-widest text-[10px] text-white/80 mb-3">Explore</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-xs text-white/90 hover:text-white transition-colors">Translate</Link></li>
                <li><Link href="/symbols" className="text-xs text-white/90 hover:text-white transition-colors">Symbol Dictionary</Link></li>
                <li><Link href="/map" className="text-xs text-white/90 hover:text-white transition-colors">Linguistic Atlas</Link></li>
                <li><Link href="/alphabet" className="text-xs text-white/90 hover:text-white transition-colors">Tifinagh Alphabet</Link></li>
                <li><Link href="/conjugation" className="text-xs text-white/90 hover:text-white transition-colors">Verb Conjugation</Link></li>
              </ul>
            </div>

            {/* Learn */}
            <div>
              <h3 className="uppercase tracking-widest text-[10px] text-white/80 mb-3">Learn</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-xs text-white/90 hover:text-white transition-colors">About Tamazight</Link></li>
                <li><Link href="/methodology" className="text-xs text-white/90 hover:text-white transition-colors">Methodology</Link></li>
                <li><Link href="/contact" className="text-xs text-white/90 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Dialects */}
            <div>
              <h3 className="uppercase tracking-widest text-[10px] text-white/80 mb-3">Dialects</h3>
              <ul className="space-y-2">
                <li><Link href="/map/tachelhit" className="text-xs text-white/90 hover:text-white transition-colors">Tachelhit</Link></li>
                <li><span className="text-xs text-white/40">Kabyle</span></li>
                <li><span className="text-xs text-white/40">Tarifit</span></li>
                <li><span className="text-xs text-white/40">Central Atlas</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Level 2 — Legal */}
      <div style={{ backgroundColor: '#161616' }}>
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex flex-wrap items-center gap-6 text-xs">
            <Link href="/privacy" className="text-white/85 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-white/85 hover:text-white transition-colors">Terms of Use</Link>
            <Link href="/accessibility" className="text-white/85 hover:text-white transition-colors">Accessibility</Link>
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
