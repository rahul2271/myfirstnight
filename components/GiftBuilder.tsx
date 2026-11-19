'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from './CartDrawer';
import { formatPrice } from '../lib/format';

const MAX_PIECES = 3;
const BUNDLE_CODE = process.env.NEXT_PUBLIC_GIFT_BUNDLE_CODE || '';
const BUNDLE_LABEL = process.env.NEXT_PUBLIC_GIFT_BUNDLE_LABEL || '';

type Pick = { handle: string; variantId: string };

export function GiftBuilder({ products, preselect }: { products: any[]; preselect?: string }) {
  const { addToCart, setCouponCode } = useCart();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [picks, setPicks] = useState<Pick[]>(() => {
    const p = products.find(({ node }) => node.handle === preselect)?.node;
    const v = p?.variants?.edges?.find((e: any) => e.node.availableForSale)?.node;
    return p && v && p.variants.edges.length === 1 ? [{ handle: p.handle, variantId: v.id }] : p ? [{ handle: p.handle, variantId: '' }] : [];
  });
  const [initials, setInitials] = useState('');
  const [forName, setForName] = useState('');
  const [note, setNote] = useState('');
  const [agree, setAgree] = useState(false);
  const [done, setDone] = useState(false);

  const byHandle = useMemo(() => Object.fromEntries(products.map(({ node }) => [node.handle, node])), [products]);
  const chosen = picks.map((p) => {
    const product = byHandle[p.handle];
    const variant = product?.variants?.edges?.find((e: any) => e.node.id === p.variantId)?.node;
    return { product, variant, pick: p };
  });
  const ready = chosen.length > 0 && chosen.every((c) => c.variant);
  const currency = chosen[0]?.product?.priceRange?.maxVariantPrice?.currencyCode || 'INR';
  const subtotal = chosen.reduce((a, c) => a + parseFloat(c.variant?.price?.amount || c.product?.priceRange?.maxVariantPrice?.amount || '0'), 0);
  const bundleActive = !!BUNDLE_CODE && chosen.length >= 2;

  const toggle = (handle: string) => {
    setPicks((prev) => {
      if (prev.some((p) => p.handle === handle)) return prev.filter((p) => p.handle !== handle);
      if (prev.length >= MAX_PIECES) return prev;
      const product = byHandle[handle];
      const sellable = product.variants.edges.filter((e: any) => e.node.availableForSale);
      // single-variant products need no size choice
      const auto = product.variants.edges.length === 1 && sellable.length === 1 ? sellable[0].node.id : '';
      return [...prev, { handle, variantId: auto }];
    });
  };
  const setVariant = (handle: string, variantId: string) =>
    setPicks((prev) => prev.map((p) => (p.handle === handle ? { ...p, variantId } : p)));

  const addAll = () => {
    const bundleId = `gift-${Date.now().toString(36)}`;
    chosen.forEach(({ product, variant }, i) => {
      const attrs: { key: string; value: string }[] = [{ key: '_Gift set', value: bundleId }];
      if (initials) attrs.push({ key: 'Monogram', value: initials });
      if (i === 0 && forName.trim()) attrs.push({ key: 'Gift for', value: forName.trim() });
      if (i === 0 && note.trim()) attrs.push({ key: 'Gift note', value: note.trim() });
      addToCart(product, variant.id, variant.title === 'Default Title' ? 'One size' : variant.title, undefined, attrs);
    });
    if (bundleActive) setCouponCode(BUNDLE_CODE); // validated by Shopify in the bag; removed if not valid
    setDone(true);
  };

  const field = 'w-full bg-transparent border-b border-mfn-midnight/30 py-3 focus:outline-none focus:border-mfn-gold transition-colors';
  const stepNames = ['Choose', 'Personalise', 'Review'];

  return (
    <div className="max-w-[1500px] mx-auto px-6 md:px-16 py-20">
      {/* Stepper */}
      <ol className="flex justify-center gap-8 md:gap-16 mb-20 text-[10px] uppercase tracking-[0.35em]">
        {stepNames.map((n, i) => (
          <li key={n} className={`flex items-center gap-3 ${step === i + 1 ? 'text-mfn-midnight' : 'text-mfn-midnight/35'}`}>
            <span className={`font-serif italic text-2xl ${step === i + 1 ? 'text-mfn-gold' : ''}`}>0{i + 1}</span>
            <span className="hidden sm:inline">{n}</span>
          </li>
        ))}
      </ol>

      {done ? (
        <div className="text-center py-24 max-w-xl mx-auto">
          <span className="text-mfn-gold text-3xl block mb-6">✧</span>
          <h2 className="font-serif text-5xl font-light mb-6">Your gift set is in the bag.</h2>
          <p className="text-sm font-light text-mfn-midnight/65 leading-relaxed mb-10">
            Your monogram and note travel with the order so our atelier can prepare it.
            {bundleActive && BUNDLE_LABEL ? ` Your gift-set privilege (${BUNDLE_LABEL}) is checked against the bag.` : ''}
          </p>
          <Link href="/discover" className="link-lux text-[9px] uppercase tracking-[0.4em]">Continue exploring</Link>
        </div>
      ) : (
        <>
          {/* STEP 1 */}
          {step === 1 && (
            <section>
              <div className="text-center mb-14">
                <h2 className="font-serif text-4xl md:text-6xl font-light mb-4">Choose up to {MAX_PIECES} pieces</h2>
                <p className="text-sm font-light text-mfn-midnight/60">
                  Select a piece and its size.{BUNDLE_LABEL && BUNDLE_CODE ? ` Pair two or more for ${BUNDLE_LABEL}.` : ''}
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 md:gap-x-8 gap-y-14">
                {products.map(({ node: p }) => {
                  const sel = picks.find((x) => x.handle === p.handle);
                  const multi = p.variants.edges.length > 1;
                  return (
                    <div key={p.id}>
                      <button onClick={() => toggle(p.handle)} aria-pressed={!!sel} className="group block w-full text-left">
                        <div className={`relative aspect-[3/4] bg-mfn-blush overflow-hidden mb-4 border transition-colors duration-500 ${sel ? 'border-mfn-gold' : 'border-transparent'}`}>
                          {p.featuredImage && <Image src={p.featuredImage.url} alt={p.title} fill sizes="25vw" className="object-cover transition-transform duration-[1400ms] group-hover:scale-105" />}
                          <span className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${sel ? 'bg-mfn-gold text-mfn-midnight' : 'bg-mfn-silk/80 text-mfn-midnight/40'}`}>
                            {sel ? '✓' : '+'}
                          </span>
                        </div>
                        <p className="text-[11px] uppercase tracking-[0.3em] line-clamp-1">{p.title}</p>
                        <p className="font-serif italic text-sm text-mfn-midnight/55 mt-1">{formatPrice(p.priceRange.maxVariantPrice.amount, p.priceRange.maxVariantPrice.currencyCode)}</p>
                      </button>
                      {sel && multi && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {p.variants.edges.map(({ node: v }: any) => (
                            <button
                              key={v.id}
                              disabled={!v.availableForSale}
                              onClick={() => setVariant(p.handle, v.id)}
                              className={`px-3 py-2 text-[10px] tracking-widest border transition-colors ${sel.variantId === v.id ? 'bg-mfn-midnight text-mfn-silk border-mfn-midnight' : 'border-mfn-midnight/20 hover:border-mfn-midnight'} disabled:opacity-30 disabled:line-through`}
                            >
                              {v.title}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <section className="grid md:grid-cols-2 gap-16 md:gap-28 items-start">
              <div className="space-y-10">
                <div>
                  <h2 className="font-serif text-4xl md:text-5xl font-light mb-3">Make it personal</h2>
                  <p className="text-sm font-light text-mfn-midnight/60">All fields are optional.</p>
                </div>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-mfn-midnight/60">Monogram (up to 3 letters)</span>
                  <input value={initials} onChange={(e) => setInitials(e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 3))} placeholder="A  &  R" className={`${field} font-serif text-3xl tracking-[0.3em]`} />
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-mfn-midnight/60">Gift for</span>
                  <input value={forName} onChange={(e) => setForName(e.target.value.slice(0, 40))} placeholder="Her name" className={`${field} text-lg`} />
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-mfn-midnight/60">Handwritten note ({note.length}/180)</span>
                  <textarea value={note} onChange={(e) => setNote(e.target.value.slice(0, 180))} rows={4} placeholder="Write something only she will read…" className={`${field} resize-none text-base`} />
                </label>
              </div>

              {/* Live preview */}
              <div className="md:sticky md:top-40">
                <div className="bg-mfn-midnight grain relative p-10 md:p-14 text-center">
                  <div className="relative z-10">
                    <div className="mx-auto w-28 h-28 rounded-full bg-gradient-to-br from-mfn-champagne via-mfn-gold to-[#8a7048] shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center justify-center">
                      <span className="font-serif text-4xl text-mfn-midnight/80 tracking-widest pl-1">{initials || '✧'}</span>
                    </div>
                    <p className="text-[9px] uppercase tracking-[0.5em] text-mfn-champagne mt-8">{forName ? `For ${forName}` : 'MyFirstNight'}</p>
                    <div className="mt-8 bg-mfn-blush text-mfn-midnight p-8 min-h-[140px] flex items-center justify-center">
                      <p className="font-serif italic text-lg leading-relaxed whitespace-pre-line break-words max-w-full">{note || 'Your note appears here.'}</p>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] tracking-widest text-mfn-midnight/45 mt-4 text-center">Preview only. Final finish is handled by our atelier.</p>
              </div>
            </section>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <section className="max-w-3xl mx-auto">
              <h2 className="font-serif text-4xl md:text-6xl font-light mb-12 text-center">Review your gift set</h2>
              <div className="divide-y divide-mfn-midnight/10 border-y border-mfn-midnight/10">
                {chosen.map(({ product, variant }) => (
                  <div key={product.id} className="flex items-center gap-6 py-6">
                    <div className="relative w-16 h-20 bg-mfn-blush shrink-0">{product.featuredImage && <Image src={product.featuredImage.url} alt="" fill sizes="64px" className="object-cover" />}</div>
                    <div className="flex-grow">
                      <p className="text-[11px] uppercase tracking-[0.3em]">{product.title}</p>
                      <p className="text-[10px] tracking-widest text-mfn-midnight/50 mt-1">{variant.title === 'Default Title' ? 'One size' : `Size ${variant.title}`}</p>
                    </div>
                    <p className="font-serif italic">{formatPrice(variant.price.amount, variant.price.currencyCode)}</p>
                  </div>
                ))}
              </div>
              <div className="py-8 space-y-2 text-sm font-light text-mfn-midnight/70">
                {initials && <p>Monogram: <span className="font-serif text-lg tracking-[0.25em] text-mfn-midnight">{initials}</span></p>}
                {forName && <p>For: {forName}</p>}
                {note && <p className="italic font-serif text-lg">“{note}”</p>}
              </div>
              <div className="flex justify-between border-t border-mfn-midnight/10 pt-6 mb-2">
                <span className="text-[10px] uppercase tracking-[0.3em]">Subtotal</span>
                <span className="font-serif italic text-2xl">{formatPrice(subtotal, currency)}</span>
              </div>
              {bundleActive && BUNDLE_LABEL && <p className="text-[10px] uppercase tracking-[0.3em] text-mfn-gold text-right mb-6">✦ Gift-set privilege: {BUNDLE_LABEL} (confirmed in your bag)</p>}

              {(initials || note || forName) && (
                <label className="flex items-start gap-3 mt-8 text-xs font-light text-mfn-midnight/70 leading-relaxed cursor-pointer">
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 accent-mfn-gold" />
                  <span>I understand personalised pieces cannot be returned or exchanged unless faulty. <Link href="/policies/returns" className="underline">Read policy</Link></span>
                </label>
              )}
            </section>
          )}

          {/* Controls */}
          <div className="mt-20 flex items-center justify-between border-t border-mfn-midnight/10 pt-8 max-w-[1500px]">
            <button onClick={() => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2) : s))} className={`text-[10px] uppercase tracking-[0.35em] ${step === 1 ? 'invisible' : 'link-lux'}`}>← Back</button>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.3em] text-mfn-midnight/50 mb-3">
                {chosen.length} of {MAX_PIECES} pieces · {formatPrice(subtotal, currency)}
              </p>
              {step < 3 ? (
                <button
                  disabled={!ready}
                  onClick={() => setStep((s) => (s + 1) as 2 | 3)}
                  className="bg-mfn-midnight text-mfn-silk px-12 py-5 text-[10px] uppercase tracking-[0.4em] hover:bg-mfn-gold hover:text-mfn-midnight transition-colors duration-500 disabled:opacity-30 disabled:hover:bg-mfn-midnight disabled:hover:text-mfn-silk"
                >
                  {ready ? 'Continue' : chosen.length ? 'Select a size for each piece' : 'Select a piece'}
                </button>
              ) : (
                <button
                  disabled={(!!(initials || note || forName)) && !agree}
                  onClick={addAll}
                  className="bg-mfn-midnight text-mfn-silk px-12 py-5 text-[10px] uppercase tracking-[0.4em] hover:bg-mfn-gold hover:text-mfn-midnight transition-colors duration-500 disabled:opacity-30"
                >
                  Add Gift Set to Bag
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
