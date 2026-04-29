# CLAUDE.md — tamazight.io context for future sessions

This file is read by Claude Code on startup. It exists so the next session doesn't have to re-derive the project's strategy, decisions, and architectural conventions from the codebase. Keep it short, opinionated, and updated when meaningful direction changes happen.

## Quick context

- **What**: tamazight.io — a structured Tamazight (Berber) dictionary and linguistic atlas. Pan-Berber by design, Tachelhit by current corpus volume.
- **Sister site**: darija.io. Same publisher (Dancing with Lions), reciprocal cross-links in footers and `llms.txt` files, intentionally sibling visual identity.
- **Stage**: pre-launch. Domain not yet purchased. The branch `claude/align-dictionary-chrome-hEykQ` was merged to `main` after a multi-session build-out of the chrome alignment, learning loops, SEO + AI-GEO surfaces, i18n foundation, and AI training opt-out.
- **Next operational milestone**: buy `tamazight.io`, deploy, verify in Search Console, submit sitemap. 90-day indexing focus thereafter.

## Sections to read first

1. Strategic positioning & roadmap state — read **before** suggesting features.
2. Calm-OS principles — explicit anti-patterns to avoid.
3. Explicit non-goals — what NOT to build.
4. Architectural conventions — where things go and why.
5. Surface inventory — what's there.
6. Recent commit history — the journey from chrome alignment to AI policy.
7. Next moves — the queued work.

## 1. Strategic positioning

**The bet:** become the defacto online reference for Tamazight by combining linguistic depth (etymology, morphology, regional heatmaps, the Tifinagh-recall practice mode) with calm-OS UX. Compete on clarity where everyone else is institutional (IRCAM, Asegzawal — `canary yellow!`) or app-shaped (GoDarija, Morolingo). We win on web-reference, not on app-course.

**Pan-Berber, not Morocco-only.** The data model already supports all 7 varieties (`data/regions.json`). Tachelhit is shipped today, the others are visible in the footer with `· soon` badges. Kabyle (Algeria, ~6M speakers) matters strategically because the diaspora is heavily francophone in France/Belgium — that's why the i18n French translation is more than a nice-to-have.

**Two-product portfolio.** tamazight.io and darija.io are siblings. Visual identity, footer cross-promo, `llms.txt` cross-references, and contextual in-content links connect them. Future siblings could include other languages (Hassani Arabic, Egyptian, etc.).

## 2. Calm-OS principles

The design philosophy. Sunsama-spirit: useful and quietly addictive without dopamine UI.

- **No streaks, no points, no "you're on fire 🔥"**. Practice mode shows level chips ("New / Learning / Reviewing / Known / Mastered") instead of point counters. The done screen says `Session complete · X / Y`, not `Mzyan bzzaf!` with confetti.
- **No empty-state nags.** Recently Viewed renders nothing if empty — never "you haven't viewed anything yet!".
- **One ritual per surface.** Home reads as a single calm column: search → recents → word-of-day → first-day → tradition → phrases → explore → newsletter → map. Don't stack three CTAs.
- **Silence is a feature.** No toasts, no popovers, no "did you know?" banners.
- **No accounts.** localStorage-only is a feature, not a limitation. `amawal-recent-v1`, `amawal-progress-v1`, `amawal-locale`, `amawal-newsletter-v1`, `NEXT_LOCALE` cookie. That's it.
- **Respect deep linking.** Every route shareable, every entry has its own OG card.
- **Continuous polish > new surfaces.** When in doubt, polish what's there.

## 3. Explicit non-goals

User-confirmed in earlier sessions. Do not build any of these without explicit re-confirmation:

- ❌ **Audio / voiceover recordings** — out of scope for now. The `AudioPlayer` component exists but no entries have audio files. Don't expand audio surfaces.
- ❌ **Newsletter funnel** — explicit "next week" item that hasn't started. The `NewsletterSignup` component exists and the `/api/subscribe` endpoint is a logging stub. Don't build the funnel pipeline yet.
- ❌ **Paywall** — user wants traffic and engagement first. The `/support` page is Patron-model (donation tiers via Stripe link), not a gate. `NEXT_PUBLIC_SUPPORT_URL` is unset; tiers render greyed-out.
- ❌ **Accounts / sign-in** — explicit anti-pattern. localStorage-only stays.
- ❌ **AI tutor / chatbot on top** — calm-OS violation, lazy product answer.
- ❌ **More features during the 90-day indexing focus.** Doesn't help indexing.
- ❌ **Native apps before mid-2026.** Web validates demand first.
- ❌ **Partnerships with other dictionaries.** User position: "they think of them first, not me."
- ❌ **Expanding to all Berber varieties at once.** Tachelhit ships excellently first. Kabyle/Tarifit corpus expansion is P3, not P2.
- ❌ **Email digest service.** Skipped per user.

