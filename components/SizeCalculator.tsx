'use client';

import { useState } from 'react';
import { whatsappLink } from '../lib/config';

const cups = ['AA', 'A', 'B', 'C', 'D', 'DD', 'E', 'F', 'G'];

export function SizeCalculator() {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [under, setUnder] = useState('');
  const [bust, setBust] = useState('');

  const toIn = (v: string) => (unit === 'cm' ? parseFloat(v) / 2.54 : parseFloat(v));
  const u = toIn(under);
  const b = toIn(bust);
  const valid = !isNaN(u) && !isNaN(b) && u >= 24 && u <= 50 && b > u - 1 && b <= 60;

  let result = '';
  if (valid) {
    const band = Math.round(u / 2) * 2; // nearest even inch
    const diff = Math.max(0, Math.round(b - band));
    result = `${band}${cups[Math.min(diff, cups.length - 1)]}`;
  }

  const field = 'w-full bg-transparent border-b border-mfn-midnight/30 py-3 text-lg font-serif focus:outline-none focus:border-mfn-gold transition-colors';

  return (
    <div className="max-w-2xl mx-auto bg-mfn-blush p-8 md:p-14">
      <div className="flex gap-6 mb-10 text-[10px] uppercase tracking-[0.3em]">
        {(['in', 'cm'] as const).map((x) => (
          <button key={x} onClick={() => setUnit(x)} className={unit === x ? 'border-b border-mfn-midnight pb-1' : 'text-mfn-midnight/50 pb-1'}>
            {x === 'in' ? 'Inches' : 'Centimetres'}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-10 mb-10">
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.3em] text-mfn-midnight/60">Underbust ({unit})</span>
          <input inputMode="decimal" value={under} onChange={(e) => setUnder(e.target.value)} placeholder={unit === 'in' ? '30' : '76'} className={field} />
        </label>
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.3em] text-mfn-midnight/60">Fullest bust ({unit})</span>
          <input inputMode="decimal" value={bust} onChange={(e) => setBust(e.target.value)} placeholder={unit === 'in' ? '34' : '86'} className={field} />
        </label>
      </div>

      <div className="border-t border-mfn-midnight/10 pt-8 text-center min-h-[120px] flex flex-col items-center justify-center">
        {valid ? (
          <>
            <span className="text-[9px] uppercase tracking-[0.5em] text-mfn-gold mb-2">Your estimated size</span>
            <span className="font-serif text-7xl font-light">{result}</span>
            <a
              href={whatsappLink(`Hello MyFirstNight, my estimated size is ${result}. Could you advise?`) || '/contact'}
              target="_blank" rel="noopener noreferrer"
              className="link-lux text-[9px] uppercase tracking-[0.4em] mt-6"
            >
              Confirm with our concierge
            </a>
          </>
        ) : (
          <p className="font-serif italic text-mfn-midnight/50 text-lg">Enter both measurements to see your size.</p>
        )}
      </div>
    </div>
  );
}
