import { DictionaryEntry, Region, Language, SemanticField } from '@/types';
import tachelhitData from '@/data/dictionary/tachelhit.json';
import tachelhitEnhancedData from '@/data/dictionary/tachelhit-enhanced.json';
import firstDayData from '@/data/first-day.json';
import howToSayData from '@/data/how-to-say.json';

// Merge entries: enhanced entries override basic ones by ID
function mergeEntries(basic: DictionaryEntry[], enhanced: DictionaryEntry[]): DictionaryEntry[] {
  const entriesMap = new Map<string, DictionaryEntry>();

  // Add basic entries first
  basic.forEach(entry => entriesMap.set(entry.id, entry));

  // Override with enhanced entries
  enhanced.forEach(entry => entriesMap.set(entry.id, entry));

  return Array.from(entriesMap.values());
}

const dictionaryCache: Record<Region, DictionaryEntry[]> = {
  tachelhit: mergeEntries(tachelhitData as DictionaryEntry[], tachelhitEnhancedData as DictionaryEntry[]),
  kabyle: [],
  tarifit: [],
  'central-atlas': [],
  tuareg: [],
  zenaga: [],
  ghomara: [],
};

export function getAllEntries(region: Region = 'tachelhit'): DictionaryEntry[] {
  return dictionaryCache[region] || [];
}

export function getEntryById(id: string, region: Region = 'tachelhit'): DictionaryEntry | undefined {
  const entries = getAllEntries(region);
  return entries.find(entry => entry.id === id);
}

export function getEntryByWord(word: string, region: Region = 'tachelhit'): DictionaryEntry | undefined {
  const entries = getAllEntries(region);
  return entries.find(entry =>
    entry.word.toLowerCase() === word.toLowerCase() ||
    entry.tifinagh === word
  );
}

export function searchEntries(query: string, region: Region = 'tachelhit'): DictionaryEntry[] {
  if (!query || query.trim().length === 0) return [];

  const entries = getAllEntries(region);
  const lowerQuery = query.toLowerCase().trim();

  // Score-based search for better relevance ranking
  const results = entries.map(entry => {
    let score = 0;

    // Exact match on Tamazight word (highest priority)
    if (entry.word.toLowerCase() === lowerQuery) score += 100;
    else if (entry.word.toLowerCase().startsWith(lowerQuery)) score += 50;
    else if (entry.word.toLowerCase().includes(lowerQuery)) score += 20;

    // Match by Tifinagh
    if (entry.tifinagh === query) score += 100;
    else if (entry.tifinagh.includes(query)) score += 30;

    // Match by definition in any language (reverse lookup)
    entry.definitions.forEach(def => {
      if (def.meaning.toLowerCase() === lowerQuery) score += 80;
      else if (def.meaning.toLowerCase().startsWith(lowerQuery)) score += 40;
      else if (def.meaning.toLowerCase().includes(lowerQuery)) score += 15;
    });

    // Match by plural form
    if (entry.plural?.toLowerCase() === lowerQuery) score += 60;
    else if (entry.plural?.toLowerCase().includes(lowerQuery)) score += 10;

    // Match by root (for morphological search)
    if (entry.morphology?.root?.toLowerCase() === lowerQuery) score += 70;
    if (entry.etymology?.root?.toLowerCase() === lowerQuery) score += 70;

    return { entry, score };
  });

  return results
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(r => r.entry);
}

// Reverse lookup: search by translation in a specific language
export function searchByLanguage(
  query: string,
  language: Language,
  region: Region = 'tachelhit'
): DictionaryEntry[] {
  if (!query || query.trim().length === 0) return [];

  const entries = getAllEntries(region);
  const lowerQuery = query.toLowerCase().trim();

  return entries.filter(entry =>
    entry.definitions.some(
      def => def.language === language && def.meaning.toLowerCase().includes(lowerQuery)
    )
  );
}

export function getEntriesByPartOfSpeech(
  partOfSpeech: DictionaryEntry['partOfSpeech'],
  region: Region = 'tachelhit'
): DictionaryEntry[] {
  return getAllEntries(region).filter(entry => entry.partOfSpeech === partOfSpeech);
}

export function getEntriesBySemanticField(
  field: SemanticField,
  region: Region = 'tachelhit'
): DictionaryEntry[] {
  return getAllEntries(region).filter(
    entry => entry.semanticFields?.includes(field)
  );
}

export function getRelatedEntries(entry: DictionaryEntry, region: Region = 'tachelhit'): DictionaryEntry[] {
  if (!entry.relatedWords || entry.relatedWords.length === 0) return [];

  const entries = getAllEntries(region);
  return entries.filter(e => entry.relatedWords?.includes(e.word));
}

