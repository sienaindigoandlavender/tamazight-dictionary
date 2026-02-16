import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Methodology - Amawal',
  description: 'Research methodology, sources, and ethical framework for the Amawal Tamazight Dictionary and Cultural Archive.',
};

export default function MethodologyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Header */}
      <header className="mb-16">
        <nav className="mb-8 text-xs uppercase tracking-widest text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Dictionary</Link>
          <span className="mx-3">/</span>
          <span className="text-foreground">Methodology</span>
        </nav>

        <h1 className="font-serif text-3xl md:text-4xl mb-4">Methodology</h1>
        <p className="text-muted-foreground">
          Research framework, sources, and principles
        </p>
      </header>

      {/* Content */}
      <article className="prose-custom">
        {/* Scope */}
        <section className="mb-12">
          <h2 className="section-subtitle mb-4">Scope and Intent</h2>
          <p className="text-sm leading-relaxed text-foreground/80 mb-4">
            Amawal is a structured reference archive for Tamazight languages and Amazigh cultural knowledge.
            It documents vocabulary, verb conjugation, regional variation, symbolic systems, and geographic
            distribution across North Africa.
          </p>
          <p className="text-sm leading-relaxed text-foreground/80 mb-4">
            This project does not claim totality. It does not represent all Amazigh experiences, communities,
            or perspectives. It is a partial record, openly acknowledged as such, focused on what can be
            documented with reasonable confidence from available sources.
          </p>
          <p className="text-sm leading-relaxed text-foreground/80">
            The archive prioritizes Tachelhit (Southern Morocco) as an initial foundation, with infrastructure
            designed to accommodate other Tamazight varieties as documentation permits.
          </p>
        </section>

        {/* Methodology */}
        <section className="mb-12">
          <h2 className="section-subtitle mb-4">Research Methodology</h2>
          <p className="text-sm leading-relaxed text-foreground/80 mb-4">
            All content derives from secondary sources: published dictionaries, academic literature,
            ethnographic studies, and publicly available linguistic documentation. No extractive fieldwork
            has been conducted. No voices have been fictionalized. No traditions have been invented.
          </p>
          <p className="text-sm leading-relaxed text-foreground/80 mb-4">
            The methodology emphasizes:
          </p>
          <ul className="text-sm leading-relaxed text-foreground/80 space-y-2 mb-4 ml-4">
            <li className="pl-2 border-l border-foreground/20">
              <strong>Regional differentiation</strong> — Meanings and usage are attributed to specific
              regions rather than collapsed into generic pan-Amazigh claims
            </li>
            <li className="pl-2 border-l border-foreground/20">
              <strong>Preservation of contradiction</strong> — Where sources disagree or communities
              offer multiple interpretations, these are recorded separately rather than synthesized
            </li>
            <li className="pl-2 border-l border-foreground/20">
              <strong>Source attribution</strong> — Entries cite their sources; confidence levels
              indicate data quality
            </li>
            <li className="pl-2 border-l border-foreground/20">
              <strong>Layered interpretation</strong> — For symbols and cultural content, documented
              academic findings, oral community interpretations, and contemporary readings are kept distinct
            </li>
          </ul>
          <p className="text-sm leading-relaxed text-foreground/80">
            This approach accepts incompleteness over false precision.
          </p>
        </section>

        {/* AI */}
        <section className="mb-12">
          <h2 className="section-subtitle mb-4">Use of AI</h2>
          <p className="text-sm leading-relaxed text-foreground/80 mb-4">
            AI tools are used in the development of this archive for structuring data, organizing reference
            material, and accelerating synthesis of documented sources. AI does not replace sources — it
            processes them.
          </p>
          <p className="text-sm leading-relaxed text-foreground/80">
            Human judgment governs all decisions regarding inclusion, framing, interpretation, and presentation.
            No content is generated without source basis. Where AI-generated audio is included (for pronunciation),
            it is explicitly labeled as such.
          </p>
        </section>

        {/* Ethics */}
        <section className="mb-12">
          <h2 className="section-subtitle mb-4">Ethical Framework</h2>
          <p className="text-sm leading-relaxed text-foreground/80 mb-4">
            This project operates under the following constraints:
          </p>
          <ul className="text-sm leading-relaxed text-foreground/80 space-y-2 mb-4 ml-4">
            <li className="pl-2 border-l border-foreground/20">
              The archive does not claim ownership of cultural knowledge
            </li>
            <li className="pl-2 border-l border-foreground/20">
              It does not speak for Amazigh communities
            </li>
            <li className="pl-2 border-l border-foreground/20">
              It does not commercialize sacred or restricted knowledge
            </li>
            <li className="pl-2 border-l border-foreground/20">
              It prioritizes context over simplification
            </li>
            <li className="pl-2 border-l border-foreground/20">
              It refuses mystification — symbols and practices are documented, not romanticized
            </li>
          </ul>
          <p className="text-sm leading-relaxed text-foreground/80">
            Where knowledge is sensitive, contested, or carries restrictions within communities,
            this is noted. Absence of documentation on certain topics may be deliberate.
          </p>
        </section>

        {/* Living nature */}
        <section className="mb-12">
          <h2 className="section-subtitle mb-4">Living Archive</h2>
          <p className="text-sm leading-relaxed text-foreground/80 mb-4">
            This archive is iterative. It will be revised, corrected, and expanded as sources improve
            and errors are identified. Knowledge documented here is provisional — a current best effort,
            not a final word.
          </p>
          <p className="text-sm leading-relaxed text-foreground/80">
            Gaps are acknowledged. Entries may be incomplete, regional coverage uneven, and certain
            topics underrepresented. This reflects the state of available documentation, not a judgment
            on what matters.
          </p>
        </section>

        {/* Citation */}
        <section className="mb-12 p-6 border border-foreground/10 bg-muted/5">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Citation</h2>
          <p className="text-sm leading-relaxed text-foreground/80 mb-2">
            If referencing this archive in academic or professional contexts:
          </p>
          <p className="text-sm font-mono bg-foreground/5 p-3 text-foreground/70">
            Amawal: Tamazight Dictionary and Cultural Archive. https://amawal.org. Accessed [date].
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="section-subtitle mb-4">Corrections and Contributions</h2>
          <p className="text-sm leading-relaxed text-foreground/80">
            Errors, omissions, and corrections may be submitted through the{' '}
            <Link href="/contact" className="underline hover:text-foreground">contact form</Link>.
            Contributions from scholars, native speakers, and community members are valued,
            particularly those that can provide regional specificity and source documentation.
          </p>
        </section>
      </article>

      {/* Back link */}
      <div className="mt-16 pt-8 border-t border-foreground/10">
        <Link href="/" className="nav-link">← Back to Dictionary</Link>
      </div>
    </div>
  );
}
