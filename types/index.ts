// Supported languages for definitions
export type Language = 'en' | 'fr' | 'ar' | 'es';

// Regional varieties of Tamazight
export type Region = 'tachelhit' | 'kabyle' | 'tarifit' | 'central-atlas' | 'tuareg' | 'zenaga' | 'ghomara';

// Sub-regions for finer geographic tagging
export type SubRegionTag =
  // Tachelhit sub-regions
  | 'souss' | 'haha' | 'ida-ou-tanane' | 'chtouka' | 'anti-atlas' | 'draa'
  // Kabyle sub-regions
  | 'grande-kabylie' | 'petite-kabylie' | 'bejaia' | 'tizi-ouzou'
  // Tarifit sub-regions
  | 'nador' | 'al-hoceima' | 'melilla'
  // Central Atlas sub-regions
  | 'ait-seghrouchen' | 'ait-izdeg' | 'zayane'
  // Tuareg sub-regions
  | 'ahaggar' | 'air' | 'adrar-des-ifoghas' | 'azawagh';

// Register/formality level
export type Register = 'formal' | 'informal' | 'literary' | 'colloquial' | 'archaic' | 'technical' | 'poetic' | 'religious';

// Era/time period for historical tagging
export type Era = 'contemporary' | 'modern' | 'classical' | 'medieval' | 'ancient' | 'proto-berber';

// ============================================
// AUDIO SYSTEM - Enhanced for scale
// ============================================

// Audio recording metadata
export interface AudioRecording {
  id: string;
  file: string;                      // Path or URL to audio file
  format: 'mp3' | 'ogg' | 'wav' | 'webm';
  duration?: number;                 // Duration in seconds

  // Recording source
  source: {
    type: 'human' | 'ai-generated' | 'field-recording' | 'broadcast';
    speaker?: SpeakerInfo;
    recordedAt?: string;             // ISO date
    recordedIn?: string;             // Location
    quality: 'studio' | 'professional' | 'amateur' | 'field';
  };

  // Linguistic metadata
  region: Region;
  subRegion?: SubRegionTag;
  dialect?: string;                  // Finer dialect distinction
  speed?: 'slow' | 'normal' | 'fast';
  style?: 'citation' | 'natural' | 'emphatic';

  // Verification
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;

  // Usage rights
  license?: 'cc-by' | 'cc-by-sa' | 'cc-by-nc' | 'public-domain' | 'restricted';
  attribution?: string;
}

// Speaker information for audio recordings
export interface SpeakerInfo {
  id?: string;
  name?: string;                     // May be anonymous
  anonymous: boolean;
  gender?: 'male' | 'female' | 'other';
  ageGroup?: 'child' | 'young-adult' | 'adult' | 'elder';
  nativeRegion: Region;
  subRegion?: SubRegionTag;
  birthplace?: string;
  currentResidence?: string;
  occupation?: string;
  isLinguist?: boolean;
  speakerNotes?: string;             // e.g., "Fluent in Tachelhit and Darija"
}

// Audio collection for a single entry (multiple recordings)
export interface AudioCollection {
  primary?: AudioRecording;          // Default/recommended recording
  recordings: AudioRecording[];      // All available recordings
  hasRegionalVariants: boolean;
  hasAiGenerated: boolean;
  totalRecordings: number;
}

// Part of speech categories
export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'preposition'
  | 'pronoun'
  | 'conjunction'
  | 'interjection'
  | 'particle'
  | 'numeral';

// Multilingual definition with context
export interface Definition {
  meaning: string;
  language: Language;
  context?: string;  // e.g., "agriculture", "cooking", "religion"
  register?: Register;
}

// Example sentence with source attribution
export interface Example {
  id?: string;
  text: string;           // Original Tamazight text
  tifinagh: string;       // Tifinagh script
  translations: {
    language: Language;
    text: string;
  }[];

  // Enhanced source attribution
  source?: {
    type: 'oral' | 'written' | 'proverb' | 'song' | 'poetry' | 'corpus' | 'literature' | 'news' | 'social-media';
    attribution?: string;  // e.g., "Traditional proverb", "Collected in Agadir, 2019"
    speaker?: string;      // For oral sources
    work?: string;         // Book/article title
    author?: string;
    year?: number;
    url?: string;          // Link to source
    corpusId?: string;     // Reference to corpus entry
    page?: number;
    timestamp?: string;    // For audio/video sources
  };

