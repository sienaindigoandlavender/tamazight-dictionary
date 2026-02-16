// Latin to Tifinagh mapping
const latinToTifinagh: Record<string, string> = {
  'a': 'ⴰ',
  'b': 'ⴱ',
  'g': 'ⴳ',
  'd': 'ⴷ',
  'ḍ': 'ⴹ',
  'e': 'ⴻ',
  'f': 'ⴼ',
  'k': 'ⴽ',
  'h': 'ⵀ',
  'ḥ': 'ⵃ',
  'ɛ': 'ⵄ',
  'x': 'ⵅ',
  'q': 'ⵇ',
  'i': 'ⵉ',
  'j': 'ⵊ',
  'l': 'ⵍ',
  'm': 'ⵎ',
  'n': 'ⵏ',
  'u': 'ⵓ',
  'r': 'ⵔ',
  'ṛ': 'ⵕ',
  'ɣ': 'ⵖ',
  'gh': 'ⵖ',
  's': 'ⵙ',
  'ṣ': 'ⵚ',
  'c': 'ⵛ',
  'sh': 'ⵛ',
  't': 'ⵜ',
  'ṭ': 'ⵟ',
  'w': 'ⵡ',
  'y': 'ⵢ',
  'z': 'ⵣ',
  'ẓ': 'ⵥ',
};

// Tifinagh to Latin mapping
const tifinaghToLatin: Record<string, string> = {
  'ⴰ': 'a',
  'ⴱ': 'b',
  'ⴳ': 'g',
  'ⴷ': 'd',
  'ⴹ': 'ḍ',
  'ⴻ': 'e',
  'ⴼ': 'f',
  'ⴽ': 'k',
  'ⵀ': 'h',
  'ⵃ': 'ḥ',
  'ⵄ': 'ɛ',
  'ⵅ': 'x',
  'ⵇ': 'q',
  'ⵉ': 'i',
  'ⵊ': 'j',
  'ⵍ': 'l',
  'ⵎ': 'm',
  'ⵏ': 'n',
  'ⵓ': 'u',
  'ⵔ': 'r',
  'ⵕ': 'ṛ',
  'ⵖ': 'ɣ',
  'ⵙ': 's',
  'ⵚ': 'ṣ',
  'ⵛ': 'c',
  'ⵜ': 't',
  'ⵟ': 'ṭ',
  'ⵡ': 'w',
  'ⵢ': 'y',
  'ⵣ': 'z',
  'ⵥ': 'ẓ',
  'ⵯ': 'ʷ',
};

export function toTifinagh(latin: string): string {
  let result = '';
  let i = 0;

  while (i < latin.length) {
    // Check for digraphs first (gh, sh)
    const digraph = latin.slice(i, i + 2).toLowerCase();
    if (latinToTifinagh[digraph]) {
      result += latinToTifinagh[digraph];
      i += 2;
      continue;
    }

    // Single character
    const char = latin[i].toLowerCase();
    result += latinToTifinagh[char] || latin[i];
    i++;
  }

  return result;
}

export function toLatin(tifinagh: string): string {
  let result = '';

  for (const char of tifinagh) {
    result += tifinaghToLatin[char] || char;
  }

  return result;
}

export function isTifinagh(text: string): boolean {
  // Check if the text contains Tifinagh characters (Unicode range: U+2D30 to U+2D7F)
  return /[\u2D30-\u2D7F]/.test(text);
}

export function isLatin(text: string): boolean {
  return /^[a-zA-ZḍḤɛṛɣṣṭẓ\s]+$/.test(text);
}
