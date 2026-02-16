import { NextRequest, NextResponse } from 'next/server';
import { getAllEntries, getEntryByWord, searchEntries } from '@/lib/dictionary';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amawal.app';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get('word');
  const query = searchParams.get('q');
  const category = searchParams.get('category');
  const format = searchParams.get('format') || 'full';

  // Single word lookup
  if (word) {
    const entry = getEntryByWord(word, 'tachelhit');
    if (!entry) {
      return NextResponse.json({ error: 'Word not found' }, { status: 404 });
    }

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      name: entry.word,
      alternateName: entry.tifinagh,
      description: entry.definitions.find(d => d.language === 'en')?.meaning,
      inDefinedTermSet: {
        '@type': 'DefinedTermSet',
        name: 'Amawal Tamazight Dictionary',
        url: siteUrl,
      },
      termCode: entry.pronunciation,
      url: `${siteUrl}/dictionary/${encodeURIComponent(entry.word)}`,
    };

    return NextResponse.json(jsonLd, {
      headers: { 'Cache-Control': 'public, s-maxage=86400' },
    });
  }

  // Search
  if (query) {
    const results = searchEntries(query, 'tachelhit');
    return NextResponse.json({
      query,
      count: results.length,
      results: results.map(e => ({
        word: e.word,
        tifinagh: e.tifinagh,
        pronunciation: e.pronunciation,
        partOfSpeech: e.partOfSpeech,
        meaning: e.definitions.find(d => d.language === 'en')?.meaning,
        url: `${siteUrl}/dictionary/${encodeURIComponent(e.word)}`,
      })),
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600' },
    });
  }

  // Full dictionary as JSON-LD DefinedTermSet
  let entries = getAllEntries('tachelhit');

  // Filter by category/semantic field
  if (category) {
    entries = entries.filter(e =>
      e.semanticFields?.includes(category as any) ||
      e.partOfSpeech === category
    );
  }

  if (format === 'simple') {
    return NextResponse.json({
      '@context': 'https://schema.org',
      '@type': 'DefinedTermSet',
      name: 'Amawal Tamazight Dictionary',
      url: siteUrl,
      description: 'Comprehensive Tamazight (Tachelhit) dictionary with Tifinagh script, pronunciation, etymology, and cultural context.',
      numberOfTerms: entries.length,
      terms: entries.map(e => ({
        word: e.word,
        tifinagh: e.tifinagh,
        meaning: e.definitions.find(d => d.language === 'en')?.meaning,
        partOfSpeech: e.partOfSpeech,
      })),
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=86400' },
    });
  }

  // Full format
  return NextResponse.json({
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Amawal Tamazight Dictionary',
    url: siteUrl,
    description: 'Comprehensive Tamazight (Tachelhit) dictionary with Tifinagh script, pronunciation, etymology, and cultural context.',
    publisher: {
      '@type': 'Organization',
      name: 'Dancing with Lions',
      url: 'https://dancingwithlions.com',
    },
    inLanguage: ['tzm', 'en', 'fr', 'ar', 'es'],
    numberOfTerms: entries.length,
    hasDefinedTerm: entries.map(e => ({
      '@type': 'DefinedTerm',
      name: e.word,
      alternateName: e.tifinagh,
      description: e.definitions.find(d => d.language === 'en')?.meaning,
      termCode: e.pronunciation,
      url: `${siteUrl}/dictionary/${encodeURIComponent(e.word)}`,
      additionalProperty: [
        ...(e.gender ? [{ '@type': 'PropertyValue', name: 'gender', value: e.gender }] : []),
        ...(e.partOfSpeech ? [{ '@type': 'PropertyValue', name: 'partOfSpeech', value: e.partOfSpeech }] : []),
        ...(e.frequency ? [{ '@type': 'PropertyValue', name: 'frequency', value: e.frequency }] : []),
        ...(e.plural ? [{ '@type': 'PropertyValue', name: 'plural', value: e.plural }] : []),
      ],
    })),
  }, {
    headers: { 'Cache-Control': 'public, s-maxage=86400' },
  });
}