  // Audio for this example
  audio?: AudioRecording;

  // Geographic and temporal context
  region?: Region;
  subRegion?: SubRegionTag;
  collectedIn?: string;    // Location where collected
  collectedAt?: string;    // When collected (ISO date)
  era?: Era;               // Historical period
  register?: Register;

  // Usage context
  context?: string;        // Situational context (e.g., "greeting", "bargaining", "storytelling")
  pragmatics?: string;     // Pragmatic notes (tone, intent)

  // Quality indicators
  verified: boolean;
  nativeSpeakerVerified?: boolean;
  linguistVerified?: boolean;
}

// ============================================
// CORPUS INTEGRATION
// ============================================

// Reference to external corpus
export interface CorpusReference {
  corpusName: string;      // e.g., "IRCAM Tachelhit Corpus", "Kabyle Oral Traditions Archive"
  corpusId: string;
  entryId: string;
  url?: string;
  license?: string;
}

// Collocation / common word combination
export interface Collocation {
  words: string[];
  tifinagh: string;
  frequency: 'very-common' | 'common' | 'occasional' | 'rare';
  meaning: string;
  meaningFr?: string;
  example?: string;
  register?: Register;
}

// ============================================
// GEOLINGUISTIC DATA - For maps and analysis
// ============================================

// Usage data for a specific region
export interface RegionalUsage {
  region: Region;
  subRegion?: SubRegionTag;

  // Usage metrics
  frequency: 'very-common' | 'common' | 'uncommon' | 'rare' | 'unknown' | 'not-used';
  confidence: 'high' | 'medium' | 'low';  // Confidence in the data

  // Form variations
  localForm?: string;        // Local spelling/form if different
  localTifinagh?: string;
  localPronunciation?: string;

  // Semantic variations
  localMeanings?: string[];  // If meaning differs locally
  semanticNotes?: string;    // Notes on semantic differences

  // Status
  status: 'active' | 'declining' | 'reviving' | 'archaic' | 'obsolete';
  generationalUse?: 'all-ages' | 'mainly-elders' | 'mainly-youth' | 'formal-only';

  // Sources
  lastVerified?: string;     // ISO date
  sources?: string[];        // Data sources
}

// Semantic shift across regions or time
export interface SemanticShift {
  id: string;
  originalMeaning: string;
  shiftedMeaning: string;

  // Where/when the shift occurs
  inRegion?: Region;
  fromRegion?: Region;
  toRegion?: Region;
  fromEra?: Era;
  toEra?: Era;

  // Type of shift
  shiftType: 'narrowing' | 'broadening' | 'metaphor' | 'metonymy' | 'amelioration' | 'pejoration' | 'specialization';

  // Evidence
  examples?: Example[];
  notes?: string;
  sources?: string[];
}

// Isogloss - linguistic boundary
export interface Isogloss {
  id: string;
  name: string;
  feature: string;          // The linguistic feature that varies
  featureType: 'phonological' | 'morphological' | 'lexical' | 'syntactic' | 'semantic';

  // Geographic definition
  coordinates: [number, number][];  // Line coordinates
  regionsNorth?: Region[];
  regionsSouth?: Region[];

  // The variation
  variantA: string;
  variantB: string;
  description: string;
}

// Word distribution map data
export interface WordDistribution {
  wordId: string;
  word: string;

  // Distribution by region
  regionalData: RegionalUsage[];

  // Computed metrics
  totalRegions: number;
  primaryRegion: Region;
  isUniversal: boolean;     // Found in all regions
  isPanBerber: boolean;     // Found across language boundaries

  // Semantic variation summary
  hasSemanticVariation: boolean;
  semanticShifts?: SemanticShift[];

  // Historical data
  historicalNotes?: string;
  attestedSince?: Era;
  etymology?: string;
}

// Heat map data point
export interface HeatMapPoint {
  coordinates: [number, number];  // [lng, lat]
  region: Region;
  subRegion?: SubRegionTag;
  value: number;                  // 0-100 intensity
  wordId: string;
  metric: 'frequency' | 'semantic-distinctiveness' | 'phonological-variation';
}

