import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Edge middleware: machine-readable license signals on every response.
 *
 * Sets two attribution-required signals on every HTML/JSON response:
 *   - Link: <license-url>; rel="license" — RFC 8288 license link
 *     (canonical machine-readable license declaration)
 *   - X-Robots-Tag: noai, noimageai — emerging convention honored by
 *     Adobe Stock, DeviantArt, and several AI training pipelines as
 *     a no-training opt-out signal that complements robots.txt.
 *
 * These do not stop a determined scraper. They do create unambiguous
 * machine-readable evidence that the content is licensed under
 * CC BY-NC-ND 4.0 and not available for AI training.
 */
const LICENSE_URL = 'https://creativecommons.org/licenses/by-nc-nd/4.0/';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set('Link', `<${LICENSE_URL}>; rel="license"`);
  response.headers.set('X-Robots-Tag', 'noai, noimageai');

  return response;
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:ttf|woff2?|png|jpg|jpeg|gif|svg|ico)$).*)',
};
