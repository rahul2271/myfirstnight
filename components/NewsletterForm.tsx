'use client';

import { useState } from 'react';
import { useCart } from './CartDrawer';

export function NewsletterForm() {
  const { setCouponCode } = useCart();
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [msg, setMsg] = useState('');
  const [code, setCode] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Something went wrong.');
      try { localStorage.setItem('mfn-email', email); } catch {}
      setCode(data.code);
      setState('done');
    } catch (err: any) {
      setMsg(err.message);
      setState('error');
    }
  };

  if (state === 'done') {
    return (
      <div className="text-center">
        <p className="font-serif italic text-3xl font-light mb-4">Welcome to the Inner Circle.</p>
        {code ? (
          <>
            <p className="text-xs text-mfn-silk/60 mb-5">Your private welcome code</p>
            <button
              onClick={() => setCouponCode(code)}
              className="border border-mfn-gold text-mfn-champagne px-8 py-4 text-[11px] uppercase tracking-[0.4em] hover:bg-mfn-gold hover:text-mfn-midnight transition-colors"
            >
              {code} · Add to my bag
            </button>
          </>
        ) : (
          <p className="text-xs text-mfn-silk/60">Private invitations will arrive in your inbox.</p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className="flex flex-col md:flex-row gap-4 border-b border-mfn-silk/30 pb-3 focus-within:border-mfn-gold transition-colors">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your Email Address"
          aria-label="Email address"
          className="bg-transparent border-none outline-none text-center md:text-left text-sm flex-grow text-mfn-silk placeholder:text-mfn-silk/40 uppercase tracking-widest font-light focus:ring-0"
        />
        <button disabled={state === 'loading'} className="text-[9px] uppercase tracking-[0.4em] hover:text-mfn-champagne transition-colors shrink-0 pt-2 md:pt-0 disabled:opacity-50">
          {state === 'loading' ? 'Please wait…' : 'Request Access'}
        </button>
      </div>
      {state === 'error' && <p className="text-xs text-red-300 mt-4">{msg}</p>}
    </form>
  );
}
