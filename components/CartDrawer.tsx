'use client';

import { useState, useEffect, useRef, createContext, useContext, ReactNode } from 'react';
import Image from 'next/image';
import { quoteShopifyCart, CartQuote } from '../lib/shopify/cart';
import { formatPrice } from '../lib/format';
import { track, numericId } from '../lib/analytics';

export const itemKey = (i: any) => i.key || i.variantId;

const STORAGE_KEY = 'mfn-cart-v1';
const COUPON_KEY = 'mfn-coupon-v1';
const FREE_SHIPPING = parseFloat(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || '0');

interface CartContextType {
  cart: any[];
  addToCart: (product: any, variantId: string, size: string, customPrice?: number, attributes?: { key: string; value: string }[]) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  couponCode: string;
  setCouponCode: (code: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [couponCode, setCouponCodeState] = useState('');
  const [hydrated, setHydrated] = useState(false);

  // Restore cart + coupon so a refresh never empties the bag
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCart(JSON.parse(saved));
      const c = localStorage.getItem(COUPON_KEY);
      if (c) setCouponCodeState(c);
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch {}
  }, [cart, hydrated]);

  const setCouponCode = (code: string) => {
    setCouponCodeState(code);
    try { code ? localStorage.setItem(COUPON_KEY, code) : localStorage.removeItem(COUPON_KEY); } catch {}
  };

  const addToCart = (product: any, variantId: string, size: string, customPrice?: number, attributes: { key: string; value: string }[] = []) => {
    const lineKey = attributes.length ? `${variantId}|${attributes.map((a) => `${a.key}=${a.value}`).join(';')}` : variantId;
    const variantNode = product.variants?.edges?.find((v: any) => v.node.id === variantId)?.node;
    const currencyCode = variantNode?.price?.currencyCode || product.priceRange?.maxVariantPrice?.currencyCode || 'INR';
    const itemPrice =
      customPrice !== undefined
        ? { amount: customPrice.toString(), currencyCode }
        : variantNode?.price || product.priceRange?.maxVariantPrice;

    track('add_to_cart', {
      currency: currencyCode,
      items: [{ id: numericId(product.id), name: product.title, price: parseFloat(itemPrice?.amount || '0'), quantity: 1, variant: size }],
    });

    setCart((prev) => {
      const existing = prev.find((item) => itemKey(item) === lineKey);
      if (existing) {
        return prev.map((item) => (itemKey(item) === lineKey ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          handle: product.handle,
          price: itemPrice,
          image: product.images?.edges?.[0]?.node?.url,
          variantId,
          key: lineKey,
          attributes,
          size,
          quantity: 1,
        },
      ];
    });
    setIsOpen(true);
  };

  const removeFromCart = (key: string) => setCart((prev) => prev.filter((i) => itemKey(i) !== key));

  const updateQuantity = (key: string, delta: number) =>
    setCart((prev) =>
      prev
        .map((i) => (itemKey(i) === key ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, isOpen, setIsOpen, couponCode, setCouponCode }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}

export function CartDrawerTrigger() {
  const { cart, setIsOpen } = useCart();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <button
      onClick={() => setIsOpen(true)}
      aria-label="Open cart"
      className="text-[9px] uppercase tracking-[0.4em] hover:text-mfn-gold transition-colors flex items-center gap-2"
    >
      <span>Bag</span>
      <span className="w-5 h-5 rounded-full bg-mfn-gold text-mfn-midnight text-[9px] flex items-center justify-center">
        {totalItems}
      </span>
    </button>
  );
}

export function CartDrawerContent() {
  const { cart, removeFromCart, updateQuantity, isOpen, setIsOpen, couponCode, setCouponCode } = useCart();
  const [codeInput, setCodeInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [quote, setQuote] = useState<CartQuote | null>(null);
  const [busy, setBusy] = useState(false);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const reqId = useRef(0);
  const [saveOpen, setSaveOpen] = useState(false);
  const [saveEmail, setSaveEmail] = useState('');
  const [saveOptIn, setSaveOptIn] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [saveMsg, setSaveMsg] = useState('');

  const currency = cart[0]?.price?.currencyCode || 'INR';
  const localSubtotal = cart.reduce((acc, item) => acc + parseFloat(item.price?.amount || 0) * item.quantity, 0);

  // Ask Shopify to price the bag with the saved coupon whenever the bag or code changes
  useEffect(() => {
    if (!couponCode || cart.length === 0) {
      setQuote(null);
      return;
    }
    const id = ++reqId.current;
    setBusy(true);
    quoteShopifyCart(cart, couponCode).then((q) => {
      if (id !== reqId.current) return;
      setQuote(q);
      setBusy(false);
      if (q.codeApplicable === false) {
        setCouponMsg({ ok: false, text: `“${couponCode}” can’t be applied to this bag.` });
        setCouponCode('');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart, couponCode]);

  const applyCoupon = async () => {
    const code = codeInput.trim();
    if (!code || cart.length === 0) return;
    setBusy(true);
    setCouponMsg(null);
    const q = await quoteShopifyCart(cart, code);
    setBusy(false);
    if (q.error) return setCouponMsg({ ok: false, text: q.error });
    if (!q.codeApplicable) return setCouponMsg({ ok: false, text: 'This code is invalid, expired or not valid for these pieces.' });
    setCouponCode(code.toUpperCase());
    setQuote(q);
    setCodeInput('');
    setCouponMsg({ ok: true, text: `“${code.toUpperCase()}” applied.` });
  };

  const saveBag = async () => {
    setSaveState('sending');
    try {
      const res = await fetch('/api/save-bag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: saveEmail,
          optIn: saveOptIn,
          couponCode: couponCode || undefined,
          items: cart.map((i) => ({ variantId: i.variantId, quantity: i.quantity, title: i.title, size: i.size, attributes: i.attributes || [] })),
        }),
      });
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error(j.error || 'Something went wrong.');
      try { localStorage.setItem('mfn-email', saveEmail.trim().toLowerCase()); } catch {}
      track('lead');
      setSaveState('sent');
    } catch (e: any) {
      setSaveMsg(e.message);
      setSaveState('error');
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setQuote(null);
    setCouponMsg(null);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsLoadingCheckout(true);
    track('begin_checkout', {
      currency,
      value: total,
      items: cart.map((i) => ({ id: numericId(i.id), name: i.title, price: parseFloat(i.price?.amount || '0'), quantity: i.quantity, variant: i.size })),
    });
    const q = await quoteShopifyCart(cart, couponCode || undefined);
    if (q.checkoutUrl) {
      window.location.href = q.checkoutUrl; // Shopify secure checkout (discount carried over)
    } else {
      alert(q.error || 'Unable to initialise checkout. Please try again.');
      setIsLoadingCheckout(false);
    }
  };

  const discount = quote?.discount || 0;
  const total = couponCode && quote ? quote.total : localSubtotal;
  const toFree = FREE_SHIPPING > 0 ? Math.max(FREE_SHIPPING - total, 0) : 0;
  const progress = FREE_SHIPPING > 0 ? Math.min((total / FREE_SHIPPING) * 100, 100) : 0;

  return (
    <>
      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
      )}

      <div
        className={`fixed inset-y-0 right-0 h-full w-full max-w-md bg-mfn-silk text-mfn-midnight shadow-2xl z-50 transform transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex justify-between items-center px-8 py-7 border-b border-mfn-midnight/10">
          <span className="font-serif text-2xl font-light">Your Bag</span>
          <button onClick={() => setIsOpen(false)} className="text-[10px] uppercase tracking-[0.3em] hover:text-mfn-gold transition-colors">
            Close ✕
          </button>
        </div>

        {FREE_SHIPPING > 0 && cart.length > 0 && (
          <div className="px-8 pt-5">
            <p className="text-[10px] uppercase tracking-[0.25em] text-mfn-midnight/60 mb-3">
              {toFree > 0 ? `Add ${formatPrice(toFree, currency)} for complimentary shipping` : 'You have unlocked complimentary shipping ✦'}
            </p>
            <div className="h-px bg-mfn-midnight/10 relative">
              <div className="absolute inset-y-0 left-0 h-[2px] -top-px bg-mfn-gold transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <div className="flex-grow overflow-y-auto px-8 py-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <p className="font-serif italic text-2xl font-light text-mfn-midnight/50 mb-6">Your bag is waiting to be filled.</p>
              <button onClick={() => setIsOpen(false)} className="link-lux text-[9px] uppercase tracking-[0.4em]">
                Continue exploring
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={itemKey(item)} className="flex gap-5 pb-6 border-b border-mfn-midnight/10">
                <div className="relative w-20 h-28 bg-mfn-blush overflow-hidden shrink-0">
                  {item.image && <Image src={item.image} alt={item.title} fill sizes="80px" className="object-cover" />}
                </div>
                <div className="flex flex-col flex-grow">
                  <h4 className="text-[11px] uppercase tracking-[0.2em] font-medium mb-1">{item.title}</h4>
                  <p className="text-[10px] text-mfn-midnight/50 tracking-widest uppercase mb-2">Size: {item.size}</p>
                  {(item.attributes || []).filter((a: any) => !a.key.startsWith('_')).map((a: any) => (
                    <p key={a.key} className="text-[10px] text-mfn-gold tracking-widest uppercase mb-1 line-clamp-2">✦ {a.key}: {a.value}</p>
                  ))}
                  <p className="text-sm font-serif italic mb-3">
                    {formatPrice(item.price?.amount, item.price?.currencyCode)}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center border border-mfn-midnight/20">
                      <button onClick={() => updateQuantity(itemKey(item), -1)} aria-label="Decrease quantity" className="w-8 h-8 hover:bg-mfn-midnight hover:text-mfn-silk transition-colors">−</button>
                      <span className="w-8 text-center text-xs">{item.quantity}</span>
                      <button onClick={() => updateQuantity(itemKey(item), 1)} aria-label="Increase quantity" className="w-8 h-8 hover:bg-mfn-midnight hover:text-mfn-silk transition-colors">+</button>
                    </div>
                    <button onClick={() => removeFromCart(itemKey(item))} className="text-[9px] text-mfn-midnight/40 hover:text-mfn-midnight uppercase tracking-widest">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-8 border-t border-mfn-midnight/10 bg-mfn-blush flex flex-col gap-4">
            {/* Coupon */}
            {couponCode ? (
              <div className="flex items-center justify-between border border-mfn-gold/60 px-4 py-3 text-[10px] uppercase tracking-[0.25em]">
                <span>✦ {couponCode}</span>
                <button onClick={removeCoupon} className="text-mfn-midnight/50 hover:text-mfn-midnight">Remove</button>
              </div>
            ) : (
              <div>
                <div className="flex border-b border-mfn-midnight/30 focus-within:border-mfn-midnight transition-colors">
                  <input
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                    placeholder="Gift or discount code"
                    className="bg-transparent flex-grow py-3 text-xs uppercase tracking-[0.2em] placeholder:text-mfn-midnight/40 focus:outline-none"
                  />
                  <button onClick={applyCoupon} disabled={busy || !codeInput.trim()} className="text-[9px] uppercase tracking-[0.4em] disabled:opacity-40 hover:text-mfn-gold transition-colors">
                    {busy ? '…' : 'Apply'}
                  </button>
                </div>
              </div>
            )}
            {couponMsg && (
              <p className={`text-[11px] ${couponMsg.ok ? 'text-mfn-midnight/70' : 'text-red-800'}`}>{couponMsg.text}</p>
            )}

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[10px] uppercase tracking-[0.3em] text-mfn-midnight/60">Subtotal</span>
                <span className="font-serif italic">{formatPrice(couponCode && quote ? quote.subtotal : localSubtotal, currency)}</span>
              </div>
              {couponCode && discount > 0 && (
                <div className="flex justify-between text-mfn-gold">
                  <span className="text-[10px] uppercase tracking-[0.3em]">Discount</span>
                  <span className="font-serif italic">− {formatPrice(discount, currency)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-mfn-midnight/10">
                <span className="text-[10px] uppercase tracking-[0.3em]">Total</span>
                <span className="font-serif italic text-xl">{formatPrice(total, currency)}</span>
              </div>
              <p className="text-[9px] tracking-wider text-mfn-midnight/50">Shipping and taxes are calculated at checkout.</p>
            </div>

            {/* Save for later */}
            {saveState === 'sent' ? (
              <p className="text-[11px] text-mfn-midnight/70">✦ Your bag is on its way to your inbox.</p>
            ) : saveOpen ? (
              <div className="space-y-3">
                <div className="flex border-b border-mfn-midnight/30 focus-within:border-mfn-midnight transition-colors">
                  <input
                    type="email"
                    value={saveEmail}
                    onChange={(e) => setSaveEmail(e.target.value)}
                    placeholder="Your email address"
                    aria-label="Email to save your bag"
                    className="bg-transparent flex-grow py-3 text-xs tracking-[0.15em] placeholder:text-mfn-midnight/40 focus:outline-none"
                  />
                  <button onClick={saveBag} disabled={saveState === 'sending' || !saveEmail.includes('@')} className="text-[9px] uppercase tracking-[0.4em] disabled:opacity-40 hover:text-mfn-gold transition-colors">
                    {saveState === 'sending' ? '…' : 'Send'}
                  </button>
                </div>
                <label className="flex items-start gap-2 text-[10px] text-mfn-midnight/60 leading-relaxed cursor-pointer">
                  <input type="checkbox" checked={saveOptIn} onChange={(e) => setSaveOptIn(e.target.checked)} className="mt-0.5 accent-mfn-gold" />
                  Also send me private offers and new collections.
                </label>
                {saveState === 'error' && <p className="text-[11px] text-red-800">{saveMsg}</p>}
              </div>
            ) : (
              <button onClick={() => setSaveOpen(true)} className="link-lux self-start text-[9px] uppercase tracking-[0.35em] text-mfn-midnight/70">
                Not ready? Email me my bag
              </button>
            )}

            <p className="text-[9px] tracking-wider text-mfn-midnight/50">✦ Delivered in discreet, unbranded outer packaging.</p>
            <button
              onClick={handleCheckout}
              disabled={isLoadingCheckout}
              className="w-full bg-mfn-midnight text-mfn-silk py-5 text-[10px] uppercase tracking-[0.4em] hover:bg-mfn-gold hover:text-mfn-midnight transition-colors duration-500 disabled:opacity-50 cursor-pointer"
            >
              {isLoadingCheckout ? 'Preparing Secure Checkout…' : 'Proceed to Checkout'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
