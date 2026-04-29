import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

export const SUPPORTED_LOCALES = ['en', 'fr'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_COOKIE = 'NEXT_LOCALE';

export function detectLocale(cookieLocale: string | undefined, acceptLanguage: string | null): Locale {
  if (cookieLocale && (SUPPORTED_LOCALES as readonly string[]).includes(cookieLocale)) {
    return cookieLocale as Locale;
  }
  if (acceptLanguage) {
    const langs = acceptLanguage.split(',').map(p => p.trim().split(';')[0].toLowerCase());
    for (const lang of langs) {
      if (lang.startsWith('fr')) return 'fr';
      if (lang.startsWith('en')) return 'en';
    }
  }
  return DEFAULT_LOCALE;
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const acceptLanguage = headerStore.get('accept-language');
  const locale: Locale = detectLocale(cookieLocale, acceptLanguage);
  const messages = (await import(`../messages/${locale}.json`)).default;
  return { locale, messages };
});
