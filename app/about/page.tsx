import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About - Amawal Tamazight Dictionary',
  description: 'Learn about the Tamazight language, Amazigh culture, and the mission behind the Amawal dictionary project.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-20">
        <p className="section-subtitle mb-6">The Project</p>
        <h1 className="tifinagh text-6xl md:text-8xl mb-6">ⵜⴰⵎⴰⵣⵉⵖⵜ</h1>
        <h2 className="section-title mb-6">About Amawal</h2>
        <p className="text-muted-foreground">
          Preserving and promoting the Tamazight language
        </p>
      </div>

      {/* Mission */}
      <section className="mb-16">
        <p className="section-subtitle mb-4">Mission</p>
        <h3 className="font-serif text-3xl mb-6">Our Purpose</h3>
        <div className="space-y-4 text-muted-foreground">
          <p>
            <strong className="text-foreground">Amawal</strong> (ⴰⵎⴰⵡⴰⵍ), meaning &ldquo;dictionary&rdquo; in Tamazight,
            is dedicated to making the Tamazight language accessible to learners worldwide. This project is part
            of the larger <strong className="text-foreground">Amazigh Series</strong>, celebrating and preserving
            Amazigh culture and heritage.
          </p>
          <p>
            We started with <strong className="text-foreground">Tachelhit</strong>, the most widely spoken Tamazight
            variant in Morocco, and plan to expand to cover other regional varieties.
          </p>
        </div>
      </section>

      {/* About Tamazight */}
      <section className="mb-16 border-t border-foreground/10 pt-16">
        <p className="section-subtitle mb-4">The Language</p>
        <h3 className="font-serif text-3xl mb-6">About Tamazight</h3>
        <div className="space-y-4 text-muted-foreground">
          <p>
            <strong className="text-foreground">Tamazight</strong> (ⵜⴰⵎⴰⵣⵉⵖⵜ) is a family of closely related
            Berber languages spoken by the Amazigh people across North Africa—from Morocco and Algeria to Libya,
            Tunisia, Mali, and Niger.
          </p>
          <p>
            With an estimated 30-40 million speakers, it represents one of Africa&apos;s oldest living language
            families. Today, Tamazight holds official language status in both Morocco (since 2011) and Algeria (since 2016).
          </p>
        </div>
      </section>

      {/* Regional Varieties */}
      <section className="mb-16 border-t border-foreground/10 pt-16">
        <p className="section-subtitle mb-4">Varieties</p>
        <h3 className="font-serif text-3xl mb-8">Regional Dialects</h3>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="card">
            <h4 className="font-serif text-xl mb-2">Tachelhit</h4>
            <p className="text-sm text-muted-foreground">
              Southern Morocco. ~8 million speakers. Currently featured in Amawal.
            </p>
          </div>
          <div className="card opacity-60">
            <h4 className="font-serif text-xl mb-2">Kabyle</h4>
            <p className="text-sm text-muted-foreground">
              Kabylie region, Algeria. ~5 million speakers. Coming soon.
            </p>
          </div>
          <div className="card opacity-60">
            <h4 className="font-serif text-xl mb-2">Tarifit</h4>
            <p className="text-sm text-muted-foreground">
              Rif mountains, Northern Morocco. ~4 million speakers. Coming soon.
            </p>
          </div>
          <div className="card opacity-60">
            <h4 className="font-serif text-xl mb-2">Central Atlas</h4>
            <p className="text-sm text-muted-foreground">
              Central Morocco. ~3 million speakers. Coming soon.
            </p>
          </div>
        </div>
      </section>

      {/* Tifinagh */}
      <section className="mb-16 border-t border-foreground/10 pt-16">
        <p className="section-subtitle mb-4">The Script</p>
        <h3 className="font-serif text-3xl mb-6">Tifinagh</h3>
        <div className="space-y-4 text-muted-foreground">
          <p>
            <strong className="text-foreground">Tifinagh</strong> (ⵜⵉⴼⵉⵏⴰⵖ) is one of the oldest alphabets still
            in use. Its origins trace back over 2,500 years to the ancient Libyco-Berber inscriptions found across
            the Sahara.
          </p>
          <div className="text-center py-8">
            <span className="tifinagh text-3xl md:text-4xl tracking-wider">
              ⴰⴱⴳⴳⵯⴷⴹⴻⴼⴽⴽⵯⵀⵃⵄⵅⵇⵉⵊⵍⵎⵏⵓⵔⵕⵖⵙⵚⵛⵜⵟⵡⵢⵣⵥ
            </span>
          </div>
          <p className="text-center">
            <Link href="/alphabet" className="nav-link">
              Learn the complete alphabet →
            </Link>
          </p>
        </div>
      </section>

      {/* The Amazigh Series */}
      <section className="border-t border-foreground/10 pt-16">
        <p className="section-subtitle mb-4">The Series</p>
        <h3 className="font-serif text-3xl mb-6">Amazigh Series</h3>
        <div className="space-y-4 text-muted-foreground mb-8">
          <p>
            Amawal is the first project in the <strong className="text-foreground">Amazigh Series</strong>,
            a collection of tools and resources dedicated to Amazigh language and culture.
          </p>
        </div>
        <div className="text-center py-8">
          <p className="tifinagh text-3xl mb-2">ⴰⵣⵓⵍ ⴼⵍⵍⴰⵡⵏ</p>
          <p className="text-sm text-muted-foreground italic">
            &ldquo;Greetings to you all&rdquo;
          </p>
        </div>
      </section>

      {/* Back Link */}
      <div className="mt-16 text-center">
        <Link href="/" className="nav-link">
          ← Back to Dictionary
        </Link>
      </div>
    </div>
  );
}