// Etymology information
export interface Etymology {
  root?: string;                    // Triconsonantal root (e.g., "k-l" for akal)
  rootTifinagh?: string;           // Root in Tifinagh
  pattern?: string;                 // Morphological pattern
  origin?: 'native' | 'arabic' | 'french' | 'spanish' | 'latin' | 'berber-common' | 'unknown';
  borrowedFrom?: {
    language: string;
    word: string;
    meaning?: string;
  };
  cognates?: {                      // Related words in other Berber varieties
    region: Region;
    word: string;
    tifinagh: string;
  }[];
  notes?: string;                   // Historical/etymological notes
}

// Morphological information
export interface Morphology {
  root: string;                     // Consonantal root
  rootTifinagh: string;
  pattern?: string;                 // Derivational pattern
  state?: 'free' | 'construct';    // Noun state
  derivedFrom?: string;            // Base word if derived
  derivedForms?: {
    type: 'diminutive' | 'augmentative' | 'agent' | 'instrument' | 'place' | 'abstract' | 'collective';
    word: string;
    tifinagh: string;
    meaning: string;
  }[];
  feminine?: {
    word: string;
    tifinagh: string;
  };
  singulative?: {                   // For collective nouns
    word: string;
    tifinagh: string;
  };
}

// Dialectal variant - enhanced
export interface Variant {
  region: Region;
  subRegion?: SubRegionTag;
  word: string;
  tifinagh: string;
  pronunciation: string;
  notes?: string;                   // Differences in usage or meaning

  // Enhanced variant data
  audio?: AudioRecording;           // Audio for this variant
  frequency?: 'common' | 'uncommon' | 'rare';
  status?: 'active' | 'declining' | 'archaic';
  semanticDifference?: string;      // If meaning differs
  isPreferred?: boolean;            // Preferred form in this region
  sources?: string[];
}

// Usage notes
export interface UsageNote {
  type: 'grammar' | 'semantic' | 'pragmatic' | 'cultural' | 'warning';
  text: string;
  languages?: Language[];           // Which languages to show this note in
}

// Cross-references
export interface CrossReference {
  type: 'synonym' | 'antonym' | 'see-also' | 'compare' | 'derived' | 'root';
  wordId: string;
  word: string;
  tifinagh: string;
  notes?: string;
}

// Semantic field / domain
export type SemanticField =
  | 'nature'
  | 'body'
  | 'family'
  | 'food'
  | 'clothing'
  | 'house'
  | 'agriculture'
  | 'animals'
  | 'time'
  | 'space'
  | 'religion'
  | 'emotions'
  | 'society'
  | 'commerce'
  | 'craft'
  | 'music'
  | 'abstract'
  | 'architecture'
  | 'community'
  | 'water'
  | 'culture'
  | 'governance'
  | 'social'
  | 'direction'
  | 'geography'
  | 'color'
  | 'weather'
  | 'textile'
  | 'identity'
  | 'knowledge'
  | 'emotion'
  | 'numbers'
  | 'travel'
  | 'communication'
  | 'household'
  | 'adornment'
  | 'people'
  | 'writing'
  | 'language'
  | 'politics'
  | 'cosmology';

// Main dictionary entry - comprehensive structure
export interface DictionaryEntry {
  id: string;

  // Core word data
  word: string;
  tifinagh: string;
  pronunciation: string;           // IPA notation

  // ENHANCED: Audio system (replaces simple audioFile)
  audioFile?: string;              // Legacy: single audio file
  audio?: AudioCollection;         // New: multiple recordings with metadata

  // Classification
  partOfSpeech: PartOfSpeech;
  gender?: 'masculine' | 'feminine';
  number?: 'singular' | 'plural' | 'dual' | 'collective';
  semanticFields?: SemanticField[];

  // Morphology
  plural?: string;
  pluralTifinagh?: string;
  morphology?: Morphology;

  // Definitions (multilingual)
  definitions: Definition[];

  // Etymology
  etymology?: Etymology;

  // Usage
  usageNotes?: UsageNote[];
  frequency?: 'common' | 'uncommon' | 'rare' | 'archaic';
  register?: Register;

  // ENHANCED: Historical/temporal tagging
  era?: Era;                       // When this form/meaning was common
  attestedSince?: Era;             // Earliest known attestation
  status?: 'active' | 'declining' | 'reviving' | 'archaic' | 'obsolete';

  // Examples
  examples?: Example[];

  // ENHANCED: Collocations
  collocations?: Collocation[];

  // ENHANCED: Corpus references
  corpusReferences?: CorpusReference[];

