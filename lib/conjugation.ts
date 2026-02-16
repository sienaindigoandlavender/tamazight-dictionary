import { VerbEntry, Region } from '@/types';
import tachelhitConjugations from '@/data/conjugations/tachelhit.json';

const conjugationCache: Record<Region, VerbEntry[]> = {
  tachelhit: tachelhitConjugations as VerbEntry[],
  kabyle: [],
  tarifit: [],
  'central-atlas': [],
  tuareg: [],
  zenaga: [],
  ghomara: [],
};

export function getAllVerbs(region: Region = 'tachelhit'): VerbEntry[] {
  return conjugationCache[region] || [];
}

export function getVerbByInfinitive(infinitive: string, region: Region = 'tachelhit'): VerbEntry | undefined {
  const verbs = getAllVerbs(region);
  return verbs.find(verb =>
    verb.infinitive.toLowerCase() === infinitive.toLowerCase() ||
    verb.tifinagh === infinitive
  );
}

export function searchVerbs(query: string, region: Region = 'tachelhit'): VerbEntry[] {
  if (!query || query.trim().length === 0) return [];

  const verbs = getAllVerbs(region);
  const lowerQuery = query.toLowerCase().trim();

  return verbs.filter(verb => {
    if (verb.infinitive.toLowerCase().includes(lowerQuery)) return true;
    if (verb.tifinagh.includes(query)) return true;
    if (verb.meaning.toLowerCase().includes(lowerQuery)) return true;
    if (verb.meaningFr.toLowerCase().includes(lowerQuery)) return true;
    return false;
  });
}
