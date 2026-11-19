import Link from 'next/link';
import { ConciergeTrigger } from './ConciergeModal';

export function Footer() {
  return (
    <footer className="relative grain bg-mfn-midnight text-mfn-silk overflow-hidden">
      {/* Oversized wordmark */}
      <div className="px-6 md:px-16 pt-28 pb-10 border-b border-mfn-silk/10">
        <p className="text-[9px] uppercase tracking-[0.6em] text-mfn-gold mb-8">After hours, by invitation</p>
        <h2 className="font-serif font-light leading-[0.85] tracking-tight text-[15vw] md:text-[11vw] text-mfn-silk/95">
          MyFirstNight
        </h2>
      </div>

      <div className="relative z-10 max-w-[1700px] mx-auto px-6 md:px-16 py-20 grid grid-cols-2 md:grid-cols-12 gap-12">
        <div className="col-span-2 md:col-span-5 max-w-sm">
          <p className="font-serif italic text-2xl font-light text-mfn-champagne leading-snug mb-6">
            Luxury intimates for the moments that matter most.
          </p>
          <p className="text-xs font-light text-mfn-silk/50 leading-relaxed">
            Mulberry silk, French Leavers lace and uncompromising discretion, delivered in plain outer packaging.
          </p>
        </div>

        <div className="md:col-span-2 md:col-start-7 flex flex-col gap-4 text-[10px] uppercase tracking-[0.3em]">
          <span className="text-mfn-gold mb-2">Maison</span>
          <Link href="/discover" className="text-mfn-silk/70 hover:text-mfn-silk transition-colors">The Archive</Link>
          <Link href="/bridal" className="text-mfn-silk/70 hover:text-mfn-silk transition-colors">Bridal Trousseau</Link>
          <Link href="/gifting" className="text-mfn-silk/70 hover:text-mfn-silk transition-colors">Gifting</Link>
          <Link href="/gift-builder" className="text-mfn-silk/70 hover:text-mfn-silk transition-colors">Gift Builder</Link>
          <Link href="/lookbook" className="text-mfn-silk/70 hover:text-mfn-silk transition-colors">Lookbook</Link>
          <Link href="/journal" className="text-mfn-silk/70 hover:text-mfn-silk transition-colors">Journal</Link>
          <Link href="/collections" className="text-mfn-silk/70 hover:text-mfn-silk transition-colors">Collections</Link>
          <Link href="/about" className="text-mfn-silk/70 hover:text-mfn-silk transition-colors">The House</Link>
        </div>

        <div className="md:col-span-3 flex flex-col gap-4 text-[10px] uppercase tracking-[0.3em]">
          <span className="text-mfn-gold mb-2">Client Care</span>
          <ConciergeTrigger className="text-left text-mfn-silk/70 hover:text-mfn-silk transition-colors uppercase tracking-[0.3em]" />
          <Link href="/size-guide" className="text-mfn-silk/70 hover:text-mfn-silk transition-colors">Size Guide</Link>
          <Link href="/policies/shipping" className="text-mfn-silk/70 hover:text-mfn-silk transition-colors">Shipping</Link>
          <Link href="/policies/returns" className="text-mfn-silk/70 hover:text-mfn-silk transition-colors">Returns & Hygiene</Link>
          <Link href="/faq" className="text-mfn-silk/70 hover:text-mfn-silk transition-colors">FAQ</Link>
          <Link href="/contact" className="text-mfn-silk/70 hover:text-mfn-silk transition-colors">Contact</Link>
        </div>
      </div>

      <div className="relative z-10 border-t border-mfn-silk/10 px-6 md:px-16 py-8 flex flex-col md:flex-row justify-between gap-4 text-[9px] uppercase tracking-[0.3em] text-mfn-silk/40">
        <span>© {new Date().getFullYear()} MyFirstNight. All rights reserved.</span>
        <span className="flex gap-6">
          <Link href="/policies/privacy" className="hover:text-mfn-silk">Privacy</Link>
          <Link href="/policies/terms" className="hover:text-mfn-silk">Terms</Link>
        </span>
      </div>
    </footer>
  );
}
