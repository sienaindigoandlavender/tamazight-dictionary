import { SymbolEntry, SymbolsData, SymbolMedium, SymbolContext, SymbolCategory, Region } from '@/types';
import symbolsData from '@/data/symbols/amazigh-symbols.json';

const data = symbolsData as SymbolsData;

// Get all symbols
export function getAllSymbols(): SymbolEntry[] {
  return data.symbols;
}

// Get symbol by ID
export function getSymbolById(id: string): SymbolEntry | undefined {
  return data.symbols.find(s => s.id === id);
}

// Get symbol by name (case-insensitive)
export function getSymbolByName(name: string): SymbolEntry | undefined {
  const lowerName = name.toLowerCase();
  return data.symbols.find(s =>
    s.name.toLowerCase() === lowerName ||
    s.nameEnglish?.toLowerCase() === lowerName ||
    s.nameFrench?.toLowerCase() === lowerName ||
    s.alternateNames?.some(n => n.toLowerCase() === lowerName)
  );
}

// Search symbols
export function searchSymbols(query: string): SymbolEntry[] {
  if (!query || query.trim().length === 0) return [];

  const lowerQuery = query.toLowerCase().trim();

  return data.symbols.filter(symbol => {
    // Search in names
    if (symbol.name.toLowerCase().includes(lowerQuery)) return true;
    if (symbol.nameEnglish?.toLowerCase().includes(lowerQuery)) return true;
    if (symbol.nameFrench?.toLowerCase().includes(lowerQuery)) return true;
    if (symbol.alternateNames?.some(n => n.toLowerCase().includes(lowerQuery))) return true;

    // Search in tags
    if (symbol.tags?.some(t => t.toLowerCase().includes(lowerQuery))) return true;

    // Search in meanings
    if (symbol.attestedUsage.some(u => u.meaning.toLowerCase().includes(lowerQuery))) return true;
    if (symbol.oralInterpretations.some(o => o.meaning.toLowerCase().includes(lowerQuery))) return true;

    return false;
  });
}

// Get symbols by medium
export function getSymbolsByMedium(medium: SymbolMedium): SymbolEntry[] {
  return data.symbols.filter(s => s.media.includes(medium));
}

// Get symbols by context
export function getSymbolsByContext(context: SymbolContext): SymbolEntry[] {
  return data.symbols.filter(s => s.contexts.includes(context));
}

// Get symbols by category
export function getSymbolsByCategory(category: SymbolCategory): SymbolEntry[] {
  return data.symbols.filter(s => s.category === category);
}

// Get symbols by region
export function getSymbolsByRegion(region: Region): SymbolEntry[] {
  return data.symbols.filter(s => s.regions.includes(region));
}

// Get symbols by status
export function getSymbolsByStatus(status: SymbolEntry['status']): SymbolEntry[] {
  return data.symbols.filter(s => s.status === status);
}

// Get related symbols
export function getRelatedSymbols(symbol: SymbolEntry): SymbolEntry[] {
  if (!symbol.relatedSymbols) return [];

  return symbol.relatedSymbols
    .map(rel => getSymbolById(rel.symbolId))
    .filter((s): s is SymbolEntry => s !== undefined);
}

// Get all unique media types in the collection
export function getAvailableMedia(): SymbolMedium[] {
  const media = new Set<SymbolMedium>();
  data.symbols.forEach(s => s.media.forEach(m => media.add(m)));
  return Array.from(media).sort();
}

// Get all unique contexts in the collection
export function getAvailableContexts(): SymbolContext[] {
  const contexts = new Set<SymbolContext>();
  data.symbols.forEach(s => s.contexts.forEach(c => contexts.add(c)));
  return Array.from(contexts).sort();
}

// Get all unique categories in the collection
export function getAvailableCategories(): SymbolCategory[] {
  const categories = new Set<SymbolCategory>();
  data.symbols.forEach(s => categories.add(s.category));
  return Array.from(categories).sort();
}

// Get symbol families
export function getSymbolFamilies() {
  return data.families || [];
}

// Get symbols in a family
export function getSymbolsInFamily(familyId: string): SymbolEntry[] {
  const family = data.families?.find(f => f.id === familyId);
  if (!family) return [];

  return family.symbols
    .map(id => getSymbolById(id))
    .filter((s): s is SymbolEntry => s !== undefined);
}

// Get metadata
export function getSymbolsMetadata() {
  return data.metadata;
}

// Get symbols linked to a dictionary word
export function getSymbolsLinkedToWord(wordId: string): SymbolEntry[] {
  return data.symbols.filter(s =>
    s.linkedWords?.some(link => link.wordId === wordId)
  );
}

// Format medium for display
export function formatMedium(medium: SymbolMedium): string {
  const labels: Record<SymbolMedium, string> = {
    'tattoo': 'Tattoo',
    'weaving': 'Weaving',
    'pottery': 'Pottery',
    'jewelry': 'Jewelry',
    'architecture': 'Architecture',
    'door': 'Door',
    'wall': 'Wall',
    'carpet': 'Carpet',
    'textile': 'Textile',
    'henna': 'Henna',
    'metalwork': 'Metalwork',
    'wood-carving': 'Wood Carving',
  };
  return labels[medium] || medium;
}

// Format context for display
export function formatContext(context: SymbolContext): string {
  const labels: Record<SymbolContext, string> = {
    'wedding': 'Wedding',
    'protection': 'Protection',
    'fertility': 'Fertility',
    'daily-life': 'Daily Life',
    'mourning': 'Mourning',
    'threshold': 'Threshold',
    'blessing': 'Blessing',
    'identity': 'Identity',
    'spiritual': 'Spiritual',
    'decorative': 'Decorative',
    'rite-of-passage': 'Rite of Passage',
  };
  return labels[context] || context;
}

// Format category for display
export function formatCategory(category: SymbolCategory): string {
  const labels: Record<SymbolCategory, string> = {
    'geometric': 'Geometric',
    'anthropomorphic': 'Anthropomorphic',
    'zoomorphic': 'Zoomorphic',
    'botanical': 'Botanical',
    'cosmic': 'Cosmic',
    'abstract': 'Abstract',
    'composite': 'Composite',
  };
  return labels[category] || category;
}

// Format status for display
export function formatStatus(status: SymbolEntry['status']): string {
  const labels: Record<SymbolEntry['status'], string> = {
    'active': 'Active',
    'declining': 'Declining',
    'archaic': 'Archaic',
    'reviving': 'Reviving',
    'extinct': 'Extinct',
  };
  return labels[status] || status;
}
