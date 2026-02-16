'use client';

import { useState } from 'react';

interface TifinaghKeyboardProps {
  onInsert: (char: string) => void;
  onClose?: () => void;
}

// Organized Tifinagh keyboard layout
const keyboardLayout = [
  // Row 1: Vowels
  { latin: 'a', tifinagh: 'ⴰ', name: 'ya' },
  { latin: 'e', tifinagh: 'ⴻ', name: 'ye' },
  { latin: 'i', tifinagh: 'ⵉ', name: 'yi' },
  { latin: 'u', tifinagh: 'ⵓ', name: 'yu' },
  // Row 2: Common consonants
  { latin: 'b', tifinagh: 'ⴱ', name: 'yab' },
  { latin: 'd', tifinagh: 'ⴷ', name: 'yad' },
  { latin: 'f', tifinagh: 'ⴼ', name: 'yaf' },
  { latin: 'g', tifinagh: 'ⴳ', name: 'yag' },
  { latin: 'h', tifinagh: 'ⵀ', name: 'yah' },
  { latin: 'j', tifinagh: 'ⵊ', name: 'yaj' },
  { latin: 'k', tifinagh: 'ⴽ', name: 'yak' },
  { latin: 'l', tifinagh: 'ⵍ', name: 'yal' },
  { latin: 'm', tifinagh: 'ⵎ', name: 'yam' },
  { latin: 'n', tifinagh: 'ⵏ', name: 'yan' },
  { latin: 'q', tifinagh: 'ⵇ', name: 'yaq' },
  { latin: 'r', tifinagh: 'ⵔ', name: 'yar' },
  { latin: 's', tifinagh: 'ⵙ', name: 'yas' },
  { latin: 't', tifinagh: 'ⵜ', name: 'yat' },
  { latin: 'w', tifinagh: 'ⵡ', name: 'yaw' },
  { latin: 'x', tifinagh: 'ⵅ', name: 'yax' },
  { latin: 'y', tifinagh: 'ⵢ', name: 'yay' },
  { latin: 'z', tifinagh: 'ⵣ', name: 'yaz' },
  // Row 3: Emphatic/special consonants
  { latin: 'ḍ', tifinagh: 'ⴹ', name: 'yaḍ' },
  { latin: 'ṛ', tifinagh: 'ⵕ', name: 'yaṛ' },
  { latin: 'ṣ', tifinagh: 'ⵚ', name: 'yaṣ' },
  { latin: 'ṭ', tifinagh: 'ⵟ', name: 'yaṭ' },
  { latin: 'ẓ', tifinagh: 'ⵥ', name: 'yaẓ' },
  { latin: 'ɣ', tifinagh: 'ⵖ', name: 'yaɣ' },
  { latin: 'ḥ', tifinagh: 'ⵃ', name: 'yaḥ' },
  { latin: 'ɛ', tifinagh: 'ⵄ', name: 'yaɛ' },
  { latin: 'c', tifinagh: 'ⵛ', name: 'yac' },
];

export default function TifinaghKeyboard({ onInsert, onClose }: TifinaghKeyboardProps) {
  const [showLatin, setShowLatin] = useState(true);

  // Group into rows
  const vowels = keyboardLayout.slice(0, 4);
  const consonants = keyboardLayout.slice(4, 22);
  const special = keyboardLayout.slice(22);

  return (
    <div className="bg-background border border-foreground/20 p-4 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Tifinagh Keyboard</span>
          <button
            onClick={() => setShowLatin(!showLatin)}
            className={`text-xs px-2 py-1 border transition-colors ${
              showLatin
                ? 'border-foreground bg-foreground text-background'
                : 'border-foreground/20 hover:border-foreground/40'
            }`}
          >
            {showLatin ? 'Latin' : 'Tifinagh only'}
          </button>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close keyboard"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Vowels Row */}
      <div className="mb-3">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-1 block">Vowels</span>
        <div className="flex flex-wrap gap-1">
          {vowels.map((key) => (
            <KeyButton key={key.latin} item={key} showLatin={showLatin} onInsert={onInsert} />
          ))}
        </div>
      </div>

      {/* Consonants Row */}
      <div className="mb-3">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-1 block">Consonants</span>
        <div className="flex flex-wrap gap-1">
          {consonants.map((key) => (
            <KeyButton key={key.latin} item={key} showLatin={showLatin} onInsert={onInsert} />
          ))}
        </div>
      </div>

      {/* Special/Emphatic Row */}
      <div>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-1 block">Emphatic &amp; Special</span>
        <div className="flex flex-wrap gap-1">
          {special.map((key) => (
            <KeyButton key={key.latin} item={key} showLatin={showLatin} onInsert={onInsert} />
          ))}
          {/* Space key */}
          <button
            onClick={() => onInsert(' ')}
            className="h-10 px-6 border border-foreground/20 hover:border-foreground hover:bg-foreground hover:text-background transition-all text-xs"
          >
            space
          </button>
        </div>
      </div>
    </div>
  );
}

interface KeyButtonProps {
  item: { latin: string; tifinagh: string; name: string };
  showLatin: boolean;
  onInsert: (char: string) => void;
}

function KeyButton({ item, showLatin, onInsert }: KeyButtonProps) {
  return (
    <button
      onClick={() => onInsert(item.tifinagh)}
      className="w-10 h-10 border border-foreground/20 hover:border-foreground hover:bg-foreground hover:text-background transition-all flex flex-col items-center justify-center"
      title={`${item.name} (${item.latin})`}
    >
      <span className="tifinagh text-lg leading-none">{item.tifinagh}</span>
      {showLatin && (
        <span className="text-[9px] text-muted-foreground leading-none mt-0.5">{item.latin}</span>
      )}
    </button>
  );
}

// Compact inline keyboard toggle for search input
interface TifinaghToggleProps {
  isActive: boolean;
  onClick: () => void;
}

export function TifinaghToggle({ isActive, onClick }: TifinaghToggleProps) {
  return (
    <button
      onClick={onClick}
      className={`p-2 transition-colors ${
        isActive
          ? 'text-foreground bg-foreground/10'
          : 'text-muted-foreground hover:text-foreground'
      }`}
      title={isActive ? 'Hide Tifinagh keyboard' : 'Show Tifinagh keyboard'}
    >
      <span className="tifinagh text-lg">ⵣ</span>
    </button>
  );
}
