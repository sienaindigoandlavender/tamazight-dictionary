import { NextResponse } from 'next/server';
import { getLegalPages, getContentSites } from '@/lib/nexus';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const [legal, contentSites] = await Promise.all([
      getLegalPages(),
      getContentSites(),
    ]);

    return NextResponse.json(
      { success: true, data: { legal, contentSites } },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Footer API error:', error);

    return NextResponse.json(
      {
        success: true,
        data: {
          legal: [
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Use', href: '/terms' },
            { label: 'Accessibility', href: '/accessibility' },
          ],
          contentSites: [
            { label: 'Slow Morocco', url: 'https://www.slowmorocco.com' },
            { label: 'Architecture of Morocco', url: 'https://architectureofmorocco.com' },
            { label: 'Cuisines of Morocco', url: 'https://cuisinesofmorocco.com' },
            { label: 'Before the Word', url: 'https://beforetheword.com' },
            { label: 'derb', url: 'https://derb.so' },
          ],
        },
      },
      { status: 200 }
    );
  }
}
