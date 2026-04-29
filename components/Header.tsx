'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ThemeToggle, { ThemeToggleCompact } from './ThemeToggle';
import LocaleSwitcher from './LocaleSwitcher';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations('nav');

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur border-b border-neutral-100 dark:border-white/10">
      <div className="px-6 md:px-[8%] lg:px-[12%] h-14 flex items-center justify-between gap-4 md:gap-6">
        <Link href="/" className="flex items-baseline gap-2 group" aria-label="Tamazight home">
          <span className="tifinagh text-xl text-[#c53a1a] leading-none group-hover:opacity-80 transition-opacity">ⴰⵎⴰⵡⴰⵍ</span>
          <span className="font-display text-base tracking-tight">tamazight</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-xs uppercase tracking-widest">
          <Link href="/" className="text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors">{t('dictionary')}</Link>
          <Link href="/first-day" className="text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors">{t('firstDay')}</Link>
          <Link href="/practice" className="text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors">{t('practice')}</Link>
          <Link href="/grammar" className="text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors">{t('grammar')}</Link>
          <Link href="/how-to-say" className="text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors">{t('phrases')}</Link>
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden md:block">
            <LocaleSwitcher />
          </div>
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <button
            className="md:hidden p-2 -mr-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
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

      {isMenuOpen && (
        <div className="md:hidden border-t border-neutral-100 dark:border-white/10 bg-white dark:bg-[#0a0a0a]">
          <div className="px-6 py-6 flex flex-col gap-5">
            <Link href="/" className="text-sm text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>{t('dictionary')}</Link>
            <Link href="/first-day" className="text-sm text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>{t('firstDay')}</Link>
            <Link href="/practice" className="text-sm text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>{t('practice')}</Link>
            <Link href="/grammar" className="text-sm text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>{t('grammar')}</Link>
            <Link href="/how-to-say" className="text-sm text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>{t('phrases')}</Link>
            <div className="pt-2 border-t border-neutral-100 dark:border-white/10 mt-2 flex flex-col gap-5">
              <Link href="/map" className="text-xs uppercase tracking-widest text-neutral-500 hover:text-black dark:hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>{t('atlas')}</Link>
              <Link href="/symbols" className="text-xs uppercase tracking-widest text-neutral-500 hover:text-black dark:hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>{t('symbols')}</Link>
              <Link href="/alphabet" className="text-xs uppercase tracking-widest text-neutral-500 hover:text-black dark:hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>{t('tifinagh')}</Link>
              <Link href="/conjugation" className="text-xs uppercase tracking-widest text-neutral-500 hover:text-black dark:hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>{t('conjugation')}</Link>
              <Link href="/about" className="text-xs uppercase tracking-widest text-neutral-500 hover:text-black dark:hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>{t('about')}</Link>
            </div>
            <div className="pt-4 border-t border-neutral-100 dark:border-white/10 flex items-center justify-between gap-4">
              <LocaleSwitcher />
              <ThemeToggleCompact />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
