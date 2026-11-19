'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CONSENT_KEY } from '../lib/analytics';

export function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try { setShow(!localStorage.getItem(CONSENT_KEY)); } catch {}
  }, []);

  const choose = (v: 'granted' | 'denied') => {
    try { localStorage.setItem(CONSENT_KEY, v); } catch {}
    window.dispatchEvent(new Event('mfn-consent'));
    setShow(false);
  };

  if (!show) return null;
  return (
    <div role="dialog" aria-label="Cookie preferences" className="fixed bottom-4 left-4 right-4 md:right-auto md:max-w-md z-[60] bg-mfn-midnight text-mfn-silk p-6 shadow-2xl border border-mfn-gold/30">
      <p className="text-xs font-light leading-relaxed text-mfn-silk/80 mb-5">
        We use cookies to understand how the site is used and to show relevant offers. Read our{' '}
        <Link href="/policies/privacy" className="underline text-mfn-champagne">privacy policy</Link>.
      </p>
      <div className="flex gap-6 text-[9px] uppercase tracking-[0.35em]">
        <button onClick={() => choose('granted')} className="bg-mfn-silk text-mfn-midnight px-6 py-3 hover:bg-mfn-champagne transition-colors">Accept</button>
        <button onClick={() => choose('denied')} className="text-mfn-silk/60 hover:text-mfn-silk transition-colors">Decline</button>
      </div>
    </div>
  );
}
