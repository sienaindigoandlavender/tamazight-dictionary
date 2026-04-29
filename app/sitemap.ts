import { MetadataRoute } from 'next';
import { getAllEntries, getHowToSayTerms } from '@/lib/dictionary';
import regionsData from '@/data/regions.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamazight.io';
  const now = new Date().toISOString();

  // Static pages
  const staticPages = [
    { url: siteUrl, changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${siteUrl}/dictionary`, changeFrequency: 'weekly' as const, priority: 0.95 },
    { url: `${siteUrl}/first-day`, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${siteUrl}/practice`, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${siteUrl}/grammar`, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${siteUrl}/how-to-say`, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${siteUrl}/symbols`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${siteUrl}/map`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${siteUrl}/alphabet`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${siteUrl}/conjugation`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${siteUrl}/about`, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${siteUrl}/methodology`, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${siteUrl}/contact`, changeFrequency: 'yearly' as const, priority: 0.4 },
    { url: `${siteUrl}/support`, changeFrequency: 'monthly' as const, priority: 0.6 },
  ];

  // Dictionary word pages
  const entries = getAllEntries('tachelhit');
  const wordPages = entries.map(entry => ({
    url: `${siteUrl}/dictionary/${encodeURIComponent(entry.word)}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // How-to-say term pages
  const howToSayPages = getHowToSayTerms('tachelhit').map(t => ({
    url: `${siteUrl}/how-to-say/${t.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Regional dialect pages — every variety, including coming-soon
  // (so search engines see the pan-Berber roadmap from day one).
  const regionPages = regionsData.regions.map(r => ({
    url: `${siteUrl}/map/${r.id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: r.status === 'active' ? 0.85 : 0.6,
  }));

  return [
    ...staticPages.map(p => ({ ...p, lastModified: now })),
    ...regionPages,
    ...howToSayPages,
    ...wordPages,
  ];
}