## 4. Architectural conventions

**i18n** uses next-intl. Cookie `NEXT_LOCALE` drives chrome translation; `localStorage['amawal-locale']` drives the dictionary direction (en-tmz vs fr-tmz). The `LocaleSwitcher` component writes both atomically and calls `router.refresh()` so server components re-render with the new locale, scroll position preserved. Translatable strings live in `messages/en.json` and `messages/fr.json` under `site`, `nav`, `search`, `home`, `footer`, `language` namespaces. Long-form content (`/grammar`, `/legal/[slug]`, `/practice` mode labels, `/how-to-say` detail templates, dictionary entry section labels) is **English-only by design** — translator pass deferred.

**Locale-aware client components** subscribe to `AMAWAL_LOCALE_EVENT` (window CustomEvent) for instant re-render when the user switches without full server refresh. See `WordOfTheDay.tsx`, `FirstDaySection.tsx`, `WisdomSection.tsx`.

**Daily rotation** is deterministic per 24h block via `app/_home/util.ts`'s `dayIndex()` and `pickByDay()`. Same word for everyone for the day. SSR-stable (no client randomness so hydration matches).

**Curated lists** live in `data/*.json` sidecars (`first-day.json`, `how-to-say.json`) keyed by dictionary slug, resolved against the live corpus at build/render. Missing slugs are dropped silently. This decouples curation from the linguistic data files.

**Map state architecture**: `data/regions.json` is the canonical region list. Each region has `status: 'active' | 'coming_soon'`. `/map/[region]` renders entries for active regions, a placeholder roadmap page for coming-soon. Pre-renders all 7 at build. Sitemap registers all 7.

**OG image generation** at `app/dictionary/[word]/opengraph-image.tsx`. Cards render on first request and cache (no static prerender for 162 entries on every build). Bundles `Noto Sans Tifinagh` from `app/_og-fonts/` because Satori can't load system fonts. Tifinagh is LTR with no contextual joining — no shaping helper needed (unlike darija's Arabic).

**AI policy** is enforced via three layers:
1. `app/robots.ts` — explicit allow (retrieval bots) vs disallow (training bots) by user-agent.
2. `middleware.ts` — sets `Link: <license>; rel="license"` and `X-Robots-Tag: noai, noimageai` on every HTML response.
3. JSON-LD in `app/layout.tsx` — `license`, `copyrightHolder`, `creditText`, `usageInfo` fields.
Plus `<link rel="license">` and `<meta name="robots" content="noai, noimageai">` in the head.

**Code license: MIT. Content license: CC BY-NC-ND 4.0.** This distinction is critical — the README has it correctly. Don't ever say "License: MIT" without scoping it to "code".

## 5. Surface inventory

### Reference surfaces
- `/` — search-first home with daily rituals
- `/dictionary` — browse every entry, grouped by semantic field
- `/dictionary/[word]` — per-entry, with `EntryContextStrip` showing first-day badge, practice level chip, and "Practice this word →" deep-link to `/practice?word=...`
- `/dictionary/[word]/opengraph-image` — 1200×630 share card
- `/grammar` — sound system, roots & patterns, free vs construct state, gender, pronouns, verb stems, negation
- `/map`, `/map/[region]` — Mapbox atlas with static fallback; coming-soon regions render placeholder pages, not 404s
- `/alphabet`, `/conjugation`, `/conjugation/[verb]`, `/symbols`, `/symbols/[id]` — pre-existing reference surfaces
- `/api/dictionary` — JSON-LD lookup endpoint

### Learning loops
- `/first-day` + `app/_home/FirstDaySection.tsx` — 40 essentials in `data/first-day.json` across 7 themed groups, 8 rotated daily on home
- `/practice` + `PracticeClient.tsx` — three card directions including the killer **Latin → Tifinagh** mode. Spaced rep ladder (now / 1m / 5m / 30m / 1d / 3d) in `localStorage['amawal-progress-v1']`. Sessions cap at 20 cards. Wrong answers re-insert 3-5 cards later.
- `/how-to-say` + `/how-to-say/[term]` — 32 SEO-targeted question pages with FAQ JSON-LD, in `data/how-to-say.json`

### Home page sections (in render order)
1. Hero search (existing translator)
2. `RecentlyViewed` (last 8 entries from localStorage, renders nothing if empty)
3. `WordOfTheDay` (deterministic daily, prefers cultural-note entries)
4. `FirstDaySection` (8 rotating from the curated 40)
5. `WisdomSection` ("From the tradition" — 6 rotating annotated lines from `getTraditionLines()`)
6. Phrases discovery (existing)
7. Explore More cards (existing)
8. `NewsletterSignup` (calm in-flow banner)
9. `MapPreview` (all 7 varieties grouped Morocco / Beyond, coming-soon badges)

