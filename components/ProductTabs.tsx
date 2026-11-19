'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProductCard } from './ProductCard';

export function ProductTabs({ tabs }: { tabs: { key: string; label: string; products: any[] }[] }) {
  const [active, setActive] = useState(tabs[0]?.key);
  const current = tabs.find((t) => t.key === active) || tabs[0];
  if (!current) return null;

  return (
    <div className="max-w-[1700px] mx-auto px-6 md:px-16">
      <div className="flex flex-wrap items-end justify-between gap-8 mb-14">
        <div>
          <span className="text-[9px] uppercase tracking-[0.5em] text-mfn-gold block mb-3">Shop the House</span>
          <h3 className="text-4xl md:text-6xl font-serif font-light">Just Arrived & Most Loved</h3>
        </div>
        <div className="flex gap-8 text-[10px] uppercase tracking-[0.35em]">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setActive(t.key)} className={`pb-2 border-b transition-colors ${active === t.key ? 'border-mfn-midnight' : 'border-transparent text-mfn-midnight/40 hover:text-mfn-midnight'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 md:gap-x-10 gap-y-14" key={current.key}>
        {current.products.slice(0, 8).map(({ node }: any) => (
          <div key={node.id} className="animate-fade-in">
            <ProductCard product={node} sizes="(max-width: 768px) 50vw, 25vw" />
          </div>
        ))}
      </div>
      <div className="text-center mt-16">
        <Link href="/discover" className="link-lux text-[9px] uppercase tracking-[0.4em]">View the full archive</Link>
      </div>
    </div>
  );
}
