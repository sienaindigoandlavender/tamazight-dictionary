'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface LegalLink {
  label: string;
  href: string;
}

interface ContentSite {
  label: string;
  url: string;
}

const defaultLegal: LegalLink[] = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
  { label: 'Accessibility', href: '/accessibility' },
];

const defaultContentSites: ContentSite[] = [
  { label: 'Slow Morocco', url: 'https://www.slowmorocco.com' },
  { label: 'Architecture of Morocco', url: 'https://architectureofmorocco.com' },
  { label: 'Cuisines of Morocco', url: 'https://cuisinesofmorocco.com' },
  { label: 'Before the Word', url: 'https://beforetheword.com' },
  { label: 'derb', url: 'https://derb.so' },
];

const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'it', label: 'IT', name: 'Italiano' },
  { code: 'pt', label: 'PT', name: 'Português' },
  { code: 'de', label: 'DE', name: 'Deutsch' },
  { code: 'ar', label: 'AR', name: 'العربية' },
  { code: 'zh', label: 'ZH', name: '中文' },
  { code: 'ja', label: 'JA', name: '日本語' },
  { code: 'ko', label: 'KO', name: '한국어' },
  { code: 'ru', label: 'RU', name: 'Русский' },
  { code: 'nl', label: 'NL', name: 'Nederlands' },
];

