import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getEntryByWord } from '@/lib/dictionary';

export const runtime = 'nodejs';
// Default behaviour: rendered on first request, then cached.
// Skipping generateStaticParams keeps the build fast and avoids
// loading the font dozens of times during prerender.

// 1200×630 — universal OG / Twitter / Pinterest
export const alt = 'Tamazight word card';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Per-word share card.
 *
 * Calm Amazigh minimal:
 *   - Cream background (#fbf7f1)
 *   - Brand red (#c53a1a) for Tifinagh hero + brand mark
 *   - Large Tifinagh script centred (no RTL or shaping needed —
 *     Tifinagh is left-to-right with no contextual joins)
 *   - Latin transliteration + English meaning beneath
 *   - Footer wordmark: ⴰⵎⴰⵡⴰⵍ + tamazight.io
 *
 * The Tifinagh font has to be bundled because (a) ImageResponse
 * can't load system fonts, (b) almost no system fonts ship glyphs
 * in the U+2D30–U+2D7F Tifinagh block.
 */
export default async function Image({ params }: { params: Promise<{ word: string }> }) {
  const { word } = await params;
  const entry = getEntryByWord(decodeURIComponent(word), 'tachelhit');

  const tifinaghFont = await readFile(
    path.join(process.cwd(), 'app/_og-fonts/NotoSansTifinagh-Regular.ttf')
  ).catch(() => null);

  if (!entry) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fbf7f1',
            color: '#c53a1a',
            fontSize: 48,
            fontFamily: 'serif',
          }}
        >
          tamazight.io
        </div>
      ),
      { ...size }
    );
  }

  const meaning =
    entry.definitions.find(d => d.language === 'en')?.meaning ??
    entry.definitions[0]?.meaning ??
    '';

  // Tifinagh hero scales down for very long words so it never overflows.
  const tCount = Array.from(entry.tifinagh).length;
  const heroSize =
    tCount <= 4 ? 220 :
    tCount <= 6 ? 180 :
    tCount <= 8 ? 150 : 120;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#fbf7f1',
          padding: '72px 80px',
          position: 'relative',
          fontFamily: 'serif',
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: 'flex',
            color: '#c53a1a',
            fontSize: 18,
            letterSpacing: 6,
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          Tamazight Dictionary
        </div>

        {/* Main content — vertically centred */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Tifinagh hero */}
          <div
            style={{
              fontFamily: 'NotoSansTifinagh, serif',
              fontSize: heroSize,
              color: '#c53a1a',
              lineHeight: 1,
              marginBottom: 32,
              display: 'flex',
            }}
          >
            {entry.tifinagh}
          </div>

          {/* Latin word */}
          <div
            style={{
              fontSize: 64,
              color: '#1a1a1a',
              lineHeight: 1,
              marginBottom: 20,
              display: 'flex',
              letterSpacing: -1,
            }}
          >
            {entry.word}
          </div>

          {/* English meaning */}
          <div
            style={{
              fontSize: 36,
              color: '#525252',
              display: 'flex',
              maxWidth: 1000,
            }}
          >
            {meaning.length > 90 ? meaning.slice(0, 87) + '…' : meaning}
          </div>
        </div>

        {/* Footer wordmark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 12,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <span
            style={{
              fontFamily: 'NotoSansTifinagh, serif',
              fontSize: 28,
              color: '#c53a1a',
              display: 'flex',
            }}
          >
            ⴰⵎⴰⵡⴰⵍ
          </span>
          <span
            style={{
              fontSize: 22,
              color: '#1a1a1a',
              letterSpacing: -0.5,
              display: 'flex',
            }}
          >
            tamazight.io
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: tifinaghFont
        ? [
            {
              name: 'NotoSansTifinagh',
              data: tifinaghFont,
              style: 'normal',
              weight: 400,
            },
          ]
        : [],
    }
  );
}
