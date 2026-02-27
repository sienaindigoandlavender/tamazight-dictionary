import { MetadataRoute } from 'next';
import { getAllEntries } from '@/lib/dictionary';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amazigh.online';
  const now = new Date().toISOString();

  // Static pages
  const staticPages = [
    { url: siteUrl, changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${siteUrl}/symbols`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${siteUrl}/map`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${siteUrl}/alphabet`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${siteUrl}/conjugation`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${siteUrl}/about`, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${siteUrl}/methodology`, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${siteUrl}/contact`, changeFrequency: 'yearly' as const, priority: 0.4 },
  ];

  // Dictionary word pages
  const entries = getAllEntries('tachelhit');
  const wordPages = entries.map(entry => ({
    url: `${siteUrl}/dictionary/${encodeURIComponent(entry.word)}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    ...staticPages.map(p => ({ ...p, lastModified: now })),
    ...wordPages,
  ];
}
