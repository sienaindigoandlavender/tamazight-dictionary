import { DictionaryEntry, Region, Language, SemanticField } from '@/types';
import tachelhitData from '@/data/dictionary/tachelhit.json';
import tachelhitEnhancedData from '@/data/dictionary/tachelhit-enhanced.json';

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

// Get all unique semantic fields in the dictionary
export function getAvailableSemanticFields(region: Region = 'tachelhit'): SemanticField[] {
  const entries = getAllEntries(region);
  const fields = new Set<SemanticField>();
  entries.forEach(entry => {
    entry.semanticFields?.forEach(field => fields.add(field));
  });
  return Array.from(fields).sort();
}
