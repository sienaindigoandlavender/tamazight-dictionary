'use client';

import Link from 'next/link';
import { useState } from 'react';
import ThemeToggle, { ThemeToggleCompact } from './ThemeToggle';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur border-b border-neutral-100 dark:border-white/10 font-sans">
      <div className="px-6 md:px-[8%] lg:px-[12%] h-14 flex items-center justify-between gap-4 md:gap-6">
        
        {/* Portal Home Logo Anchor */}
        <Link href="/" className="flex items-baseline gap-2 group" aria-label="Tamazight Repository Home">
          <span className="tifinagh text-xl text-[#c53a1a] leading-none group-hover:opacity-80 transition-opacity">ⴰⵎⴰⵡⴰⵍ</span>
          <span className="font-display text-base tracking-tight text-[#1C1C1A] dark:text-white font-medium">tamazight</span>
        </Link>

        {/* Desktop Navigation Link Node Track */}
        <nav className="hidden md:flex items-center gap-7 text-xs uppercase tracking-widest font-mono">
          <Link href="/heritage" className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors font-semibold text-[#c53a1a] dark:text-[#c53a1a]">Heritage</Link>
          <Link href="/" className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Lexicon</Link>
          <Link href="/map" className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Atlas</Link>
          <Link href="/symbols" className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Symbols</Link>
          <Link href="/alphabet" className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Matrix</Link>
          <Link href="/grammar" className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Grammar</Link>
        </nav>

        {/* Global Action Utility Track */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          
          {/* Mobile Collapse Controller Button */}
          <button
            className="md:hidden p-2 -mr-2 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle structural menu tree"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Overlay Menu Drawer */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-neutral-100 dark:border-white/10 bg-white dark:bg-[#0a0a0a] font-mono">
          <div className="px-6 py-6 flex flex-col gap-4 text-xs uppercase tracking-wider">
            <Link href="/heritage" className="text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors font-bold text-[#c53a1a]" onClick={() => setIsMenuOpen(false)}>Material Heritage</Link>
            <Link href="/" className="text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>Dictionary Lexicon</Link>
            <Link href="/map" className="text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>Linguistic Atlas</Link>
            <Link href="/symbols" className="text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>Semiotics Symbols</Link>
            <Link href="/alphabet" className="text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>Tifinagh Alphabet</Link>
            
            <div className="pt-4 border-t border-neutral-100 dark:border-white/10 mt-2 flex flex-col gap-4 text-[11px] text-neutral-500">
              <Link href="/first-day" className="hover:text-black dark:hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>First Day Track</Link>
              <Link href="/practice" className="hover:text-black dark:hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>Spaced Practice</Link>
              <Link href="/grammar" className="hover:text-black dark:hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>Grammar Guidelines</Link>
              <Link href="/conjugation" className="hover:text-black dark:hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>Verb Conjugation</Link>
              <Link href="/about" className="hover:text-black dark:hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>About Node</Link>
            </div>
            
            <div className="pt-4 border-t border-neutral-100 dark:border-white/10 flex items-center justify-end">
              <ThemeToggleCompact />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
