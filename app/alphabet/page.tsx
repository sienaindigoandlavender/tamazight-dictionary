import { Metadata } from 'next';
import AlphabetChart from '@/components/AlphabetChart';
import alphabetData from '@/data/alphabet.json';
import { AlphabetLetter } from '@/types';

export const metadata: Metadata = {
  title: 'Tifinagh Alphabet - Amawal Tamazight Dictionary',
  description: 'Learn the Tifinagh alphabet, the traditional script of the Amazigh (Berber) people. Complete chart with Latin equivalents and pronunciation guides.',
};

export default function AlphabetPage() {
  const letters = alphabetData as AlphabetLetter[];
  const vowels = letters.filter(l => ['a', 'e', 'i', 'u'].includes(l.latin));
  const consonants = letters.filter(l => !['a', 'e', 'i', 'u'].includes(l.latin));

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-20">
        <p className="section-subtitle mb-6">The Script</p>
        <h1 className="tifinagh text-6xl md:text-8xl mb-6">ⵜⵉⴼⵉⵏⴰⵖ</h1>
        <h2 className="section-title mb-6">Tifinagh Alphabet</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Tifinagh is one of the oldest alphabets in the world, used by Amazigh peoples across North Africa
          for thousands of years.
        </p>
      </div>

      {/* Vowels */}
      <section className="mb-20">
        <div className="mb-8">
          <p className="section-subtitle mb-2">Foundation</p>
          <h3 className="font-serif text-3xl">Vowels</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {vowels.map((letter) => (
            <div key={letter.tifinagh} className="card text-center">
              <div className="tifinagh text-5xl mb-4">{letter.tifinagh}</div>
              <div className="font-serif text-2xl mb-2">{letter.latin}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{letter.name}</div>
              <div className="text-xs text-muted-foreground mt-2">{letter.pronunciation}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Consonants */}
      <section className="mb-20">
        <div className="mb-8">
          <p className="section-subtitle mb-2">Core Letters</p>
          <h3 className="font-serif text-3xl">Consonants</h3>
        </div>
        <AlphabetChart letters={consonants} />
      </section>

      {/* History */}
      <section className="border-t border-foreground/10 pt-16">
        <div className="max-w-3xl">
          <p className="section-subtitle mb-4">History</p>
          <h3 className="font-serif text-3xl mb-8">About Tifinagh</h3>
          <div className="space-y-6 text-muted-foreground">
            <p>
              Tifinagh (ⵜⵉⴼⵉⵏⴰⵖ) is an ancient alphabetic script used by the Amazigh (Berber) peoples.
              Archaeological evidence suggests it dates back at least 2,500 years, with rock inscriptions
              found across the Sahara Desert.
            </p>
            <p>
              Today, the standardized Neo-Tifinagh is used in Morocco for official documents, education,
              and signage. Algeria also recognizes Tifinagh, and efforts continue to preserve and promote
              this cultural heritage across North Africa.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
