'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '../lib/format';

const KEY = 'mfn-recent-v1';
type Item = { handle: string; title: string; image?: string; amount?: string; currency?: string };

export function RecentlyViewedTracker({ item }: { item: Item }) {
  useEffect(() => {
    try {
      const prev: Item[] = JSON.parse(localStorage.getItem(KEY) || '[]');
      const next = [item, ...prev.filter((p) => p.handle !== item.handle)].slice(0, 8);
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.handle]);
  return null;
}

export function RecentlyViewed({ excludeHandle, dark = false }: { excludeHandle?: string; dark?: boolean }) {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    try {
      const all: Item[] = JSON.parse(localStorage.getItem(KEY) || '[]');
      setItems(all.filter((i) => i.handle !== excludeHandle).slice(0, 4));
    } catch {}
  }, [excludeHandle]);

  if (items.length === 0) return null;
  return (
    <section className={`px-6 md:px-16 py-24 ${dark ? 'bg-mfn-midnight text-mfn-silk' : ''}`}>
      <div className="max-w-[1700px] mx-auto">
        <span className="text-[9px] uppercase tracking-[0.5em] text-mfn-gold block mb-3">Pick up where you left off</span>
        <h3 className="font-serif text-4xl font-light mb-12">Recently Viewed</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {items.map((i) => (
            <Link key={i.handle} href={`/products/${i.handle}`} className="group">
              <div className="relative aspect-[3/4] bg-mfn-blush overflow-hidden mb-4">
                {i.image && <Image src={i.image} alt={i.title} fill sizes="25vw" className="object-cover transition-transform duration-[1400ms] group-hover:scale-105" />}
              </div>
              <p className="text-[11px] uppercase tracking-[0.3em] line-clamp-1">{i.title}</p>
              {i.amount && <p className="font-serif italic text-sm opacity-60 mt-1">{formatPrice(i.amount, i.currency)}</p>}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
