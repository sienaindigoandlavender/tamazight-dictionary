import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Tamazight grammar — a reference for learners',
  description: 'Tamazight (Berber) grammar made clear: the sound system, roots and patterns, free vs. construct state, gender and number, pronouns, verb stems, and negation. Tachelhit examples throughout.',
  alternates: { canonical: 'https://tamazight.io/grammar' },
  openGraph: {
    title: 'Tamazight Grammar — A reference for learners',
    description: 'The sound system, roots and patterns, state, verbs, and negation. Tachelhit examples.',
  },
};

const NAV: [string, string][] = [
  ['#sounds', 'Sound system'],
  ['#roots', 'Roots & patterns'],
  ['#state', 'Free & construct state'],
  ['#gender', 'Gender & number'],
  ['#pronouns', 'Pronouns'],
  ['#verbs', 'Verb stems'],
  ['#negation', 'Negation'],
];

export default function GrammarPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Tamazight Grammar Reference',
    description: 'Reference grammar of Tamazight (Berber), focused on Tachelhit. Covers phonology, root-and-pattern morphology, the state system, gender and number, pronouns, verb stems, and negation.',
    provider: { '@type': 'Organization', name: 'Dancing with Lions', url: 'https://dancingwiththelions.com' },
    inLanguage: ['zgh', 'shi', 'en'],
    teaches: 'Tamazight (Berber) grammar',
    isAccessibleForFree: true,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div>
        <section className="px-6 md:px-[8%] lg:px-[12%] pt-20 pb-16">
          <Link
            href="/"
            className="text-sm text-neutral-500 hover:text-foreground transition-colors mb-8 inline-block"
          >
            ← Back to dictionary
          </Link>
          <p className="text-[#c53a1a] text-xs font-medium uppercase tracking-[0.3em] mb-4">Reference</p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.9] mb-8 tracking-tight">
            The grammar<br />of <em>Tamazight</em>
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-lg max-w-2xl leading-relaxed">
            Berber languages share a deep structural unity. This guide covers Tachelhit — spoken across the Souss in southern Morocco — but the patterns generalise to Kabyle, Tarifit, Central Atlas Tamazight, and Tuareg with predictable shifts.
          </p>
        </section>

        <nav className="px-6 md:px-[8%] lg:px-[12%] py-5 border-y border-neutral-100 dark:border-white/10 sticky top-14 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur z-30">
          <div className="flex flex-wrap gap-x-7 gap-y-2 text-sm">
            {NAV.map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="text-neutral-500 dark:text-neutral-400 hover:text-[#c53a1a] transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </nav>

        <section id="sounds" className="px-6 md:px-[8%] lg:px-[12%] py-20">
          <h2 className="font-display text-4xl md:text-5xl mb-6 tracking-tight">The sound system</h2>
          <p className="text-foreground text-lg max-w-3xl leading-relaxed mb-12">
            Tamazight has three short vowels — <em>a</em>, <em>i</em>, <em>u</em> — and a colour-changing schwa that often goes unwritten. The interesting part is the consonants: a full set of <strong>emphatics</strong> (heavy, throat-thickened versions of plain consonants) and the two <strong>pharyngeals</strong> Berber shares with Arabic.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full max-w-4xl border-collapse">
              <thead>
                <tr className="border-b-2 border-foreground">
                  <th className="text-left py-4 pr-6 text-xs uppercase tracking-[0.2em] text-neutral-500">Letter</th>
                  <th className="text-left py-4 pr-6 text-xs uppercase tracking-[0.2em] text-neutral-500">Tifinagh</th>
                  <th className="text-left py-4 pr-6 text-xs uppercase tracking-[0.2em] text-neutral-500">IPA</th>
                  <th className="text-left py-4 text-xs uppercase tracking-[0.2em] text-neutral-500">How to say it</th>
                </tr>
              </thead>
              <tbody className="text-sm md:text-base">
                {[
                  ['ḥ', 'ⵃ', '/ħ/', 'A breathy, forceful H from deep in the throat. Push harder than English H.'],
                  ['ε', 'ⵄ', '/ʕ/', 'Voiced pharyngeal squeeze. Tighten the back of the throat as if gagging gently — the signature sound.'],
                  ['ḍ', 'ⴹ', '/dˤ/', 'Heavy D. Tongue pressed flat against the palate; the vowel beside it darkens.'],
                  ['ṭ', 'ⵟ', '/tˤ/', 'Heavy T, same flat-tongue posture as ḍ.'],
                  ['ṣ', 'ⵚ', '/sˤ/', 'Heavy S — thick and dark next to plain S.'],
                  ['ẓ', 'ⵥ', '/zˤ/', 'Heavy Z, with the same emphatic colouring.'],
                  ['x', 'ⵅ', '/x/', 'Like Scottish loch or German Bach — voiceless velar fricative.'],
                  ['ɣ / gh', 'ⵖ', '/ɣ/', 'Voiced version of x. The Parisian R; a soft gargle at the back of the throat.'],
                  ['q', 'ⵇ', '/q/', 'Deep K from the very back of the mouth, almost a click.'],
                ].map(([latin, tifi, ipa, how], i) => (
                  <tr key={latin} className={`border-b border-neutral-100 dark:border-white/10 ${i % 2 === 0 ? 'bg-neutral-50/50 dark:bg-white/[0.02]' : ''}`}>
                    <td className="py-4 pr-6 font-display text-2xl text-[#c53a1a]">{latin}</td>
                    <td className="py-4 pr-6 tifinagh text-2xl">{tifi}</td>
                    <td className="py-4 pr-6 font-mono text-sm text-neutral-500">{ipa}</td>
                    <td className="py-4 text-neutral-700 dark:text-neutral-300 leading-relaxed">{how}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 border-l-2 border-[#d4931a] pl-6 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-[#d4931a] mb-2">Note on doubling</p>
            <p className="text-foreground leading-relaxed">
              Doubled consonants (<em>tt</em>, <em>nn</em>, <em>ddu</em>) are <strong>tense</strong> — held longer, sometimes phonemically distinct from the single. <Link href="/dictionary/yemma" className="underline decoration-dotted underline-offset-4 hover:text-[#c53a1a]"><em>yemma</em></Link> &ldquo;mother&rdquo; differs from a hypothetical *<em>yema</em> in this length.
            </p>
          </div>
        </section>

        <section id="roots" className="px-6 md:px-[8%] lg:px-[12%] py-20 bg-neutral-50/60 dark:bg-white/[0.02]">
          <h2 className="font-display text-4xl md:text-5xl mb-6 tracking-tight">Roots &amp; patterns</h2>
          <p className="text-foreground text-lg max-w-3xl leading-relaxed mb-6">
            Like Arabic and Hebrew, Tamazight is a <strong>root-and-pattern</strong> language. A core meaning lives in 2–3 consonants — the <em>root</em> — and words are built by inserting vowels and affixes around that skeleton.
          </p>
          <p className="text-foreground text-lg max-w-3xl leading-relaxed mb-12">
            Once you see the pattern, families of related words click into place. The dictionary records the root for most entries, so you can navigate from one form to all its relatives.
          </p>

          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4">Example root</p>
            <p className="font-display text-3xl mb-6">
              √<span className="text-[#c53a1a]">k</span>–<span className="text-[#c53a1a]">r</span>–<span className="text-[#c53a1a]">z</span>
              <span className="text-neutral-500 text-xl ml-4">— ploughing, working the land</span>
            </p>

            <ul className="divide-y divide-neutral-200 dark:divide-white/10 border-y border-neutral-200 dark:border-white/10">
              {[
                ['krz', 'ⴽⵔⵣ', 'to plough'],
                ['akraz', 'ⴰⴽⵔⴰⵣ', 'a ploughing, the act of working land'],
                ['amkraz', 'ⴰⵎⴽⵔⴰⵣ', 'ploughman'],
                ['tikerza', 'ⵜⵉⴽⴻⵔⵣⴰ', 'cultivation, agriculture'],
              ].map(([form, tifi, gloss]) => (
                <li key={form} className="flex items-baseline gap-4 py-3 flex-wrap">
                  <span className="font-display text-xl text-foreground w-32">{form}</span>
                  <span className="tifinagh text-xl text-[#c53a1a] w-32">{tifi}</span>
                  <span className="text-neutral-700 dark:text-neutral-300">{gloss}</span>
                </li>
              ))}
            </ul>

            <p className="text-sm text-neutral-500 mt-6 leading-relaxed">
              Three consonants, four words. The <em>a–a</em> pattern between them marks an action-noun (<em>akraz</em>); the <em>am-</em> prefix marks an agent (<em>amkraz</em>); the <em>ti-</em>…<em>-a</em> circumfix marks an abstract feminine noun (<em>tikerza</em>). The same templates apply across thousands of roots.
            </p>
          </div>
        </section>

        <section id="state" className="px-6 md:px-[8%] lg:px-[12%] py-20">
          <h2 className="font-display text-4xl md:text-5xl mb-6 tracking-tight">Free &amp; construct state</h2>
          <p className="text-foreground text-lg max-w-3xl leading-relaxed mb-6">
            Berber nouns appear in two forms — the <strong>free state</strong> (<em>état libre</em>) and the <strong>construct state</strong> (<em>état d&rsquo;annexion</em>). The choice depends on syntactic position, not meaning. This is one of the most distinctive features of the family.
          </p>
          <p className="text-foreground text-lg max-w-3xl leading-relaxed mb-12">
            <strong>Free state</strong> is the citation form — what the dictionary lists. Use it for direct objects, topicalised subjects (before the verb), and isolated nouns. <strong>Construct state</strong> kicks in after a preposition, after a number, and for the subject when it follows the verb.
          </p>

          <div className="overflow-x-auto mb-10">
            <table className="w-full max-w-3xl border-collapse">
              <thead>
                <tr className="border-b-2 border-foreground">
                  <th className="text-left py-4 pr-6 text-xs uppercase tracking-[0.2em] text-neutral-500">Class</th>
                  <th className="text-left py-4 pr-6 text-xs uppercase tracking-[0.2em] text-neutral-500">Free</th>
                  <th className="text-left py-4 pr-6 text-xs uppercase tracking-[0.2em] text-neutral-500">Construct</th>
                  <th className="text-left py-4 text-xs uppercase tracking-[0.2em] text-neutral-500">Example</th>
                </tr>
              </thead>
              <tbody className="text-sm md:text-base">
                {[
                  ['Masc. sg.', 'a–', 'u–', 'argaz → urgaz "man"'],
                  ['Masc. pl.', 'i–', 'i– / y–', 'irgazn → yirgazn "men"'],
                  ['Fem. sg.', 'ta–…–t', 't–…–t', 'tamghart → tmghart "woman"'],
                  ['Fem. pl.', 'ti–…–in', 't–…–in', 'tifrxin → tfrxin "girls"'],
                ].map(([cls, free, con, ex], i) => (
                  <tr key={cls} className={`border-b border-neutral-100 dark:border-white/10 ${i % 2 === 0 ? 'bg-neutral-50/50 dark:bg-white/[0.02]' : ''}`}>
                    <td className="py-4 pr-6 text-neutral-500">{cls}</td>
                    <td className="py-4 pr-6 font-display text-lg">{free}</td>
                    <td className="py-4 pr-6 font-display text-lg text-[#c53a1a]">{con}</td>
                    <td className="py-4 text-neutral-700 dark:text-neutral-300">{ex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="max-w-3xl space-y-5">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-2">In a sentence</p>
            <div className="border-l-2 border-neutral-200 dark:border-white/10 pl-5">
              <p className="font-display text-lg mb-1">
                <Link href="/dictionary/argaz" className="underline decoration-dotted underline-offset-4 hover:text-[#c53a1a]"><em>argaz</em></Link> iddu
              </p>
              <p className="text-neutral-500 text-sm">&ldquo;The man, he went&rdquo; — subject before the verb, free state.</p>
            </div>
            <div className="border-l-2 border-[#c53a1a] pl-5">
              <p className="font-display text-lg mb-1">iddu <em className="text-[#c53a1a]">urgaz</em></p>
              <p className="text-neutral-500 text-sm">&ldquo;The man went&rdquo; — subject after the verb, construct state.</p>
            </div>
          </div>
        </section>

        <section id="gender" className="px-6 md:px-[8%] lg:px-[12%] py-20 bg-neutral-50/60 dark:bg-white/[0.02]">
          <h2 className="font-display text-4xl md:text-5xl mb-6 tracking-tight">Gender &amp; number</h2>
          <p className="text-foreground text-lg max-w-3xl leading-relaxed mb-6">
            Two genders, three numbers (singular, plural — and some traces of the dual in numerals). Gender is largely visible in the noun&rsquo;s shell.
          </p>
          <p className="text-foreground text-lg max-w-3xl leading-relaxed mb-12">
            <strong>Masculine</strong> nouns typically begin with <em>a-</em>, <em>i-</em>, or <em>u-</em>. <strong>Feminine</strong> nouns are wrapped in the circumfix <em>ta-</em>…<em>-t</em> (or <em>ti-</em>…<em>-in</em> in the plural). Plurals split between sound endings and broken (internal vowel-change) plurals — many are idiosyncratic and worth memorising as pairs.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full max-w-3xl border-collapse">
              <thead>
                <tr className="border-b-2 border-foreground">
                  <th className="text-left py-4 pr-6 text-xs uppercase tracking-[0.2em] text-neutral-500">Singular</th>
                  <th className="text-left py-4 pr-6 text-xs uppercase tracking-[0.2em] text-neutral-500">Plural</th>
                  <th className="text-left py-4 pr-6 text-xs uppercase tracking-[0.2em] text-neutral-500">Gloss</th>
                  <th className="text-left py-4 text-xs uppercase tracking-[0.2em] text-neutral-500">Pattern</th>
                </tr>
              </thead>
              <tbody className="text-sm md:text-base">
                {[
                  ['argaz', 'irgazn', 'man / men', 'broken'],
                  ['afus', 'ifassn', 'hand / hands', 'broken'],
                  ['adrar', 'idraren', 'mountain / mountains', 'broken'],
                  ['tamghart', 'tilemgharin', 'woman / women', 'broken (fem.)'],
                  ['tafrukht', 'tifrxin', 'girl / girls', 'sound (fem. -in)'],
                  ['ass', 'ussan', 'day / days', 'broken'],
                ].map(([sg, pl, gloss, pat]) => (
                  <tr key={sg} className="border-b border-neutral-100 dark:border-white/10">
                    <td className="py-4 pr-6 font-display text-lg">{sg}</td>
                    <td className="py-4 pr-6 font-display text-lg text-[#c53a1a]">{pl}</td>
                    <td className="py-4 pr-6 text-neutral-700 dark:text-neutral-300">{gloss}</td>
                    <td className="py-4 text-neutral-500 text-sm">{pat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="pronouns" className="px-6 md:px-[8%] lg:px-[12%] py-20">
          <h2 className="font-display text-4xl md:text-5xl mb-6 tracking-tight">Pronouns</h2>
          <p className="text-foreground text-lg max-w-3xl leading-relaxed mb-12">
            Tamazight distinguishes <strong>independent</strong> pronouns (used for emphasis or topicalisation) from <strong>clitic</strong> sets that attach to verbs (object), to nouns (possessor), and to prepositions. Eight persons total — there&rsquo;s no formal/informal &ldquo;you&rdquo;.
          </p>

          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4">Independent</p>
              <table className="w-full">
                <tbody className="text-sm md:text-base">
                  {[
                    ['I', 'nkki'],
                    ['you (m. sg.)', 'kiyy'],
                    ['you (f. sg.)', 'kmmi'],
                    ['he', 'ntta'],
                    ['she', 'nttat'],
                    ['we', 'nkkni'],
                    ['you (pl. m.)', 'kunni'],
                    ['you (pl. f.)', 'kunninti'],
                    ['they (m.)', 'nttni'],
                    ['they (f.)', 'nttenti'],
                  ].map(([en, tmz]) => (
                    <tr key={en} className="border-b border-neutral-100 dark:border-white/10">
                      <td className="py-3 pr-6 text-neutral-500">{en}</td>
                      <td className="py-3 font-display text-lg">{tmz}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4">Object suffix (on verbs)</p>
              <table className="w-full">
                <tbody className="text-sm md:text-base">
                  {[
                    ['me', '-i / -yi'],
                    ['you (m. sg.)', '-k'],
                    ['you (f. sg.)', '-m'],
                    ['him', '-t'],
                    ['her', '-tt'],
                    ['us', '-agh'],
                    ['you (pl. m.)', '-kn'],
                    ['you (pl. f.)', '-knt'],
                    ['them (m.)', '-tn'],
                    ['them (f.)', '-tnt'],
                  ].map(([en, tmz]) => (
                    <tr key={en} className="border-b border-neutral-100 dark:border-white/10">
                      <td className="py-3 pr-6 text-neutral-500">{en}</td>
                      <td className="py-3 font-display text-lg text-[#c53a1a]">{tmz}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-sm text-neutral-500 mt-10 max-w-3xl leading-relaxed">
            Possessive clitics attach to the noun directly or via the linker <em>n</em>: <em>afus inu</em> &ldquo;my hand&rdquo;, <em>afus nnk</em> &ldquo;your (m.) hand&rdquo;, <em>afus nns</em> &ldquo;his/her hand&rdquo;.
          </p>
        </section>

        <section id="verbs" className="px-6 md:px-[8%] lg:px-[12%] py-20 bg-neutral-50/60 dark:bg-white/[0.02]">
          <h2 className="font-display text-4xl md:text-5xl mb-6 tracking-tight">Verb stems</h2>
          <p className="text-foreground text-lg max-w-3xl leading-relaxed mb-6">
            A Tamazight verb has four <strong>stems</strong> derived from the root, each carrying an aspect rather than a tense. Time is supplied by particles or context; aspect — whether the action is ongoing, completed, or generic — is fused into the stem itself.
          </p>
          <p className="text-foreground text-lg max-w-3xl leading-relaxed mb-12">
            Personal markers (subject prefixes and suffixes) attach to whichever stem the aspect calls for.
          </p>

          <div className="overflow-x-auto mb-10">
            <table className="w-full max-w-4xl border-collapse">
              <thead>
                <tr className="border-b-2 border-foreground">
                  <th className="text-left py-4 pr-6 text-xs uppercase tracking-[0.2em] text-neutral-500">Stem</th>
                  <th className="text-left py-4 pr-6 text-xs uppercase tracking-[0.2em] text-neutral-500">Aspect</th>
                  <th className="text-left py-4 text-xs uppercase tracking-[0.2em] text-neutral-500">When to reach for it</th>
                </tr>
              </thead>
              <tbody className="text-sm md:text-base">
                {[
                  ['Aorist', 'Bare / unmarked', 'Generic, future, after irreal particles. The dictionary citation form.'],
                  ['Perfective', 'Completed', 'Past events seen as a whole. Often introduced by an i- or u- vowel.'],
                  ['Imperfective', 'Ongoing / habitual', 'Repeated or continuous action. Marked by tt-, ttu-, or by stem reshaping.'],
                  ['Negative perfective', 'Negated past', 'Required after ur … ara when the action is completed.'],
                ].map(([stem, asp, when]) => (
                  <tr key={stem} className="border-b border-neutral-100 dark:border-white/10">
                    <td className="py-4 pr-6 font-display text-lg text-[#c53a1a]">{stem}</td>
                    <td className="py-4 pr-6 text-neutral-700 dark:text-neutral-300">{asp}</td>
                    <td className="py-4 text-neutral-500 leading-relaxed">{when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4">
              Example — <Link href="/conjugation/ddu" className="underline decoration-dotted underline-offset-4 hover:text-[#c53a1a]">ddu</Link> &ldquo;to go&rdquo; (perfective)
            </p>
            <table className="w-full max-w-md">
              <tbody className="text-sm md:text-base">
                {[
                  ['I went', 'ddu-ɣ'],
                  ['you (sg.) went', 't-ddu-t'],
                  ['he went', 'i-ddu'],
                  ['she went', 't-ddu'],
                  ['we went', 'n-ddu'],
                  ['you (pl. m.) went', 't-ddu-m'],
                  ['they (m.) went', 'ddu-n'],
                  ['they (f.) went', 'ddu-nt'],
                ].map(([en, form]) => (
                  <tr key={en} className="border-b border-neutral-100 dark:border-white/10">
                    <td className="py-3 pr-6 text-neutral-500">{en}</td>
                    <td className="py-3 font-display text-lg">{form}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-sm text-neutral-500 mt-4 leading-relaxed">
              Notice the <strong>discontinuous</strong> 2nd-person markers — a <em>t-</em> at the start <em>and</em> a suffix at the end. This circumfixal pattern recurs across the verb system. See more in the <Link href="/conjugation" className="underline decoration-dotted underline-offset-4 hover:text-[#c53a1a]">conjugation tables</Link>.
            </p>
          </div>
        </section>

        <section id="negation" className="px-6 md:px-[8%] lg:px-[12%] py-20">
          <h2 className="font-display text-4xl md:text-5xl mb-6 tracking-tight">Negation</h2>
          <p className="text-foreground text-lg max-w-3xl leading-relaxed mb-6">
            Negation is a <strong>circumfix</strong>: <em>ur</em> in front of the verb, <em>ara</em> after it. The verb between them takes the negative perfective stem.
          </p>
          <p className="text-foreground text-lg max-w-3xl leading-relaxed mb-12">
            This pattern — a particle on each side of the verb — is shared with French (<em>ne… pas</em>) and Maghrebi Arabic (<em>ma… ši</em>). It&rsquo;s a regional feature that crosses language families across North Africa.
          </p>

          <div className="max-w-3xl space-y-6">
            <div className="border-l-2 border-neutral-200 dark:border-white/10 pl-5">
              <p className="font-display text-lg mb-1">iddu</p>
              <p className="text-neutral-500 text-sm">&ldquo;he went&rdquo;</p>
            </div>
            <div className="border-l-2 border-[#c53a1a] pl-5">
              <p className="font-display text-lg mb-1">
                <em className="text-[#c53a1a]">ur</em> iddi <em className="text-[#c53a1a]">ara</em>
              </p>
              <p className="text-neutral-500 text-sm">&ldquo;he didn&rsquo;t go&rdquo; — the verb shifts to the negative perfective stem (<em>iddi</em> instead of <em>iddu</em>).</p>
            </div>
            <div className="border-l-2 border-neutral-200 dark:border-white/10 pl-5">
              <p className="font-display text-lg mb-1">ittili</p>
              <p className="text-neutral-500 text-sm">&ldquo;he is, becomes&rdquo;</p>
            </div>
            <div className="border-l-2 border-[#c53a1a] pl-5">
              <p className="font-display text-lg mb-1">
                <em className="text-[#c53a1a]">ur</em> ittili <em className="text-[#c53a1a]">ara</em>
              </p>
              <p className="text-neutral-500 text-sm">&ldquo;he isn&rsquo;t, doesn&rsquo;t become&rdquo;.</p>
            </div>
          </div>

          <div className="mt-12 border-l-2 border-[#d4931a] pl-6 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-[#d4931a] mb-2">In conversation</p>
            <p className="text-foreground leading-relaxed">
              Some Tachelhit varieties weaken the second particle, dropping <em>ara</em> in fast speech and relying on intonation. Both forms are accepted; the full <em>ur … ara</em> reads as more careful.
            </p>
          </div>
        </section>

        <section className="px-6 md:px-[8%] lg:px-[12%] py-20 border-t border-neutral-100 dark:border-white/10 text-center">
          <p className="font-display text-3xl md:text-4xl mb-3 tracking-tight">Take it from here</p>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8 max-w-xl mx-auto">
            See the patterns at work in real entries, or drill the essentials with flashcards.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/first-day"
              className="px-6 py-3 bg-foreground text-background text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              First-day words
            </Link>
            <Link
              href="/practice"
              className="px-6 py-3 border border-foreground text-foreground text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
            >
              Practice flashcards
            </Link>
          </div>
        </section>

      </div>
    </>
  );
}