// Get entries from cross-references
export function getCrossReferencedEntries(
  entry: DictionaryEntry,
  region: Region = 'tachelhit'
): { type: string; entry: DictionaryEntry; notes?: string }[] {
  if (!entry.crossReferences || entry.crossReferences.length === 0) return [];

  const entries = getAllEntries(region);
  return entry.crossReferences
    .map(ref => {
      const foundEntry = entries.find(e => e.id === ref.wordId || e.word === ref.word);
      if (!foundEntry) return null;
      return { type: ref.type, entry: foundEntry, notes: ref.notes };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
}

// Get entries by root (morphological search)
export function getEntriesByRoot(root: string, region: Region = 'tachelhit'): DictionaryEntry[] {
  const lowerRoot = root.toLowerCase();
  return getAllEntries(region).filter(
    entry =>
      entry.morphology?.root?.toLowerCase() === lowerRoot ||
      entry.etymology?.root?.toLowerCase() === lowerRoot
  );
}

export function getRandomEntries(count: number = 5, region: Region = 'tachelhit'): DictionaryEntry[] {
  const entries = getAllEntries(region);
  const shuffled = [...entries].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Curated "first day" essentials — grouped sections, looked up against
// the live dictionary so a slug typo is dropped silently rather than
// shipping a broken row.
export interface FirstDaySection {
  id: string;
  label: string;
  entries: DictionaryEntry[];
}

export function getFirstDaySections(region: Region = 'tachelhit'): FirstDaySection[] {
  const entries = getAllEntries(region);
  const byWord = new Map(entries.map(e => [e.word, e]));
  return (firstDayData.sections as { id: string; label: string; words: string[] }[])
    .map(s => ({
      id: s.id,
      label: s.label,
      entries: s.words.map(w => byWord.get(w)).filter((e): e is DictionaryEntry => Boolean(e)),
    }))
    .filter(s => s.entries.length > 0);
}

export function getFirstDayEntries(region: Region = 'tachelhit'): DictionaryEntry[] {
  return getFirstDaySections(region).flatMap(s => s.entries);
}

// "How to say X in Tamazight" — curated mapping of slug → dictionary
// entry. Used by the /how-to-say SEO surface.
export interface HowToSayTerm {
  slug: string;
  label: string;
  group: string;
  entry: DictionaryEntry;
}

export function getHowToSayTerms(region: Region = 'tachelhit'): HowToSayTerm[] {
  const byWord = new Map(getAllEntries(region).map(e => [e.word, e]));
  const out: HowToSayTerm[] = [];
  for (const g of (howToSayData.groups as { label: string; terms: { slug: string; label: string; word: string }[] }[])) {
    for (const t of g.terms) {
      const entry = byWord.get(t.word);
      if (entry) out.push({ slug: t.slug, label: t.label, group: g.label, entry });
    }
  }
  return out;
}

export function getHowToSayTerm(slug: string, region: Region = 'tachelhit'): HowToSayTerm | undefined {
  return getHowToSayTerms(region).find(t => t.slug === slug);
}

// Annotated lines from the oral and written tradition — proverbs,
// oral expressions, song, poetry, literature. Returned with their host
// entry so the home Wisdom section can link back into the dictionary.
export interface TraditionLine {
  entryWord: string;
  entryTifinagh: string;
  type: 'proverb' | 'oral' | 'song' | 'poetry' | 'literature';
  text: string;
  tifinagh: string;
  en?: string;
  fr?: string;
  attribution?: string;
}

export function getTraditionLines(region: Region = 'tachelhit'): TraditionLine[] {
  const allowed = new Set(['proverb', 'oral', 'song', 'poetry', 'literature']);
  const seen = new Set<string>();
  const out: TraditionLine[] = [];
  for (const e of getAllEntries(region)) {
    for (const ex of e.examples ?? []) {
      const t = ex.source?.type;
      if (!t || !allowed.has(t)) continue;
      const key = `${e.word}|${ex.text}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({
        entryWord: e.word,
        entryTifinagh: e.tifinagh,
        type: t as TraditionLine['type'],
        text: ex.text,
        tifinagh: ex.tifinagh,
        en: ex.translations?.find(tr => tr.language === 'en')?.text,
        fr: ex.translations?.find(tr => tr.language === 'fr')?.text,
        attribution: ex.source?.attribution,
      });
    }
  }
  return out;
}

// Entries rich enough to be a "word of the day" — at minimum a cultural
// note, otherwise a usage note, etymology note, or example.
export function getRichEntries(region: Region = 'tachelhit'): DictionaryEntry[] {
  const entries = getAllEntries(region);
  const cultural = entries.filter(e =>
    e.usageNotes?.some(u => u.type === 'cultural')
  );
  if (cultural.length > 0) return cultural;
  const withNotes = entries.filter(e =>
    e.usageNotes?.length || e.etymology?.notes || e.examples?.length
  );
  return withNotes.length > 0 ? withNotes : entries;
}

// Get all unique semantic fields in the dictionary
export function getAvailableSemanticFields(region: Region = 'tachelhit'): SemanticField[] {
  const entries = getAllEntries(region);
  const fields = new Set<SemanticField>();
  entries.forEach(entry => {
    entry.semanticFields?.forEach(field => fields.add(field));
  });
  return Array.from(fields).sort();
}
