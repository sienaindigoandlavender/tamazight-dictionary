import { MetadataRoute } from 'next';

/**
 * Robots policy.
 *
 * Content on tamazight.io is licensed under CC BY-NC-ND 4.0. The
 * policy below distinguishes two classes of automated visitor:
 *
 *  - Retrieval / citation crawlers (Googlebot, Bingbot, ChatGPT-User,
 *    Claude-User, PerplexityBot, OAI-SearchBot, Applebot) — these visit
 *    on demand and return a citation URL to the user. Attribution is
 *    preserved by the way they work, so they're allowed.
 *
 *  - Training crawlers (GPTBot, Google-Extended, ClaudeBot, CCBot,
 *    Bytespider, Meta-ExternalAgent, Applebot-Extended, etc.) — these
 *    ingest content into model weights without per-query attribution.
 *    CC BY-NC-ND 4.0 requires attribution and forbids derivative works,
 *    so these are disallowed. Training use of this content requires
 *    written permission from Dancing with Lions.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamazight.io';

  return {
    rules: [
      // Default — humans and any agent not specifically named below
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/contact', '/api/subscribe'],
      },

      // Retrieval / citation crawlers — welcome
      {
        userAgent: ['Googlebot', 'Bingbot', 'DuckDuckBot', 'Slurp', 'Applebot'],
        allow: '/',
      },
      {
        userAgent: ['ChatGPT-User', 'OAI-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User'],
        allow: '/',
      },

      // Training crawlers — disallowed under CC BY-NC-ND 4.0
      {
        userAgent: [
          'GPTBot',
          'Google-Extended',
          'ClaudeBot',
          'anthropic-ai',
          'Claude-Web',
          'CCBot',
          'cohere-ai',
          'Bytespider',
          'Meta-ExternalAgent',
          'FacebookBot',
          'Diffbot',
          'Amazonbot',
          'Applebot-Extended',
          'omgilibot',
          'omgili',
          'Timpibot',
          'ImagesiftBot',
          'PanguBot',
          'YouBot',
          'AI2Bot',
        ],
        disallow: '/',
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
