import Link from 'next/link';
import Image from 'next/image';
import { getLookbook } from '../../lib/lookbook';
import { Reveal } from '../../components/Reveal';
import { ProductCard } from '../../components/ProductCard';
import { formatPrice } from '../../lib/format';

export const metadata = {
  title: 'The Lookbook',
  description: 'An editorial journey through silk, lace and quiet evenings. Shop every look.',
};

// alternating editorial layouts for the image grid
const layouts = [
  'md:col-span-7 aspect-[4/5]',
  'md:col-span-5 md:mt-32 aspect-[3/4]',
  'md:col-span-5 aspect-[3/4]',
  'md:col-span-7 md:mt-24 aspect-[4/5]',
];

export default async function LookbookPage() {
  const chapters = await getLookbook();

  return (
    <div className="bg-mfn-silk">
      {/* Intro */}
      <section className="relative grain bg-mfn-midnight text-mfn-silk min-h-[80svh] flex items-end px-6 md:px-16 pb-20 pt-48 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(184,155,106,0.22),transparent_60%)]" />
        <div className="relative z-10 max-w-5xl">
          <span className="text-[9px] uppercase tracking-[0.6em] text-mfn-gold block mb-8 opacity-0 animate-fade-in-up">The After Hours Edit</span>
          <h1 className="font-serif font-light leading-[0.88] tracking-tight text-[clamp(3.5rem,12vw,11rem)] opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            The <span className="italic text-gold-gradient">Lookbook</span>
          </h1>
          <p className="mt-10 max-w-md text-sm md:text-base font-light text-mfn-silk/65 leading-relaxed opacity-0 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
            Chapters of silk and lace, composed for the quiet hours. Every look is shoppable.
          </p>
        </div>
      </section>

      {chapters.length === 0 && (
        <p className="text-center py-40 font-serif italic text-2xl text-mfn-midnight/50">The lookbook is being composed.</p>
      )}

      {chapters.map((c, ci) => {
        const heroImg = c.image || (c.products[0]?.featuredImage && { url: c.products[0].featuredImage!.url, alt: c.title });
        const looks = c.products.flatMap((p) =>
          (p.images?.edges || []).slice(0, 2).map((e) => ({ img: e.node, p }))
        ).slice(0, 8);

        return (
          <section key={c.id} className="relative">
            {/* Sticky full-bleed chapter opener; content scrolls over it */}
            <div className="sticky top-0 h-[100svh] overflow-hidden bg-mfn-midnight">
              {heroImg && <Image src={heroImg.url} alt={heroImg.alt} fill priority={ci === 0} sizes="100vw" className="object-cover opacity-80" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
              <div className="absolute bottom-0 left-0 right-0 px-6 md:px-16 pb-20 text-mfn-silk">
                <span className="font-serif italic text-mfn-champagne text-2xl md:text-3xl">Chapter {String(ci + 1).padStart(2, '0')}</span>
                <h2 className="font-serif font-light leading-[0.9] text-5xl md:text-9xl mt-3">{c.title}</h2>
                {c.subtitle && <p className="text-[10px] uppercase tracking-[0.5em] text-mfn-champagne mt-6">{c.subtitle}</p>}
              </div>
            </div>

            <div className="relative z-10 bg-mfn-silk">
              {c.story && (
                <Reveal className="max-w-3xl mx-auto px-6 py-32 text-center">
                  <span className="text-mfn-gold text-2xl block mb-6">✧</span>
                  <p className="font-serif text-2xl md:text-4xl font-light leading-[1.4] whitespace-pre-line">{c.story}</p>
                </Reveal>
              )}

              {looks.length > 0 && (
                <div className="px-6 md:px-16 max-w-[1700px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 pb-32">
                  {looks.map(({ img, p }, i) => (
                    <Reveal key={`${p.id}-${i}`} delay={(i % 2) * 120} className={layouts[i % layouts.length]}>
                      <Link href={`/products/${p.handle}`} className="group relative block w-full h-full overflow-hidden bg-mfn-blush">
                        <Image src={img.url} alt={img.altText || p.title} fill sizes="(max-width: 768px) 100vw, 55vw" className="object-cover transition-transform duration-[2500ms] group-hover:scale-105" />
                        <div className="absolute inset-3 border border-mfn-champagne/0 group-hover:border-mfn-champagne/70 transition-colors duration-700" />
                        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent text-mfn-silk">
                          <span className="text-[9px] uppercase tracking-[0.4em] block">Look {String(i + 1).padStart(2, '0')}</span>
                          <span className="font-serif italic text-lg">{p.title} · {formatPrice(p.priceRange.maxVariantPrice.amount, p.priceRange.maxVariantPrice.currencyCode)}</span>
                        </div>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              )}

              {c.products.length > 0 && (
                <div className="px-6 md:px-16 max-w-[1700px] mx-auto pb-40">
                  <div className="flex items-end justify-between mb-10">
                    <h3 className="font-serif text-3xl md:text-5xl font-light">Shop the look</h3>
                    <Link href="/gift-builder" className="link-lux text-[9px] uppercase tracking-[0.4em] hidden md:block">Build a gift set</Link>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 md:gap-x-10 gap-y-14">
                    {c.products.slice(0, 4).map((p) => (
                      <ProductCard key={p.id} product={p} sizes="(max-width: 768px) 50vw, 25vw" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        );
      })}

      <section className="relative z-10 bg-mfn-midnight text-mfn-silk py-40 px-6 text-center">
        <h3 className="font-serif text-5xl md:text-8xl font-light mb-10">Every look, <span className="italic text-mfn-champagne">yours.</span></h3>
        <div className="flex flex-wrap justify-center gap-8">
          <Link href="/discover" className="bg-mfn-silk text-mfn-midnight px-10 py-5 text-[9px] uppercase tracking-[0.4em] hover:bg-mfn-champagne transition-colors duration-500">Explore the Archive</Link>
          <Link href="/journal" className="link-lux text-[9px] uppercase tracking-[0.4em] self-center">Read the Journal</Link>
        </div>
      </section>
    </div>
  );
}
