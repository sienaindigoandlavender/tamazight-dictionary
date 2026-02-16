/**
 * Nexus Supabase Client
 * Shared configuration hub for legal pages, content sites, site config
 */

const NEXUS_SUPABASE_URL = process.env.NEXUS_SUPABASE_URL || '';
const NEXUS_SUPABASE_ANON_KEY = process.env.NEXUS_SUPABASE_ANON_KEY || '';
const SITE_ID = process.env.SITE_ID || 'amawal';

async function nexusFetch(table: string, params?: string) {
  if (!NEXUS_SUPABASE_ANON_KEY) {
    console.warn('NEXUS_SUPABASE_ANON_KEY not set, using defaults');
    return null;
  }

  const url = `${NEXUS_SUPABASE_URL}/rest/v1/${table}${params ? `?${params}` : ''}`;

  try {
    const res = await fetch(url, {
      headers: {
        'apikey': NEXUS_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${NEXUS_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error(`Nexus fetch error: ${res.status} ${res.statusText}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Nexus fetch failed:', error);
    return null;
  }
}

/**
 * Get legal pages for this site from Nexus
 */
export async function getLegalPages() {
  const data = await nexusFetch(
    'nexus_legal_pages',
    `select=page_title,page_slug&or=(brand_id.eq.${SITE_ID},brand_id.eq.all)&order=id`
  );

  if (!data || !Array.isArray(data) || data.length === 0) {
    return [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Use', href: '/terms' },
      { label: 'Accessibility', href: '/accessibility' },
    ];
  }

  return data.map((p: any) => ({
    label: p.page_title,
    href: `/${p.page_slug}`,
  }));
}

/**
 * Get content network sites from Nexus
 */
export async function getContentSites() {
  const data = await nexusFetch(
    'nexus_content_sites',
    'select=site_label,site_url,display_order&is_active=eq.true&order=display_order'
  );

  if (!data || !Array.isArray(data) || data.length === 0) {
    return [
      { label: 'Slow Morocco', url: 'https://www.slowmorocco.com' },
      { label: 'Architecture of Morocco', url: 'https://architectureofmorocco.com' },
      { label: 'Cuisines of Morocco', url: 'https://cuisinesofmorocco.com' },
      { label: 'Before the Word', url: 'https://beforetheword.com' },
      { label: 'derb', url: 'https://derb.so' },
    ];
  }

  return data.map((s: any) => ({
    label: s.site_label,
    url: s.site_url,
  }));
}

export { SITE_ID };