export default function Footer() {
  const [legalLinks, setLegalLinks] = useState<LegalLink[]>(defaultLegal);
  const [contentSites, setContentSites] = useState<ContentSite[]>(defaultContentSites);

  // Language switcher
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');
  const langRef = useRef<HTMLDivElement>(null);

  // Fetch footer data from Nexus
  useEffect(() => {
    fetch('/api/footer')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data?.legal) {
          setLegalLinks(data.data.legal);
        }
        if (data.success && data.data?.contentSites) {
          setContentSites(data.data.contentSites);
        }
      })
      .catch(() => {});
  }, []);

  // Google Translate — hidden element + custom dropdown
  useEffect(() => {
    const handleLangClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('click', handleLangClick);

    if (!document.getElementById('google-translate-script')) {
      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement(
          { pageLanguage: 'en', autoDisplay: false },
          'google-translate-hidden'
        );
      };
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }

    return () => document.removeEventListener('click', handleLangClick);
  }, []);

  const translateTo = (langCode: string, label: string) => {
    setCurrentLang(label);
    setLangOpen(false);

    if (langCode === 'en') {
      const frame = document.querySelector('.goog-te-banner-frame') as HTMLIFrameElement;
      if (frame) {
        const closeBtn = frame.contentDocument?.querySelector('.goog-close-link') as HTMLElement;
        closeBtn?.click();
      }
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + window.location.hostname;
      window.location.reload();
      return;
    }

    document.cookie = `googtrans=/en/${langCode}; path=/;`;
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=.${window.location.hostname}`;

    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
    } else {
      window.location.reload();
    }
  };

  return (
    <footer className="mt-20">
      {/* Level 1 — Main Content */}
      <div style={{ backgroundColor: '#1f1f1f' }} className="text-[#e8e4df]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Brand Column */}
            <div className="md:col-span-4">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <span className="tifinagh text-3xl text-[#e8e4df]">ⴰⵎⴰⵡⴰⵍ</span>
                <span className="uppercase tracking-widest text-sm text-[#e8e4df]/70">Amawal</span>
              </Link>
              <p className="text-sm text-[#e8e4df]/60 leading-relaxed max-w-xs">
                A living dictionary and linguistic atlas preserving the beauty and diversity of Tamazight languages across North Africa.
              </p>
            </div>

            {/* Explore Column */}
            <div className="md:col-span-2">
              <h3 className="uppercase tracking-widest text-xs text-[#e8e4df]/40 mb-6">Explore</h3>
              <ul className="space-y-3">
                <li><Link href="/" className="text-sm text-[#e8e4df]/70 hover:text-[#e8e4df] transition-colors">Translate</Link></li>
                <li><Link href="/symbols" className="text-sm text-[#e8e4df]/70 hover:text-[#e8e4df] transition-colors">Symbol Dictionary</Link></li>
                <li><Link href="/map" className="text-sm text-[#e8e4df]/70 hover:text-[#e8e4df] transition-colors">Linguistic Atlas</Link></li>
                <li><Link href="/alphabet" className="text-sm text-[#e8e4df]/70 hover:text-[#e8e4df] transition-colors">Tifinagh Alphabet</Link></li>
                <li><Link href="/conjugation" className="text-sm text-[#e8e4df]/70 hover:text-[#e8e4df] transition-colors">Verb Conjugation</Link></li>
              </ul>
            </div>

            {/* Learn Column */}
            <div className="md:col-span-2">
              <h3 className="uppercase tracking-widest text-xs text-[#e8e4df]/40 mb-6">Learn</h3>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-sm text-[#e8e4df]/70 hover:text-[#e8e4df] transition-colors">About Tamazight</Link></li>
                <li><Link href="/methodology" className="text-sm text-[#e8e4df]/70 hover:text-[#e8e4df] transition-colors">Methodology</Link></li>
                <li><Link href="/contact" className="text-sm text-[#e8e4df]/70 hover:text-[#e8e4df] transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Dialects Column */}
            <div className="md:col-span-2">
              <h3 className="uppercase tracking-widest text-xs text-[#e8e4df]/40 mb-6">Dialects</h3>
              <ul className="space-y-3">
                <li><Link href="/map/tachelhit" className="text-sm text-[#e8e4df]/70 hover:text-[#e8e4df] transition-colors">Tachelhit</Link></li>
                <li><span className="text-sm text-[#e8e4df]/30">Kabyle</span></li>
                <li><span className="text-sm text-[#e8e4df]/30">Tarifit</span></li>
                <li><span className="text-sm text-[#e8e4df]/30">Central Atlas</span></li>
              </ul>
            </div>

            {/* Content Network Column */}
            <div className="md:col-span-2">
              <h3 className="uppercase tracking-widest text-xs text-[#e8e4df]/40 mb-6">Network</h3>
              <ul className="space-y-3">
                {contentSites.map((site, i) => (
                  <li key={i}>
                    <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#e8e4df]/70 hover:text-[#e8e4df] transition-colors">
                      {site.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Level 2 — Legal + Language */}
      <div style={{ backgroundColor: '#161616' }} className="text-[#e8e4df]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Legal Links */}
            <div className="flex flex-wrap items-center gap-6">
              {legalLinks.map((link, index) => (
                <Link key={index} href={link.href} className="text-xs text-[#e8e4df]/50 hover:text-[#e8e4df]/80 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Language Dropdown */}
            <div className="flex items-center gap-4 text-xs">
              <div ref={langRef} className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 text-[#e8e4df]/50 hover:text-[#e8e4df]/80 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  <span>{currentLang}</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {langOpen && (
                  <div className="absolute bottom-full mb-2 right-0 bg-[#2a2a2a] border border-[#e8e4df]/10 py-1 min-w-[140px] shadow-lg">
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => translateTo(l.code, l.label)}
                        className={`block w-full text-left px-3 py-1.5 transition-colors ${
                          currentLang === l.label ? 'text-[#e8e4df]/90' : 'text-[#e8e4df]/50 hover:text-[#e8e4df]/90'
                        }`}
                      >
                        <span className="inline-block w-7">{l.label}</span>
                        <span className="text-[#e8e4df]/30 ml-1">{l.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Hidden Google Translate container */}
              <div id="google-translate-hidden" className="hidden" />
            </div>
          </div>
        </div>
      </div>

      {/* Level 3 — Powered By */}
      <div style={{ backgroundColor: '#0e0e0e' }} className="text-[#e8e4df]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <p className="text-xs text-[#e8e4df]/50 text-center">
            Powered by{' '}
            <a href="https://www.slowmorocco.com" target="_blank" rel="noopener noreferrer" className="text-[#e8e4df]/70 hover:text-[#e8e4df] transition-colors">
              Slow Morocco
            </a>
          </p>
        </div>
      </div>

      {/* Hide Google Translate bar and artifacts */}
      <style jsx global>{`
        .goog-te-banner-frame,
        #goog-gt-tt,
        .goog-te-balloon-frame,
        .goog-tooltip,
        .goog-tooltip:hover,
        .goog-text-highlight,
        #google-translate-hidden,
        .skiptranslate {
          display: none !important;
        }
        body { top: 0 !important; }
      `}</style>
    </footer>
  );
}
