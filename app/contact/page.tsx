import Link from 'next/link';
import { BRAND, whatsappLink } from '../../lib/config';
import { PageHero } from '../../components/PageHero';

export const metadata = { title: 'Contact', description: 'Reach the MyFirstNight private concierge for sizing, orders and gifting.' };

export default function ContactPage() {
  const wa = whatsappLink();
  const items = [
    wa && { t: 'WhatsApp Concierge', d: 'Private, one-to-one guidance on sizing, bridal curation and gifts.', href: wa, cta: 'Start a conversation', ext: true },
    { t: 'Email', d: BRAND.email, href: `mailto:${BRAND.email}`, cta: 'Write to us', ext: false },
    BRAND.phone && { t: 'Phone', d: BRAND.phone, href: `tel:${BRAND.phone}`, cta: 'Call', ext: false },
  ].filter(Boolean) as any[];

  return (
    <>
      <PageHero eyebrow="Client Care" title="At Your Service" intro="Our concierge replies personally, and every conversation stays private." />
      <div className="max-w-5xl mx-auto px-6 md:px-16 py-24 grid grid-cols-1 md:grid-cols-3 gap-px bg-mfn-midnight/10 my-16">
        {items.map((i) => (
          <a key={i.t} href={i.href} {...(i.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
             className="group bg-mfn-silk p-10 flex flex-col gap-4 hover:bg-mfn-blush transition-colors duration-500">
            <span className="text-[9px] uppercase tracking-[0.5em] text-mfn-gold">{i.t}</span>
            <p className="font-serif text-2xl font-light break-words">{i.d}</p>
            <span className="link-lux text-[9px] uppercase tracking-[0.4em] mt-auto self-start">{i.cta}</span>
          </a>
        ))}
      </div>
      <div className="text-center pb-32 text-[10px] uppercase tracking-[0.3em] text-mfn-midnight/50 flex justify-center gap-8 flex-wrap">
        <Link href="/faq" className="link-lux">FAQ</Link>
        <Link href="/policies/shipping" className="link-lux">Shipping</Link>
        <Link href="/policies/returns" className="link-lux">Returns</Link>
        <Link href="/size-guide" className="link-lux">Size Guide</Link>
      </div>
    </>
  );
}
