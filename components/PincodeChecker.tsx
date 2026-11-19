'use client';

import { useEffect, useState } from 'react';

type Result = { city: string; state: string; serviceable: boolean | null; cod: boolean | null; etaFrom: string | null; etaTo: string | null };
const KEY = 'mfn-pin';
const fmt = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

export function PincodeChecker() {
  const [pin, setPin] = useState('');
  const [res, setRes] = useState<Result | null>(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const check = async (value = pin) => {
    if (!/^[1-9][0-9]{5}$/.test(value)) return setErr('Enter a valid 6-digit pincode.');
    setBusy(true);
    setErr('');
    try {
      const r = await fetch(`/api/pincode?pin=${value}`);
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || 'Could not check this pincode.');
      setRes(j);
      try { localStorage.setItem(KEY, value); } catch {}
    } catch (e: any) {
      setRes(null);
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) { setPin(saved); check(saved); }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="border border-mfn-midnight/10 p-6 mt-8">
      <span className="text-[10px] uppercase tracking-[0.3em] font-medium block mb-4">Delivery &amp; Cash on Delivery</span>
      <div className="flex border-b border-mfn-midnight/30 focus-within:border-mfn-gold transition-colors">
        <input
          inputMode="numeric"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          onKeyDown={(e) => e.key === 'Enter' && check()}
          placeholder="Enter pincode"
          aria-label="Delivery pincode"
          className="bg-transparent flex-grow py-3 text-sm tracking-[0.2em] placeholder:text-mfn-midnight/35 focus:outline-none"
        />
        <button onClick={() => check()} disabled={busy} className="text-[9px] uppercase tracking-[0.4em] hover:text-mfn-gold transition-colors disabled:opacity-40">
          {busy ? '…' : 'Check'}
        </button>
      </div>

      {err && <p className="text-xs text-red-800 mt-3">{err}</p>}

      {res && (
        <div className="mt-4 space-y-2 text-xs font-light text-mfn-midnight/75">
          {res.serviceable === false ? (
            <p>We don’t deliver to {res.city || 'this pincode'} yet. Message our concierge and we’ll see what is possible.</p>
          ) : (
            <>
              <p>
                Delivering to <span className="font-medium text-mfn-midnight">{[res.city, res.state].filter(Boolean).join(', ') || res.state}</span>
              </p>
              {res.serviceable && res.etaFrom && res.etaTo ? (
                <p>Estimated delivery <span className="font-medium text-mfn-midnight">{fmt(res.etaFrom)} – {fmt(res.etaTo)}</span></p>
              ) : (
                <p>Your delivery date is confirmed at checkout.</p>
              )}
              {res.cod === true && <p className="text-mfn-gold uppercase tracking-[0.25em] text-[10px]">✦ Cash on delivery available</p>}
              {res.cod === false && <p className="text-mfn-midnight/50">Prepaid orders only for this pincode.</p>}
            </>
          )}
        </div>
      )}
    </div>
  );
}
