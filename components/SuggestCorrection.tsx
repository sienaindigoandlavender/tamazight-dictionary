'use client';

import { useState } from 'react';

interface SuggestCorrectionProps {
  context?: {
    type: 'word' | 'phrase' | 'general';
    id?: string;
    word?: string;
  };
}

export default function SuggestCorrection({ context }: SuggestCorrectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    type: context?.type || 'general',
    suggestion: '',
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // For now, we'll just show success
    // In production, this would send to an API endpoint
    console.log('Suggestion submitted:', {
      ...formData,
      context,
      timestamp: new Date().toISOString(),
    });

    setSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setSubmitted(false);
      setFormData({ type: context?.type || 'general', suggestion: '', email: '' });
    }, 2000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        Suggest correction
      </button>
    );
  }

  return (
    <div className="border border-foreground/10 bg-background p-4 mt-4">
      {submitted ? (
        <div className="text-center py-4">
          <svg className="w-8 h-8 mx-auto mb-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-muted-foreground">Thank you for your suggestion!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium">Suggest a Correction</h4>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {context?.word && (
            <p className="text-xs text-muted-foreground mb-3">
              Regarding: <span className="font-medium">{context.word}</span>
            </p>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                Type of suggestion
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'word' | 'phrase' | 'general' })}
                className="w-full px-3 py-2 text-sm border border-foreground/10 bg-background"
              >
                <option value="correction">Correction to existing entry</option>
                <option value="pronunciation">Pronunciation improvement</option>
                <option value="translation">Translation suggestion</option>
                <option value="new-word">Suggest new word</option>
                <option value="new-phrase">Suggest new phrase</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                Your suggestion
              </label>
              <textarea
                value={formData.suggestion}
                onChange={(e) => setFormData({ ...formData, suggestion: e.target.value })}
                placeholder="Describe your suggestion or correction..."
                required
                rows={3}
                className="w-full px-3 py-2 text-sm border border-foreground/10 bg-background resize-none"
              />
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                Email (optional, for follow-up)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full px-3 py-2 text-sm border border-foreground/10 bg-background"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2 text-sm bg-foreground text-background hover:opacity-90 transition-opacity"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm border border-foreground/10 hover:border-foreground/30 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground/60 mt-3">
            Your suggestions help improve Amawal for everyone. We review all submissions manually.
          </p>
        </form>
      )}
    </div>
  );
}

// Floating version for the bottom of the page
export function SuggestCorrectionFloating() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 shadow-lg">
          <SuggestCorrection context={{ type: 'general' }} />
          <button
            onClick={() => setIsOpen(false)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center text-xs"
          >
            ×
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm hover:opacity-90 transition-opacity shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          Contribute
        </button>
      )}
    </div>
  );
}
