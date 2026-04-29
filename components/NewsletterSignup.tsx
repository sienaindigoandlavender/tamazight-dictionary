'use client';

import { useEffect, useState } from 'react';

const SUBSCRIBED_KEY = 'amawal-newsletter-v1';

/**
 * Calm email-capture banner. Lives in the page flow (not sticky, not a
 * pop-up, never dismissible-but-returns). Renders a thank-you state once
 * the user has subscribed, persisted in localStorage so we don't ask twice.
 */
export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem(SUBSCRIBED_KEY) === '1') setStatus('done');
  }, []);

  if (!mounted) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || status === 'submitting') return;
    setStatus('submitting');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) throw new Error(String(res.status));
      localStorage.setItem(SUBSCRIBED_KEY, '1');
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section
      className="border-t border-neutral-100 dark:border-white/10 px-6 md:px-[8%] lg:px-[12%] py-16 md:py-24"
      aria-labelledby="newsletter-heading"
    >
      <div className="grid md:grid-cols-12 gap-10">
        <div className="md:col-span-6">
          <p className="text-[#c53a1a] text-[11px] font-medium uppercase tracking-[0.3em] mb-4">
            Stay in touch
          </p>
          <h2
            id="newsletter-heading"
            className="font-display text-3xl md:text-4xl lg:text-5xl leading-[0.95] tracking-tight"
          >
            One word a week.<br />Nothing else.
          </h2>
        </div>

        <div className="md:col-span-5 md:col-start-8 flex flex-col justify-center">
          {status === 'done' ? (
            <p className="text-foreground text-lg leading-relaxed">
              Thanks. See you next week.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  aria-label="Your email address"
                  className="flex-1 px-4 py-3 bg-transparent border border-neutral-200 dark:border-white/15 focus:border-[#c53a1a] outline-none transition-colors text-base font-display"
                />
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="px-6 py-3 bg-foreground text-background text-sm uppercase tracking-wider hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {status === 'submitting' ? '…' : 'Subscribe'}
                </button>
              </div>
              <p className="text-xs text-neutral-500">
                A short letter on Sundays. Unsubscribe in one click. No tracking, no funnel.
              </p>
              {status === 'error' && (
                <p className="text-xs text-[#c53a1a]">Something went wrong. Please try again.</p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
