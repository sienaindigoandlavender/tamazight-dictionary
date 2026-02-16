'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DictionaryEntry } from '@/types';

interface SearchBarProps {
  entries: DictionaryEntry[];
  placeholder?: string;
  autoFocus?: boolean;
}

export default function SearchBar({ entries, placeholder = "Search words...", autoFocus = false }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<DictionaryEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length < 1) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const matches = entries.filter(entry =>
      entry.word.toLowerCase().includes(lowerQuery) ||
      entry.tifinagh.includes(query) ||
      entry.definitions.some(def => def.meaning.toLowerCase().includes(lowerQuery))
    ).slice(0, 8);

    setSuggestions(matches);
    setIsOpen(matches.length > 0);
    setSelectedIndex(-1);
  }, [query, entries]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        navigateToWord(suggestions[selectedIndex].word);
      } else if (suggestions.length > 0) {
        navigateToWord(suggestions[0].word);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const navigateToWord = (word: string) => {
    setQuery('');
    setIsOpen(false);
    router.push(`/dictionary/${encodeURIComponent(word)}`);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="input-search"
        />
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-background border border-foreground/20 max-h-96 overflow-y-auto">
          {suggestions.map((entry, index) => (
            <li key={entry.id}>
              <button
                onClick={() => navigateToWord(entry.word)}
                className={`w-full px-6 py-4 text-left hover:bg-foreground/5 transition-colors flex items-center gap-6 border-b border-foreground/5 last:border-b-0 ${
                  index === selectedIndex ? 'bg-foreground/5' : ''
                }`}
              >
                <span className="tifinagh text-xl min-w-[60px]">{entry.tifinagh}</span>
                <div className="flex-1">
                  <span className="font-serif text-lg">{entry.word}</span>
                  <span className="text-sm text-muted-foreground ml-3">
                    {entry.definitions[0]?.meaning}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground uppercase tracking-widest">{entry.partOfSpeech}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
