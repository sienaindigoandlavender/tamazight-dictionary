'use client';

import { AlphabetLetter } from '@/types';

interface AlphabetChartProps {
  letters: AlphabetLetter[];
}

export default function AlphabetChart({ letters }: AlphabetChartProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
      {letters.map((letter) => (
        <div
          key={letter.tifinagh}
          className="card text-center hover:border-foreground/30 transition-colors"
        >
          <div className="tifinagh text-4xl mb-3">
            {letter.tifinagh}
          </div>
          <div className="font-serif text-xl mb-1">{letter.latin}</div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">{letter.name}</div>
          <div className="text-xs text-muted-foreground mt-1">{letter.pronunciation}</div>
        </div>
      ))}
    </div>
  );
}
