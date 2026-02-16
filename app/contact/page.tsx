'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ firstName: '', lastName: '', phone: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="section-subtitle mb-6">Connect</p>
        <h1 className="section-title mb-4">Get in Touch</h1>
        <p className="text-muted-foreground">
          Send us a note.
        </p>
      </div>

      {/* Success Message */}
      {status === 'success' && (
        <div className="mb-12 p-6 bg-green-50 border border-green-200 text-center">
          <p className="tifinagh text-2xl mb-2">ⵜⴰⵏⵎⵎⵉⵔⵜ</p>
          <p className="text-green-800">Thank you for your message. We&apos;ll be in touch soon.</p>
        </div>
      )}

      {/* Error Message */}
      {status === 'error' && (
        <div className="mb-12 p-6 bg-red-50 border border-red-200 text-center">
          <p className="text-red-800">Something went wrong. Please try again.</p>
        </div>
      )}

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-transparent border border-foreground/20 focus:border-foreground outline-none transition-colors"
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-transparent border border-foreground/20 focus:border-foreground outline-none transition-colors"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-transparent border border-foreground/20 focus:border-foreground outline-none transition-colors"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-transparent border border-foreground/20 focus:border-foreground outline-none transition-colors"
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
            Message <span className="normal-case text-muted-foreground/60">(optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            className="w-full px-4 py-3 bg-transparent border border-foreground/20 focus:border-foreground outline-none transition-colors resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full sm:w-auto px-12 py-4 bg-foreground text-background uppercase tracking-widest text-sm hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'sending' ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>

      {/* Additional Info */}
      <div className="mt-20 pt-12 border-t border-foreground/10 text-center">
        <p className="tifinagh text-3xl mb-4">ⴰⵎⴰⵡⴰⵍ</p>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          A living dictionary preserving the beauty and diversity of Tamazight languages across North Africa.
        </p>
      </div>

      {/* Back Link */}
      <div className="mt-12 text-center">
        <Link href="/" className="nav-link">
          ← Back to Dictionary
        </Link>
      </div>
    </div>
  );
}
