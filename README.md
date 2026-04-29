# Amawal — Tamazight Dictionary

<div align="center">
  <h2>ⴰⵎⴰⵡⴰⵍ</h2>
  <p><em>A living dictionary and linguistic atlas of the Tamazight (Berber) language family</em></p>
  <p><a href="https://tamazight.io">tamazight.io</a></p>
</div>

A Dancing with Lions publication. Sister site: [darija.io](https://darija.io).

---

## What this is

**Amawal** (ⴰⵎⴰⵡⴰⵍ — "dictionary" in Tamazight) is a structured reference for the Tamazight (Berber) language family. The launch corpus is **Tachelhit** — the variety spoken across the Souss in southern Morocco — with the underlying grammar generalising to **Kabyle** (Algeria), **Tarifit** (Northern Morocco), **Central Atlas Tamazight**, and **Tuareg** through predictable shifts. Pan-Berber by design, Tachelhit by volume today.

Built on the calm-OS principles: clarity over cleverness, no streaks, no dopamine UI, no accounts, no ads. Useful and quietly addictive in the spirit of Sunsama.

## Status

Currently on the development branch `claude/align-dictionary-chrome-hEykQ`. Deploy when the `tamazight.io` domain resolves.

| Variety | Status | Speakers |
|---------|--------|----------|
| Tachelhit | Live | ~8 million |
| Central Atlas | Coming | ~5 million |
| Tarifit | Coming | ~4 million |
| Ghomara | Coming | ~10–20k |
| Kabyle | Coming | ~6 million |
| Tuareg | Coming | ~1.5 million |
| Zenaga | Coming | ~5k (endangered) |

## Surfaces

### Reference

| Route | Purpose |
|-------|---------|
| `/` | Search-first home with daily rituals (recently viewed, word of the day, first-day, tradition, phrases discovery, explore) |
| `/dictionary` | Browse every entry, grouped by semantic field |
| `/dictionary/[word]` | Per-entry page with etymology, morphology, regional variants, examples, cross-references, OG share card, "Practice this word" button |
| `/grammar` | Sound system, root-and-pattern morphology, free vs construct state, gender, pronouns, verb stems, negation |
| `/map` | Interactive linguistic atlas (Mapbox, with static fallback) |
| `/map/[region]` | Per-region detail; coming-soon varieties render placeholder pages, not 404s |
| `/alphabet` | Tifinagh script reference |
| `/conjugation`, `/conjugation/[verb]` | Verb tables |
| `/symbols`, `/symbols/[id]` | Amazigh visual symbol dictionary |

### Learning loops

| Route | What it does |
|-------|---|
| `/first-day` | 40 curated essentials across 7 themes (greetings, people, numbers, food, time, places, body), 8 rotated daily on home |
| `/practice` | Spaced-repetition flashcards with three card directions: Tifinagh→meaning, meaning→Latin, **Latin→Tifinagh** (the killer mode darija can't have). Progress in `localStorage`, no accounts. Deep-link via `?word=...` for one-card sessions. |
| `/how-to-say` | Curated SEO surface — 32 common questions ("How to say water in Tamazight"), each with FAQ JSON-LD |

### Project

| Route | What it does |
|-------|---|
| `/about` | Project mission, language background, regional varieties, atlas callout |
| `/methodology` | How entries are sourced and verified |
| `/contact` | Contact form |
| `/support` | Patron-model donation tiers (env-driven; not active until `NEXT_PUBLIC_SUPPORT_URL` is set) |
| `/legal/[slug]` | `privacy`, `terms`, `accessibility` |

## Tech

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, custom CSS for animations + focus-visible + reduced-motion
- **i18n**: next-intl (`en`, `fr`); cookie-driven, falls back to `Accept-Language`
- **Map**: Mapbox GL with static-fallback when WebGL unavailable
- **OG cards**: Next.js `ImageResponse` with bundled Noto Sans Tifinagh
- **Data**: bundled JSON in `/data` (no DB)
- **Deployment**: Vercel

## Project structure

```
tamazight-dictionary/
├── app/
│   ├── _home/              # Home-page sections (server + client)
│   ├── _og-fonts/           # Bundled font for OG ImageResponse
│   ├── api/                 # Dictionary, contact, subscribe, footer
│   ├── dictionary/          # Index + [word] detail + opengraph-image
│   ├── first-day/           # /first-day surface
│   ├── grammar/             # Long-form grammar reference
│   ├── how-to-say/          # SEO surface index + [term] detail
│   ├── legal/[slug]/        # Privacy, terms, accessibility
│   ├── map/, /map/[region]/ # Interactive atlas + per-region pages
│   ├── practice/            # Flashcard practice surface
│   ├── support/             # Patron tiers
│   ├── layout.tsx           # NextIntl provider, ThemeProvider, JSON-LD
│   ├── robots.ts            # AI-policy-aware robots
│   └── sitemap.ts
├── components/              # Header, Footer, LocaleSwitcher, AudioPlayer,
│                            # WordHeatMap, LanguageMap, NewsletterSignup,
│                            # RecentTracker, RecentlyViewed, EntryContextStrip
├── data/
│   ├── dictionary/          # tachelhit.json + tachelhit-enhanced.json
│   ├── phrases/, conjugations/, symbols/
│   ├── regions.json         # All 7 Berber varieties with sub-regions
│   ├── alphabet.json
│   ├── first-day.json       # Curated 40-word list
│   └── how-to-say.json      # Curated 32-term SEO list
├── i18n/request.ts          # Locale detection
├── messages/                # en.json, fr.json
├── lib/                     # dictionary, phrases, conjugation, nexus, transliteration
├── public/
│   ├── icon.svg             # Yaz (ⵣ) glyph in brand red
│   ├── llms.txt             # AI-GEO manifest
│   ├── llms-full.txt        # Deep AI knowledge file
│   └── apple-touch-icon.svg
├── types/                   # TypeScript interfaces
├── middleware.ts            # License Link header + X-Robots-Tag noai
└── next.config.mjs          # Wrapped with createNextIntlPlugin
```

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
```

### Environment variables

| Variable | Purpose | Required |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical origin (default `https://tamazight.io`) | No |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox token for the atlas | No (static fallback works without it) |
| `NEXT_PUBLIC_SUPPORT_URL` | Stripe payment link for `/support` tiers | No (greys-out without it) |

## Data model

A dictionary entry (full schema in `types/index.ts`):

```ts
{
  id: 'word-001',
  word: 'akal',
  tifinagh: 'ⴰⴽⴰⵍ',
  pronunciation: 'akal',
  partOfSpeech: 'noun',
  gender: 'masculine',
  definitions: [
    { language: 'en', meaning: 'earth, land, ground, soil, territory' },
    { language: 'fr', meaning: 'terre, sol, territoire' },
  ],
  semanticFields: ['nature', 'agriculture'],
  etymology: { root: 'k-l', origin: 'proto-Berber', cognates: [...] },
  morphology: { state: 'free', plural: 'ikallen' },
  examples: [{ text: '...', tifinagh: '...', source: { type: 'proverb' } }],
  usageNotes: [{ type: 'cultural', text: '...' }],
  variants: [{ region: 'high-atlas', form: '...', notes: '...' }],
  region: 'tachelhit',
}
```

Curated sidecars (decoupled from per-entry data):
- `data/first-day.json` — slug → entry word, 40 entries in 7 themed groups
- `data/how-to-say.json` — slug → entry word, 32 SEO terms in 8 groups

## AI policy & licensing

Content licensed **[CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/)**. The codebase itself is MIT.

The site distinguishes two classes of AI crawler:

- **Allowed** (visit on demand, return citation URL): Googlebot, Bingbot, ChatGPT-User, OAI-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Applebot.
- **Disallowed** (silent ingestion into model weights): GPTBot, Google-Extended, ClaudeBot, anthropic-ai, Claude-Web, CCBot, Bytespider, Meta-ExternalAgent, FacebookBot, Diffbot, Amazonbot, Applebot-Extended, cohere-ai, AI2Bot, and others. See [`app/robots.ts`](app/robots.ts) for the full list.

Three machine-readable signals enforce the policy on every response:
1. `robots.ts` — explicit per-user-agent allow/disallow
2. Edge middleware — `Link: <license>; rel="license"` and `X-Robots-Tag: noai, noimageai`
3. JSON-LD WebSite schema — `license`, `copyrightHolder`, `creditText`, `usageInfo`

Training use of the corpus requires written permission from Dancing with Lions (`contact@dancingwiththelions.com`).

## Citation

```
Dancing with Lions. (2026). Amawal: Tamazight Dictionary [Online resource].
https://tamazight.io
```

## Contributing

Issues and PRs are welcome. The most valuable contributions are:
- New verified Tachelhit entries (with sources)
- Population of the `etymology.root` field across the existing corpus
- Native-speaker review of cultural notes
- French translation of long-form pages (currently English-only beyond chrome strings)
- Coverage for Central Atlas, Tarifit, Ghomara, Kabyle, Tuareg

Use the `/contact` form on the site or open an issue here.

---

<div align="center">
  <p>ⵜⴰⵎⴰⵣⵉⵖⵜ</p>
  <p><em>A Dancing with Lions publication · Marrakech, Morocco</em></p>
</div>
