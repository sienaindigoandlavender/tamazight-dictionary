import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amawal.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/contact'],
      },
      // AI Crawlers — explicit allow for knowledge endpoints
      {
        userAgent: ['OAI-SearchBot', 'GPTBot', 'ChatGPT-User', 'anthropic-ai', 'Claude-Web', 'PerplexityBot', 'Google-Extended'],
        allow: ['/', '/api/dictionary', '/api/glossary'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
