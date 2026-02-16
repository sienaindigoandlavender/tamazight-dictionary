import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SuggestCorrectionFloating } from "@/components/SuggestCorrection";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amawal.vercel.app';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  // Basic metadata
  title: {
    default: "Amawal - Tamazight Dictionary & Linguistic Atlas",
    template: "%s | Amawal",
  },
  description: "Comprehensive Tamazight dictionary featuring Tifinagh script, pronunciation, etymology, and an interactive linguistic atlas. Explore Tachelhit, Kabyle, Tarifit, and more Berber languages across North Africa.",
  keywords: [
    "Tamazight", "Tifinagh", "Amazigh", "Berber", "Tachelhit", "Kabyle", "Tarifit",
    "dictionary", "language", "North Africa", "Morocco", "Algeria", "linguistic atlas",
    "Berber language", "Amazigh dictionary", "learn Tamazight", "Tifinagh alphabet",
    "verb conjugation", "etymology", "pronunciation"
  ],
  authors: [{ name: "Amawal Project" }],
  creator: "Amawal Project",
  publisher: "Amawal Project",

  // OpenGraph
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["fr_FR", "ar_MA"],
    url: siteUrl,
    siteName: "Amawal",
    title: "Amawal - Tamazight Dictionary & Linguistic Atlas",
    description: "Explore Tamazight languages across North Africa. Search words in Tifinagh, learn pronunciation, and discover how language varies by region.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Amawal - Tamazight Dictionary featuring ⴰⵎⴰⵡⴰⵍ in Tifinagh script",
      },
    ],
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "Amawal - Tamazight Dictionary & Linguistic Atlas",
    description: "Explore Tamazight languages across North Africa with Tifinagh script, pronunciation, and etymology.",
    images: ["/og-image.png"],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },

  // Manifest
  manifest: "/manifest.json",

  // Verification (add your own IDs)
  // verification: {
  //   google: "your-google-verification-code",
  // },

  // Category
  category: "education",

  // Other
  other: {
    "msapplication-TileColor": "#ffffff",
  },
};

// JSON-LD structured data for the site
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Amawal",
  alternateName: "ⴰⵎⴰⵡⴰⵍ",
  url: siteUrl,
  description: "Comprehensive Tamazight dictionary and linguistic atlas featuring Tifinagh script, pronunciation, etymology, and dialect variations across North Africa.",
  inLanguage: ["en", "fr", "ar", "tzm"],
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}/dictionary/{search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Organization",
    name: "Amawal Project",
    url: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <ThemeProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <SuggestCorrectionFloating />
        </ThemeProvider>
      </body>
    </html>
  );
}
