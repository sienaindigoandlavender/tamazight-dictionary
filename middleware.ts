import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Global licensing payload parameter
 */
const LICENSE_URL = 'https://creativecommons.org/licenses/by-nc-nd/4.0/';

/**
 * Signatures of unverified commercial AI scraping nodes
 */
const BLOCKED_AGENTS = [
  'gptbot',
  'chatgpt-user',
  'google-extended',
  'anthropicai',
  'claude',
  'perplexity',
  'cohere-ai',
  'facebookexternalhit',
  'omgilibot',
  'diffbot',
  'bytespider'
];

export function middleware(request: NextRequest) {
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
  const pathname = request.nextUrl.pathname;

  // 1. HARD BLOCK TRACK: Terminate unverified commercial AI scrapers on monetization paths
  const isProtectedPath = 
    pathname.startsWith('/heritage') || 
    pathname.startsWith('/dictionary') || 
    pathname.startsWith('/api');

  if (isProtectedPath) {
    const isAiBot = BLOCKED_AGENTS.some((bot) => userAgent.includes(bot));
    
    if (isAiBot) {
      return new NextResponse(
        JSON.stringify({ 
          error: "Unauthorized Node Access. Secure commercial API authorization token required." 
        }),
        { 
          status: 403, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }
  }

  // 2. LEGAL IMMUNITY TRACK: Apply CC BY-NC-ND 4.0 signals to all valid request returns
  const response = NextResponse.next();
  response.headers.set('Link', `<${LICENSE_URL}>; rel="license"`);
  response.headers.set('X-Robots-Tag', 'noai, noimageai');

  return response;
}

// Intercept all routes, excluding static assets and media files
export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:ttf|woff2?|png|jpg|jpeg|gif|svg|ico)$).*)',
};