### Project surfaces
- `/about`, `/methodology`, `/contact` — existing
- `/support` — Patron tiers, env-driven via `NEXT_PUBLIC_SUPPORT_URL`
- `/legal/[slug]` — privacy, terms, accessibility (hardcoded fallback content)

### Top nav (6 items)
Dictionary · First Day · Practice · Grammar · Phrases · Atlas. Plus EN/FR locale switcher and theme toggle on the right. Mobile menu adds Symbols / Tifinagh / Conjugation / About in a quieter trailing tier.

## 6. Recent commit history (high-level journey)

The branch went through these rough phases. If you need to find a decision, search commits in this order:

1. **Chrome alignment with darija.io** — fonts (Playfair Display + DM Sans + IBM Plex Mono), accent shift `#c44d2b` → `#c53a1a`, fixed h-14 header, EN/FR locale switcher, top-nav uppercase, brand `amawal` → `tamazight`.
2. **Domain switch** — `amazigh.online` → `tamazight.io` everywhere.
3. **Favicon redesign** — yaz (ⵣ) glyph for tamazight (paired with darija's three descending bars).
4. **P0 rituals** — Word of the Day, Recently Viewed, First Day essentials.
5. **P1** — Practice (3 card modes), per-word OG cards, Grammar reference page.
6. **P2** — Wisdom section, How-to-say SEO surface, i18n foundation + chrome translation.
7. **Top-nav restructure** — slimmed from 10 items to 5, About moved to footer.
8. **Polish** — focus-visible ring, prefers-reduced-motion, scroll-padding for sticky headers, /dictionary browse index, /support Patron page, legal/[slug] pages with hardcoded fallback.
9. **Pan-Berber surfacing** — Morocco-grouped dialects strip in footer, MapPreview shows all 7 varieties with coming-soon badges, /map/[region] graceful for non-active varieties.
10. **Newsletter banner** + map-above-footer + Atlas back into top nav.
11. **AI training opt-out** — robots policy split (retrieval allowed, training disallowed), license headers via middleware, JSON-LD `license` + `copyrightHolder` + `creditText` + `usageInfo`, attribution-required language in `llms.txt` + `llms-full.txt`.
12. **Documentation** — README rewrite, this file.

## 7. Next moves (in order)

**This file gets updated whenever a session changes the strategic direction or finishes meaningful work. Keep it tight.**

### Operational (not code)
1. Buy `tamazight.io`. Configure DNS. Set `NEXT_PUBLIC_SITE_URL`. Deploy.
2. Verify in Google Search Console + Bing Webmaster Tools. Submit sitemap. Manual indexing requests on top 30 URLs.
3. Backlinks from `dancingwiththelions.com` and `slowmorocco.com`. One mention in any Morocco/Berber community channel.

### 90-day indexing focus (compounds over time)
- 2 new dictionary entries per day = ~180 new indexed URLs in 90 days.
- 1 long-form post per month (e.g., "Tachelhit pronunciation guide", "Tifinagh script history").
- Watch GSC weekly for queries you appear for at position 11–50 — those tell you what to write more about.

### Code work that's actually useful next
- **Populate `etymology.root` across the existing 162 entries.** Once there's enough root data, build `/roots` showing word families. Currently only 6 entries have it; that's why `/roots` was skipped.
- **Long-form content translation to French.** Grammar guide, legal pages, /first-day client, /practice mode labels, /how-to-say detail templates, dictionary entry section labels. Translator work, not engineering.
- **Native app preparation** — only when web validates demand. The data layer is already JSON-portable. React Native + Expo + NativeWind keeps 80% of the React/Tailwind code reusable.

### Things explicitly waiting on user signal
- Newsletter funnel pipeline (next-week item; `/api/subscribe` is currently a logging stub).
- Stripe payment link in `NEXT_PUBLIC_SUPPORT_URL`.
- Mapbox token (`NEXT_PUBLIC_MAPBOX_TOKEN`); the static fallback works without it.

### Pre-launch checklist
- Lighthouse audit on the deployed build (CLS, LCP, accessibility).
- Real-device check on iPhone Safari + Android Chrome.
- Test the locale switcher round-trip end-to-end.
- Seed the Nexus DB if you want legal pages to come from there instead of the hardcoded fallback.

---

*If you're reading this in a future session: trust the calm-OS principles, don't add features, ship.*