  // Dialectal information
  region: Region;
  subRegion?: SubRegionTag;        // New: finer geographic tagging
  variants?: Variant[];
  isStandardForm?: boolean;        // IRCAM standard form

  // ENHANCED: Geolinguistic data
  regionalUsage?: RegionalUsage[]; // Usage across all regions
  distribution?: WordDistribution; // Full distribution data
  semanticShifts?: SemanticShift[]; // Meaning changes across regions/time

  // Cross-references
  crossReferences?: CrossReference[];
  relatedWords?: string[];         // Simple related word list (backward compat)

  // Metadata
  lastUpdated?: string;
  sources?: string[];
  contributors?: string[];

  // ENHANCED: Quality and verification
  verificationStatus?: 'unverified' | 'community-verified' | 'expert-verified' | 'ircam-approved';
  verifiedBy?: string[];
  verifiedAt?: string;
  confidence?: 'high' | 'medium' | 'low';
}

// Verb entry with conjugation
export interface VerbEntry {
  id: string;
  infinitive: string;
  tifinagh: string;

  // Definitions (multilingual)
  definitions: Definition[];

  // Legacy fields for backward compatibility
  meaning: string;
  meaningFr: string;

  audioFile?: string;

  // Morphology
  root?: string;
  rootTifinagh?: string;
  verbClass?: 'regular' | 'irregular' | 'defective' | 'geminate' | 'hollow' | 'weak';
  transitivity?: 'transitive' | 'intransitive' | 'ditransitive' | 'reflexive';

  // Conjugations
  conjugations: {
    imperative: Conjugation;
    aorist: Conjugation;
    preterite: Conjugation;
    negativePreterite?: Conjugation;
    intensive?: Conjugation;
    perfectiveParticiple?: string;
    imperfectiveParticiple?: string;
  };

  // Dialect
  region: Region;
  variants?: Variant[];

  // Examples
  examples?: Example[];

  // Usage
  usageNotes?: UsageNote[];
}

// Conjugation forms
export interface Conjugation {
  singular?: string;
  plural?: string;
  '1s'?: string;
  '2s'?: string;
  '3sm'?: string;
  '3sf'?: string;
  '1p'?: string;
  '2pm'?: string;
  '2pf'?: string;
  '3pm'?: string;
  '3pf'?: string;
}

// Alphabet letter
export interface AlphabetLetter {
  tifinagh: string;
  latin: string;
  name: string;
  nameTifinagh?: string;
  pronunciation: string;
  ipa: string;
  audioFile?: string;
  notes?: string;
  variants?: {
    region: Region;
    form: string;
  }[];
}

// Search result with relevance scoring
export interface SearchResult {
  entry: DictionaryEntry;
  matchType: 'exact' | 'prefix' | 'contains' | 'definition' | 'example';
  matchedField: string;
  score: number;
}

// Geographic coordinates
export interface Coordinates {
  lat: number;
  lng: number;
}

// Geographic bounds
export interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

// Sub-region within a dialect area
export interface SubRegion {
  name: string;
  coordinates: Coordinates;
  notes?: string;
}

// Linguistic characteristics of a region
export interface RegionCharacteristics {
  phonology: string;
  grammar: string;
  vocabulary: string;
  writingSystem: string;
}

// Resources for a region
export interface RegionResources {
  corpora: string[];
  dictionaries: string[];
  audioCollections: string[];
}

// Region status
export type RegionStatus = 'active' | 'coming_soon' | 'planned';

// Region metadata - expanded for geolinguistic map
export interface RegionInfo {
  id: Region;
  name: string;
  nameTifinagh: string;
  nameNative: string;
  alternateNames?: string[];
  country: string;
  countries: string[];
  speakers: string;
  speakersNumeric: number;
  description: string;
  descriptionTifinagh?: string;
  coordinates: Coordinates;
  bounds?: Bounds;
  color: string;
  subRegions?: SubRegion[];
  characteristics?: RegionCharacteristics;
  culturalNotes?: string[];
  resources?: RegionResources;
  status: RegionStatus;
  wordCount: number;
}

// Dialect continuum connection
export interface DialectConnection {
  from: Region;
  to: Region;
  mutualIntelligibility: 'high' | 'partial' | 'low' | 'very-low';
}

// Map configuration
export interface MapConfig {
  center: Coordinates;
  zoom: number;
  bounds: Bounds;
  style: string;
}

