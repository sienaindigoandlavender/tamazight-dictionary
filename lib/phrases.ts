import { PhraseEntry, PhraseCategory } from '@/types';
import phrasesData from '@/data/phrases/tachelhit-phrases.json';

// Type assertion for the imported data
const phrases = phrasesData.phrases as PhraseEntry[];
const categories = phrasesData.categories;
const metadata = phrasesData.metadata;

// Get all phrases
export function getAllPhrases(): PhraseEntry[] {
  return phrases;
}

// Get phrase by ID
export function getPhraseById(id: string): PhraseEntry | undefined {
  return phrases.find(p => p.id === id);
}

// Get phrases by category
export function getPhrasesByCategory(category: PhraseCategory): PhraseEntry[] {
  return phrases.filter(p => p.category === category);
}

// Search phrases by query (searches phrase, translations, and context)
export function searchPhrases(query: string): PhraseEntry[] {
  if (!query || query.trim().length === 0) return [];

  const lowerQuery = query.toLowerCase().trim();

  return phrases.filter(phrase => {
    // Search in Tamazight phrase
    if (phrase.phrase.toLowerCase().includes(lowerQuery)) return true;

    // Search in Tifinagh
    if (phrase.tifinagh.includes(query)) return true;

    // Search in English translation
    if (phrase.translations.en.toLowerCase().includes(lowerQuery)) return true;

    // Search in French translation
    if (phrase.translations.fr.toLowerCase().includes(lowerQuery)) return true;

    // Search in context
    if (phrase.context?.toLowerCase().includes(lowerQuery)) return true;

    // Search in literal translation
    if (phrase.literalTranslation?.toLowerCase().includes(lowerQuery)) return true;

    return false;
  });
}

// Search phrases from English to Tamazight
export function searchEnglishToTamazight(query: string): PhraseEntry[] {
  if (!query || query.trim().length === 0) return [];

  const lowerQuery = query.toLowerCase().trim();

  return phrases
    .map(phrase => {
      let score = 0;

      // Exact match on English
      if (phrase.translations.en.toLowerCase() === lowerQuery) score += 100;
      else if (phrase.translations.en.toLowerCase().startsWith(lowerQuery)) score += 50;
      else if (phrase.translations.en.toLowerCase().includes(lowerQuery)) score += 20;

      // Match in context
      if (phrase.context?.toLowerCase().includes(lowerQuery)) score += 10;

      return { phrase, score };
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(r => r.phrase);
}

// Search phrases from French to Tamazight
export function searchFrenchToTamazight(query: string): PhraseEntry[] {
  if (!query || query.trim().length === 0) return [];

  const lowerQuery = query.toLowerCase().trim();

  return phrases
    .map(phrase => {
      let score = 0;

      // Exact match on French
      if (phrase.translations.fr.toLowerCase() === lowerQuery) score += 100;
      else if (phrase.translations.fr.toLowerCase().startsWith(lowerQuery)) score += 50;
      else if (phrase.translations.fr.toLowerCase().includes(lowerQuery)) score += 20;

      return { phrase, score };
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(r => r.phrase);
}

// Search phrases from Tamazight to other languages
export function searchTamazightToOther(query: string): PhraseEntry[] {
  if (!query || query.trim().length === 0) return [];

  const lowerQuery = query.toLowerCase().trim();

  return phrases
    .map(phrase => {
      let score = 0;

      // Exact match on Tamazight
      if (phrase.phrase.toLowerCase() === lowerQuery) score += 100;
      else if (phrase.phrase.toLowerCase().startsWith(lowerQuery)) score += 50;
      else if (phrase.phrase.toLowerCase().includes(lowerQuery)) score += 20;

      // Match on Tifinagh
      if (phrase.tifinagh === query) score += 100;
      else if (phrase.tifinagh.includes(query)) score += 30;

      return { phrase, score };
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(r => r.phrase);
}

// Get all categories
export function getCategories() {
  return categories;
}

// Get category info
export function getCategoryInfo(categoryId: PhraseCategory) {
  return categories.find(c => c.id === categoryId);
}

// Get available categories that have phrases
export function getAvailableCategories(): PhraseCategory[] {
  const usedCategories = new Set(phrases.map(p => p.category));
  return Array.from(usedCategories) as PhraseCategory[];
}

// Format category name
export function formatCategory(category: PhraseCategory): string {
  const categoryInfo = getCategoryInfo(category);
  return categoryInfo?.name || category.charAt(0).toUpperCase() + category.slice(1);
}

// Get phrases metadata
export function getPhrasesMetadata() {
  return {
    ...metadata,
    totalPhrases: phrases.length,
    categoryCount: getAvailableCategories().length
  };
}

// Get random phrase
export function getRandomPhrase(): PhraseEntry {
  return phrases[Math.floor(Math.random() * phrases.length)];
}

// Get random phrases
export function getRandomPhrases(count: number): PhraseEntry[] {
  const shuffled = [...phrases].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Get related phrases
export function getRelatedPhrases(phraseId: string): PhraseEntry[] {
  const phrase = getPhraseById(phraseId);
  if (!phrase?.relatedPhrases) return [];

  return phrase.relatedPhrases
    .map(id => getPhraseById(id))
    .filter((p): p is PhraseEntry => p !== undefined);
}

// Get phrase response (for greetings that have standard responses)
export function getPhraseResponse(phraseId: string): PhraseEntry | undefined {
  const phrase = getPhraseById(phraseId);
  if (!phrase?.response) return undefined;

  return getPhraseById(phrase.response);
}
