'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CartDrawerTrigger } from './CartDrawer';
import { ConciergeTrigger, useConcierge } from './ConciergeModal';
import { track } from '../lib/analytics';

const links = [
  { href: '/discover', label: 'Archive' },
  { href: '/bridal', label: 'Trousseau' },
  { href: '/gifting', label: 'Gifting' },
  { href: '/gift-builder', label: 'Gift Builder' },
  { href: '/lookbook', label: 'Lookbook' },
  { href: '/journal', label: 'Journal' },
  { href: '/collections', label: 'Collections' },
  { href: '/about', label: 'The House' },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { setIsOpen: openConcierge } = useConcierge();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState('');
  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenu(false);
    setSearch(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menu || search ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && (setMenu(false), setSearch(false));
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menu, search]);

  const solid = !isHome || scrolled;
  const tone = solid ? 'text-mfn-midnight' : 'text-mfn-silk';

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) track('search', { searchTerm: q.trim() });
    router.push(`/discover${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-40">
        <div className={`bg-mfn-midnight text-mfn-champagne text-center text-[9px] uppercase tracking-[0.4em] overflow-hidden transition-all duration-500 ${scrolled ? 'h-0 py-0 opacity-0' : 'h-auto py-2.5 opacity-100'}`}>
          Complimentary monogram on bridal sets ✦ Discreet, unbranded delivery
        </div>

        <div className={`px-5 md:px-16 grid grid-cols-3 items-center transition-all duration-500 ${solid ? 'bg-mfn-silk/90 backdrop-blur-md border-b border-mfn-midnight/10 py-4' : 'bg-transparent border-b border-transparent py-6 md:py-7'} ${tone}`}>
          <nav className="hidden lg:flex items-center gap-8 text-[9px] uppercase tracking-[0.4em]">
            {links.filter((l) => ['/discover', '/bridal', '/gifting', '/lookbook'].includes(l.href)).map((l) => (
              <Link key={l.href} href={l.href} className="link-lux">{l.label}</Link>
            ))}
          </nav>
          <button onClick={() => setMenu(true)} className="lg:hidden justify-self-start text-[9px] uppercase tracking-[0.4em] flex items-center gap-3" aria-label="Open menu">
            <span className="flex flex-col gap-[5px]"><span className="w-6 h-px bg-current" /><span className="w-4 h-px bg-current" /></span>
            Menu
          </button>

          <Link href="/" className="justify-self-center text-center leading-none">
            <span className="block font-serif text-lg md:text-3xl tracking-[0.16em] md:tracking-[0.18em] uppercase">MyFirstNight</span>
            <span className="hidden md:block text-[7px] tracking-[0.7em] uppercase mt-2 opacity-60">Luxury Intimates</span>
          </Link>

          <div className="flex items-center justify-end gap-5 md:gap-8">
            <ConciergeTrigger className="hidden md:block text-[9px] uppercase tracking-[0.4em] hover:text-mfn-gold transition-colors" />
            <button onClick={() => setSearch(true)} className="text-[9px] uppercase tracking-[0.4em] link-lux hidden sm:block">Search</button>
            <CartDrawerTrigger />
          </div>
        </div>
      </header>

      {/* Full-screen menu */}
      <div className={`fixed inset-0 z-50 bg-mfn-midnight text-mfn-silk grain transition-all duration-700 ${menu ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="relative z-10 h-full flex flex-col px-8 py-8">
          <div className="flex justify-between items-center mb-16">
            <span className="font-serif text-xl tracking-[0.16em] uppercase">MyFirstNight</span>
            <button onClick={() => setMenu(false)} className="text-[10px] uppercase tracking-[0.3em]">Close ✕</button>
          </div>
          <nav className="flex flex-col gap-6">
            {links.map((l, i) => (
              <Link key={l.href} href={l.href} className="font-serif text-5xl font-light hover:text-mfn-champagne transition-colors" style={{ transitionDelay: `${i * 40}ms` }}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex flex-wrap gap-x-8 gap-y-3 text-[9px] uppercase tracking-[0.35em] text-mfn-silk/60">
            <button onClick={() => { setMenu(false); openConcierge(true); }}>Concierge</button>
            <Link href="/size-guide">Size Guide</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">Contact</Link>
            <button onClick={() => { setMenu(false); setSearch(true); }}>Search</button>
          </div>
        </div>
      </div>

      {/* Search overlay */}
      <div className={`fixed inset-0 z-50 bg-mfn-silk/95 backdrop-blur-xl transition-all duration-500 ${search ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <button onClick={() => setSearch(false)} className="absolute top-8 right-8 text-[10px] uppercase tracking-[0.3em]">Close ✕</button>
        <form onSubmit={submitSearch} className="h-full max-w-3xl mx-auto px-6 flex flex-col justify-center">
          <span className="text-[9px] uppercase tracking-[0.6em] text-mfn-gold mb-6">Search the archive</span>
          <input
            autoFocus={search}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Silk, lace, robe…"
            className="bg-transparent border-b border-mfn-midnight/30 focus:border-mfn-gold outline-none font-serif text-4xl md:text-7xl font-light py-4 placeholder:text-mfn-midnight/20 transition-colors"
          />
          <button className="self-start mt-8 text-[10px] uppercase tracking-[0.4em] link-lux">Search ↵</button>
        </form>
      </div>
    </>
  );
}