// Full regions data structure
export interface RegionsData {
  regions: RegionInfo[];
  mapConfig: MapConfig;
  dialectContinuum: {
    description: string;
    connections: DialectConnection[];
  };
}

// ============================================
// SYMBOL DICTIONARY - Amazigh visual language
// ============================================

// Medium where symbols appear
export type SymbolMedium =
  | 'tattoo'
  | 'weaving'
  | 'pottery'
  | 'jewelry'
  | 'architecture'
  | 'door'
  | 'wall'
  | 'carpet'
  | 'textile'
  | 'henna'
  | 'metalwork'
  | 'wood-carving';

// Context of symbol usage
export type SymbolContext =
  | 'wedding'
  | 'protection'
  | 'fertility'
  | 'daily-life'
  | 'mourning'
  | 'threshold'
  | 'blessing'
  | 'identity'
  | 'spiritual'
  | 'decorative'
  | 'rite-of-passage';

// Symbol category/family
export type SymbolCategory =
  | 'geometric'
  | 'anthropomorphic'
  | 'zoomorphic'
  | 'botanical'
  | 'cosmic'
  | 'abstract'
  | 'composite';

// Layer A: Attested/documented meaning
export interface AttestedMeaning {
  meaning: string;
  region: Region;
  subRegion?: SubRegionTag;
  medium: SymbolMedium[];
  context: SymbolContext[];
  source: string;                    // Academic source, fieldwork, museum
  sourceType: 'academic' | 'museum' | 'fieldwork' | 'historical-document' | 'ethnographic';
  dateDocumented?: string;           // When this was recorded
  confidence: 'high' | 'medium' | 'low';
  notes?: string;
}

// Layer B: Oral/community interpretation
export interface OralMeaning {
  meaning: string;
  region: Region;
  subRegion?: SubRegionTag;
  speaker?: string;                  // Anonymous or named
  speakerContext?: string;           // "elderly weaver", "tattoo artist"
  collectedIn?: string;              // Location
  collectedAt?: string;              // Date
  medium?: SymbolMedium[];           // Context where this interpretation applies
  contradicts?: string;              // Notes if it contradicts other interpretations
  notes?: string;
}

// Layer C: Contemporary/modern reading
export interface ModernMeaning {
  meaning: string;
  interpreter: string;               // Artist, designer, community
  interpreterType: 'artist' | 'designer' | 'community' | 'academic' | 'revival-movement';
  context: string;                   // How/where this interpretation is used
  year?: number;
  medium?: SymbolMedium[];
  url?: string;                      // Link to work/source
  notes?: string;
}

// Visual representation of symbol
export interface SymbolVisual {
  svg?: string;                      // Inline SVG or path to SVG file
  svgPath?: string;                  // SVG path data for simple symbols
  imageFile?: string;                // Photo or illustration
  thumbnailFile?: string;
  altText: string;                   // Accessibility description
  artistAttribution?: string;        // Who created this representation
}

// Related symbols
export interface RelatedSymbol {
  symbolId: string;
  relationship: 'variant' | 'component' | 'opposite' | 'complementary' | 'evolved-from' | 'family';
  notes?: string;
}

// Cross-link to dictionary
export interface SymbolWordLink {
  wordId: string;
  word: string;
  tifinagh: string;
  relationship: 'named-after' | 'represents' | 'associated-phrase' | 'blessing' | 'root-connection';
  notes?: string;
}

// Main symbol entry
export interface SymbolEntry {
  id: string;

  // Names
  name: string;                      // Primary name (Tamazight if known)
  nameTifinagh?: string;
  nameArabic?: string;
  nameFrench?: string;
  nameEnglish?: string;
  alternateNames?: string[];

  // Classification
  category: SymbolCategory;
  tags?: string[];                   // Freeform tags for search

  // Visual
  visual: SymbolVisual;
  variants?: {
    region: Region;
    visual: SymbolVisual;
    notes?: string;
  }[];

  // Geographic distribution
  primaryRegion: Region;
  regions: Region[];                 // All regions where found
  subRegions?: SubRegionTag[];

  // Material presence
  media: SymbolMedium[];             // Where it appears
  primaryMedium?: SymbolMedium;      // Most common medium

  // The three interpretation layers
  attestedUsage: AttestedMeaning[];        // Layer A - documented, academic
  oralInterpretations: OralMeaning[];      // Layer B - what people say
  contemporaryReadings?: ModernMeaning[];  // Layer C - modern reinterpretation

