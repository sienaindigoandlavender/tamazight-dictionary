'use client';

import Link from 'next/link';
import { useState } from 'react';
import ThemeToggle, { ThemeToggleCompact } from './ThemeToggle';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-foreground/10">
      <nav className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4">
            <span className="tifinagh text-2xl">ⴰⵎⴰⵡⴰⵍ</span>
            <span className="hidden sm:block uppercase tracking-widest text-sm">Amawal</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/symbols" className="nav-link">
              Symbols
            </Link>
            <Link href="/map" className="nav-link">
              Atlas
            </Link>
            <Link href="/alphabet" className="nav-link">
              Tifinagh
            </Link>
            <Link href="/conjugation" className="nav-link">
              Conjugation
            </Link>
            <Link href="/about" className="nav-link">
              About
            </Link>
            <div className="relative">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-8 pb-4">
            <div className="flex flex-col gap-6">
              <Link href="/symbols" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Symbols
              </Link>
              <Link href="/map" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Linguistic Atlas
              </Link>
              <Link href="/alphabet" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Tifinagh
              </Link>
              <Link href="/conjugation" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Conjugation
              </Link>
              <Link href="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
              <div className="pt-4 border-t border-foreground/10">
                <ThemeToggleCompact />
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
