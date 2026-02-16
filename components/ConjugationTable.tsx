import { VerbEntry, Conjugation } from '@/types';

interface ConjugationTableProps {
  verb: VerbEntry;
}

const pronounLabels: Record<string, string> = {
  '1s': 'I',
  '2s': 'You (sg.)',
  '3sm': 'He',
  '3sf': 'She',
  '1p': 'We',
  '2pm': 'You (pl. m.)',
  '2pf': 'You (pl. f.)',
  '3pm': 'They (m.)',
  '3pf': 'They (f.)',
  'singular': 'Singular',
  'plural': 'Plural',
};

function ConjugationSection({ title, conjugation }: { title: string; conjugation: Conjugation }) {
  const entries = Object.entries(conjugation).filter(([, value]) => value);

  if (entries.length === 0) return null;

  return (
    <div className="mb-12">
      <h4 className="section-subtitle mb-6">{title}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {entries.map(([key, value]) => (
          <div
            key={key}
            className="flex justify-between items-center py-3 px-4 border border-foreground/10"
          >
            <span className="text-sm text-muted-foreground">
              {pronounLabels[key] || key}
            </span>
            <span className="font-serif text-lg">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ConjugationTable({ verb }: ConjugationTableProps) {
  return (
    <div>
      <ConjugationSection title="Imperative" conjugation={verb.conjugations.imperative} />
      <ConjugationSection title="Aorist" conjugation={verb.conjugations.aorist} />
      <ConjugationSection title="Preterite" conjugation={verb.conjugations.preterite} />
      {verb.conjugations.negativePreterite && (
        <ConjugationSection title="Negative Preterite" conjugation={verb.conjugations.negativePreterite} />
      )}
      {verb.conjugations.intensive && (
        <ConjugationSection title="Intensive / Habitual" conjugation={verb.conjugations.intensive} />
      )}
    </div>
  );
}