  // Context
  contexts: SymbolContext[];
  ritualUse?: string;                // Specific ritual context
  taboos?: string;                   // Any restrictions on use

  // Cross-links to language
  linkedWords?: SymbolWordLink[];    // Connected dictionary entries
  linkedRoots?: {
    root: string;
    rootTifinagh?: string;
    meaning: string;
    notes?: string;
  }[];
  linkedPhrases?: {
    phrase: string;
    phraseTifinagh: string;
    meaning: string;
    context?: string;
  }[];

  // Related symbols
  relatedSymbols?: RelatedSymbol[];
  partOf?: string[];                 // Larger composite symbols this appears in
  components?: string[];             // Smaller symbols that make up this one

  // Historical depth
  attestedSince?: Era;
  historicalNotes?: string;
  archaeologicalEvidence?: string;

  // Status
  status: 'active' | 'declining' | 'archaic' | 'reviving' | 'extinct';
  statusNotes?: string;

  // Metadata
  sources: string[];
  primarySource?: string;
  bibliography?: string[];
  confidence: 'high' | 'medium' | 'low';
  lastUpdated?: string;
  contributors?: string[];

  // Editorial
  curatorNotes?: string;             // Internal notes
  displayOrder?: number;
}

// Symbol collection/family
export interface SymbolFamily {
  id: string;
  name: string;
  nameTifinagh?: string;
  description: string;
  symbols: string[];                 // Symbol IDs
  region?: Region;
  medium?: SymbolMedium;
  notes?: string;
}

// Full symbols data structure
export interface SymbolsData {
  symbols: SymbolEntry[];
  families?: SymbolFamily[];
  metadata: {
    totalSymbols: number;
    lastUpdated: string;
    curatorNotes?: string;
  };
}

// ============================================
// PHRASE/TRANSLATION SYSTEM
// ============================================

// Phrase categories
export type PhraseCategory =
  | 'greeting'
  | 'farewell'
  | 'introduction'
  | 'question'
  | 'direction'
  | 'shopping'
  | 'food'
  | 'time'
  | 'weather'
  | 'family'
  | 'courtesy'
  | 'emergency'
  | 'travel'
  | 'numbers'
  | 'proverb'
  | 'blessing'
  | 'expression';

// Formality level for phrases
export type PhraseFormality = 'formal' | 'informal' | 'neutral';

// Single phrase entry
export interface PhraseEntry {
  id: string;

  // The phrase in Tamazight
  phrase: string;
  tifinagh: string;
  pronunciation: string;

  // Translations
  translations: {
    en: string;
    fr: string;
    ar?: string;
  };

  // Literal translation (word-by-word)
  literalTranslation?: string;

  // Classification
  category: PhraseCategory;
  formality: PhraseFormality;

  // Context
  context?: string;           // When/where to use this phrase
  response?: string;          // Common response phrase ID

  // Regional
  region: Region;
  subRegion?: SubRegionTag;
  variants?: {
    region: Region;
    phrase: string;
    tifinagh: string;
    notes?: string;
  }[];

  // Audio
  audioFile?: string;

  // Related
  relatedPhrases?: string[];  // Related phrase IDs
  relatedWords?: string[];    // Dictionary word IDs

  // Metadata
  notes?: string;
  culturalNote?: string;
  sources?: string[];
}

// Phrase template for interactive builder
export interface PhraseTemplate {
  id: string;

  // Template pattern
  template: string;           // e.g., "How do you say {word} in Tamazight?"
  templateTifinagh: string;

  // Slots
  slots: {
    name: string;             // e.g., "word"
    type: 'word' | 'name' | 'number' | 'place' | 'time';
    options?: string[];       // Predefined options if limited
  }[];

  // Output pattern
  outputPattern: string;      // e.g., "{word} s tmazight: {translation}"

  // Category
  category: PhraseCategory;

  // Example filled
  example: {
    input: Record<string, string>;
    output: string;
    outputTifinagh: string;
  };
}

// Full phrases data structure
export interface PhrasesData {
  phrases: PhraseEntry[];
  templates?: PhraseTemplate[];
  categories: {
    id: PhraseCategory;
    name: string;
    nameTifinagh?: string;
    description: string;
    icon?: string;
  }[];
  metadata: {
    totalPhrases: number;
    lastUpdated: string;
  };
}
