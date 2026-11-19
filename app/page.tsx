import { shopifyFetch } from '../lib/shopify';
import { getProductsQuery } from '../lib/shopify/queries';
import { LoveLetters } from '../components/LoveLetters';
import { ProductSlider } from '../components/ProductSlider';
import { Reveal } from '../components/Reveal';
import { ProductTabs } from '../components/ProductTabs';
import { NewsletterForm } from '../components/NewsletterForm';
import { RecentlyViewed } from '../components/RecentlyViewed';
import { faqs } from '../lib/policies';
import { getReviews } from '../lib/reviews';
import { HeroMedia } from '../components/HeroMedia';
import { getArticles, fmtDate } from '../lib/journal';
import Link from 'next/link';
import Image from 'next/image';

const ribbon = [
  'Pure Mulberry Silk',
  'French Leavers Lace',
  'Bridal Trousseau',
  'Discreet Delivery',
  'Complimentary Monogram',
  'Private Concierge',
];

const collections = [
  {
    href: '/bridal',
    eyebrow: 'For the Bride',
    title: 'The Bridal Trousseau',
    img: 'https://images.unsplash.com/photo-1596459374026-646f906e57ce?q=80&w=1600&auto=format&fit=crop',
  },
  {
    href: '/discover',
    eyebrow: 'The Complete Archive',
    title: 'Silk & Lace',
    img: 'https://images.unsplash.com/photo-1618220179428-22790b46a0eb?q=80&w=1600&auto=format&fit=crop',
  },
  {
    href: '/gifting',
    eyebrow: 'For Them',
    title: 'The Art of Gifting',
    img: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=1600&auto=format&fit=crop',
  },
];

export default async function Home() {
  const load = async (variables: any) => {
    try {
      const { body } = await shopifyFetch<any>({ query: getProductsQuery, variables });
      return body?.data?.products?.edges || [];
    } catch {
      return [];
    }
  };
  const [products, newest, bestsellers] = await Promise.all([
    load({ first: 8 }),
    load({ first: 8, sortKey: 'CREATED_AT', reverse: true }),
    load({ first: 8, sortKey: 'BEST_SELLING' }),
  ]);
  const latestPosts = await getArticles(3);
  const featured = (await getReviews()).filter((r) => r.featured).slice(0, 8).map((r) => ({
    id: r.id, quote: r.body, author: r.author, location: r.location, piece: r.productTitle,
  }));
  const tabs = [
    { key: 'new', label: 'New Arrivals', products: newest },
    { key: 'best', label: 'Best Sellers', products: bestsellers },
  ].filter((t) => t.products.length > 0);

  const occasions = [
    { t: 'Wedding Night', d: 'The first evening, perfectly dressed.', href: '/bridal' },
    { t: 'Honeymoon', d: 'A wardrobe for every slow morning.', href: '/collections' },
    { t: 'Anniversary', d: 'Tokens worth keeping.', href: '/gifting' },
    { t: 'Bridal Party', d: 'Gifts for the women beside you.', href: '/gifting' },
  ];
  const ritual = [
    ['01', 'Discover', 'Browse the archive or let the concierge curate privately.', '/discover'],
    ['02', 'Find your fit', 'Two measurements, one minute, or a private fitting by message.', '/size-guide'],
    ['03', 'Unwrap', 'A weighted presentation box inside plain, unbranded packaging.', '/policies/shipping'],
  ];

  return (
    <div className="bg-mfn-silk text-mfn-midnight font-sans overflow-x-hidden">
      {/* 1. HERO */}
      <section className="relative grain h-[100svh] min-h-[640px] w-full flex flex-col justify-end pb-20 md:pb-28 px-6 md:px-16 overflow-hidden bg-mfn-midnight">
        <div className="absolute inset-0 z-0">
          <HeroMedia />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(184,155,106,0.18),transparent_60%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-mfn-midnight via-mfn-midnight/30 to-black/60" />
        </div>

        <div className="relative z-10 max-w-6xl w-full">
          <div className="flex items-center gap-4 mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <span className="w-12 h-px bg-mfn-gold" />
            <p className="text-[9px] uppercase tracking-[0.6em] text-mfn-champagne">The After Hours Collection</p>
          </div>

          <h1
            className="font-serif font-light text-mfn-silk leading-[0.88] tracking-tight text-[clamp(3.5rem,11vw,10.5rem)] mb-12 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.5s' }}
          >
            Unspoken <br />
            <span className="italic text-gold-gradient">Elegance</span>
          </h1>

          <div
            className="flex flex-col md:flex-row md:items-end justify-between gap-10 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.9s' }}
          >
            <p className="text-mfn-silk/70 font-light text-sm md:text-base max-w-md leading-relaxed">
              Whisper-weight mulberry silk and intricate French lace, designed for the quiet moments that matter most.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <Link
                href="/bridal"
                className="bg-mfn-silk text-mfn-midnight px-10 py-5 text-[9px] uppercase tracking-[0.4em] hover:bg-mfn-champagne transition-colors duration-700"
              >
                Shop the Trousseau
              </Link>
              <Link href="/discover" className="link-lux text-[9px] uppercase tracking-[0.4em] text-mfn-silk">
                Explore the Archive
              </Link>
            </div>
          </div>
        </div>

        <div className="hidden md:flex absolute right-16 bottom-28 z-10 flex-col items-center gap-4 text-mfn-silk/50">
          <span className="text-[8px] uppercase tracking-[0.5em] [writing-mode:vertical-rl]">Scroll</span>
          <span className="w-px h-16 bg-mfn-silk/50 animate-scroll-line" />
        </div>
      </section>

      {/* 2. RIBBON */}
      <section className="bg-mfn-midnight border-t border-mfn-silk/10 py-6 overflow-hidden">
        <div className="flex w-max animate-marquee">
          {[...ribbon, ...ribbon, ...ribbon, ...ribbon].map((t, i) => (
            <span key={i} className="flex items-center text-[10px] uppercase tracking-[0.5em] text-mfn-champagne/80 whitespace-nowrap">
              <span className="px-10">{t}</span>
              <span className="text-mfn-gold">✧</span>
            </span>
          ))}
        </div>
      </section>

      {/* 3. MANIFESTO */}
      <section className="py-40 md:py-56 px-6 md:px-12 max-w-6xl mx-auto text-center">
        <Reveal>
          <span className="text-mfn-gold text-2xl mb-8 block">✧</span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif leading-[1.2] font-light">
            True luxury is never loud. It lives in the weight of pure silk against the skin, the precision of a French seam, and an{' '}
            <span className="text-mfn-gold italic">uncompromising discretion.</span>
          </h2>
        </Reveal>
      </section>

      {/* 3b. SHOP BY OCCASION (arch motif) */}
      <section className="px-6 md:px-16 pb-40 max-w-[1700px] mx-auto">
        <Reveal className="text-center mb-20">
          <span className="text-[9px] uppercase tracking-[0.6em] text-mfn-gold block mb-4">For Every Chapter</span>
          <h3 className="text-4xl md:text-7xl font-serif font-light">Shop by Occasion</h3>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {occasions.map((o, i) => (
            <Reveal key={o.t} delay={i * 120}>
              <Link href={o.href} className="group block text-center">
                <div className="relative aspect-[3/4] rounded-t-full overflow-hidden bg-mfn-blush mb-6 border border-mfn-gold/30 group-hover:border-mfn-gold transition-colors duration-700">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(184,155,106,0.35),transparent_70%)] group-hover:scale-110 transition-transform duration-[2000ms]" />
                  <span className="absolute inset-0 flex items-center justify-center font-serif italic text-6xl md:text-8xl font-light text-mfn-midnight/15 group-hover:text-mfn-gold/50 transition-colors duration-700">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h4 className="text-[11px] uppercase tracking-[0.35em] mb-2">{o.t}</h4>
                <p className="font-serif italic text-sm text-mfn-midnight/50">{o.d}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 4. COLLECTION TILES */}
      <section className="px-4 md:px-8 pb-32">
        <div className="max-w-[1900px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {collections.map((c, i) => (
            <Reveal key={c.href} delay={i * 150}>
              <Link href={c.href} className="group relative block aspect-[3/4] md:aspect-[2/3] overflow-hidden bg-mfn-midnight">
                <Image fill sizes="(max-width: 768px) 100vw, 50vw"
                  src={c.img}
                  alt={c.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-[2500ms] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/20" />
                <div className="absolute inset-4 md:inset-6 border border-mfn-champagne/0 group-hover:border-mfn-champagne/60 transition-colors duration-700" />
                <div className="absolute inset-x-0 bottom-0 p-8 md:p-10 text-mfn-silk">
                  <span className="text-[9px] uppercase tracking-[0.5em] text-mfn-champagne block mb-3">{c.eyebrow}</span>
                  <h3 className="font-serif text-3xl md:text-4xl font-light mb-5">{c.title}</h3>
                  <span className="text-[9px] uppercase tracking-[0.4em] border-b border-mfn-silk/40 pb-2 group-hover:border-mfn-champagne group-hover:text-mfn-champagne transition-colors">
                    Discover
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 5. THE SILK ARCHIVE */}
      {products.length > 0 && (
        <section className="pb-40 border-b border-mfn-midnight/10">
          <Reveal>
            <div className="flex justify-between items-end mb-8 px-6 md:px-16 max-w-[1700px] mx-auto">
              <div>
                <span className="text-[9px] uppercase tracking-[0.5em] text-mfn-gold block mb-3">Curated Selection</span>
                <h3 className="text-4xl md:text-6xl font-serif font-light">The Silk Archive</h3>
              </div>
              <Link href="/discover" className="link-lux text-[9px] uppercase tracking-[0.4em]">
                View All Pieces
              </Link>
            </div>
          </Reveal>
          <ProductSlider products={products} />
        </section>
      )}

      {tabs.length > 0 && (
        <section className="py-40 border-b border-mfn-midnight/10">
          <ProductTabs tabs={tabs} />
        </section>
      )}

      {/* 6. CRAFTSMANSHIP SPLIT */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[90vh]">
        <div className="relative grain bg-mfn-midnight text-mfn-silk p-12 md:p-24 flex flex-col justify-center">
          <div className="relative z-10 max-w-lg">
            <Reveal>
              <span className="text-[9px] uppercase tracking-[0.5em] text-mfn-gold mb-6 block">Architectural Precision</span>
              <h3 className="text-5xl md:text-7xl font-serif font-light mb-8 leading-[0.95]">
                Designed as a <span className="italic text-mfn-champagne">Second Skin</span>
              </h3>
              <p className="text-mfn-silk/65 font-light leading-relaxed mb-10 text-sm md:text-base">
                Every pattern is custom-drafted to honor the natural architecture of the body, in thermoregulating mulberry silk that moves fluidly through the evening hours.
              </p>
              <Link href="/discover" className="link-lux text-[9px] uppercase tracking-[0.4em]">
                Explore the Archive
              </Link>
            </Reveal>
          </div>
        </div>
        <div className="relative min-h-[60vh] md:min-h-full bg-mfn-blush overflow-hidden group">
          <Image fill sizes="(max-width: 768px) 100vw, 50vw"
            src="https://images.unsplash.com/photo-1618220179428-22790b46a0eb?q=80&w=2000&auto=format&fit=crop"
            alt="Silk texture"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[4000ms] ease-out group-hover:scale-105"
          />
        </div>
      </section>

      {/* 7. GIFTING */}
      <section className="max-w-[1700px] mx-auto px-6 md:px-16 py-40 flex flex-col md:flex-row items-center gap-16 md:gap-28">
        <Reveal className="w-full md:w-1/2">
          <span className="text-[9px] uppercase tracking-[0.5em] text-mfn-gold mb-6 block">Uncompromising Privacy</span>
          <h3 className="text-5xl md:text-7xl font-serif font-light mb-8 leading-[0.95]">
            The Art of <span className="italic">Gifting</span>
          </h3>
          <p className="text-mfn-midnight/65 leading-relaxed font-light mb-10 text-sm md:text-base max-w-lg">
            For a wedding night or an anniversary token. Every order arrives in our heavyweight matte black presentation box, housed inside plain, unbranded outer packaging.
          </p>
          <div className="flex flex-wrap gap-8 items-center">
            <Link href="/gift-builder" className="bg-mfn-midnight text-mfn-silk px-10 py-5 text-[9px] uppercase tracking-[0.4em] hover:bg-mfn-gold hover:text-mfn-midnight transition-colors duration-500">
              Build a Gift Set
            </Link>
            <Link href="/gifting" className="link-lux text-[9px] uppercase tracking-[0.4em]">
              Explore Gift Sets
            </Link>
          </div>
        </Reveal>
        <Reveal delay={200} className="w-full md:w-1/2">
          <div className="relative aspect-[4/5] overflow-hidden bg-mfn-midnight group">
            <Image fill sizes="(max-width: 768px) 100vw, 50vw"
              src="https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=2000&auto=format&fit=crop"
              alt="Luxury packaging"
              className="w-full h-full object-cover opacity-90 transition-transform duration-[4000ms] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-5 border border-mfn-champagne/40 pointer-events-none" />
          </div>
        </Reveal>
      </section>

      {/* 8. REAL REVIEWS (hidden until real ones are added) */}
      <LoveLetters letters={featured} />

      {/* 9. BRIDAL */}
      <section className="relative grain w-full bg-mfn-midnight text-mfn-silk py-44 md:py-60 px-6 overflow-hidden text-center">
        <div className="absolute inset-0 opacity-25">
          <Image fill sizes="(max-width: 768px) 100vw, 50vw"
            src="https://images.unsplash.com/photo-1596459374026-646f906e57ce?q=80&w=3000&auto=format&fit=crop"
            className="w-full h-full object-cover mix-blend-overlay"
            alt=""
          />
        </div>
        <Reveal className="relative z-10 max-w-4xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.6em] text-mfn-gold mb-8 block">The Honeymoon Wardrobe</span>
          <h2 className="text-6xl md:text-9xl font-serif font-light mb-10 leading-[0.9]">
            The Bridal <span className="italic text-gold-gradient">Trousseau</span>
          </h2>
          <p className="text-mfn-silk/60 font-light leading-relaxed mb-14 text-sm md:text-base max-w-xl mx-auto">
            An immaculate collection for your transition into marriage. Consult our bridal specialists for bespoke sizing and trousseau curation.
          </p>
          <Link
            href="/bridal"
            className="inline-block border border-mfn-champagne/60 text-mfn-champagne px-12 py-5 text-[9px] uppercase tracking-[0.4em] hover:bg-mfn-champagne hover:text-mfn-midnight transition-colors duration-700"
          >
            Discover Bridal Sets
          </Link>
        </Reveal>
      </section>

      {/* 10. PROMISE */}
      <section className="py-32 border-b border-mfn-midnight/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 text-center px-6">
          {[
            ['01', 'Pure Mulberry Silk', 'Thermoregulating, hypoallergenic, and exquisitely fluid.'],
            ['02', 'Absolute Discretion', 'Shipped in plain, unbranded outer packaging to safeguard your privacy.'],
            ['03', 'Private Concierge', 'Dedicated support for sizing guidance and gifting curation.'],
          ].map(([n, t, d]) => (
            <Reveal key={n}>
              <span className="font-serif italic text-mfn-gold text-3xl mb-4 block">{n}</span>
              <h4 className="text-[11px] uppercase tracking-[0.35em] mb-3">{t}</h4>
              <p className="text-sm text-mfn-midnight/60 font-light leading-relaxed max-w-xs mx-auto">{d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 10b. THE RITUAL */}
      <section className="relative grain bg-mfn-midnight text-mfn-silk py-40 px-6 md:px-16 overflow-hidden">
        <div className="relative z-10 max-w-[1500px] mx-auto">
          <Reveal className="mb-24 max-w-2xl">
            <span className="text-[9px] uppercase tracking-[0.6em] text-mfn-gold block mb-4">The MyFirstNight Ritual</span>
            <h3 className="text-5xl md:text-7xl font-serif font-light leading-[0.95]">From first look to <span className="italic text-mfn-champagne">last detail.</span></h3>
          </Reveal>
          <div className="grid md:grid-cols-3 border-t border-mfn-silk/15">
            {ritual.map(([n, t, d, href], i) => (
              <Reveal key={n} delay={i * 150}>
                <Link href={href} className="group block p-10 md:p-12 md:border-r last:border-r-0 border-b md:border-b-0 border-mfn-silk/15 hover:bg-mfn-silk/[0.04] transition-colors duration-700">
                  <span className="font-serif italic text-6xl text-mfn-gold/70 group-hover:text-mfn-gold transition-colors">{n}</span>
                  <h4 className="font-serif text-3xl font-light mt-6 mb-3">{t}</h4>
                  <p className="text-sm font-light text-mfn-silk/60 leading-relaxed max-w-xs">{d}</p>
                  <span className="inline-block mt-8 text-[9px] uppercase tracking-[0.4em] text-mfn-champagne">Learn more →</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 10c. CONCIERGE + SIZE GUIDE */}
      <section className="grid md:grid-cols-2">
        <Link href="/contact" className="group p-12 md:p-24 bg-mfn-blush hover:bg-mfn-champagne/40 transition-colors duration-700 flex flex-col justify-between min-h-[50vh]">
          <span className="text-[9px] uppercase tracking-[0.5em] text-mfn-gold">White Glove</span>
          <div>
            <h3 className="font-serif text-5xl md:text-6xl font-light mb-6 leading-none">Private Concierge</h3>
            <p className="text-sm font-light text-mfn-midnight/65 max-w-sm mb-8">Personal guidance on sizing, bridal curation and gifts, by message, in complete confidence.</p>
            <span className="link-lux text-[9px] uppercase tracking-[0.4em]">Speak to us</span>
          </div>
        </Link>
        <Link href="/size-guide" className="group p-12 md:p-24 bg-mfn-silk border-l border-mfn-midnight/10 hover:bg-mfn-blush transition-colors duration-700 flex flex-col justify-between min-h-[50vh]">
          <span className="text-[9px] uppercase tracking-[0.5em] text-mfn-gold">Perfect Fit</span>
          <div>
            <h3 className="font-serif text-5xl md:text-6xl font-light mb-6 leading-none">Find Your Size</h3>
            <p className="text-sm font-light text-mfn-midnight/65 max-w-sm mb-8">Measure at home and see your estimated size in under a minute.</p>
            <span className="link-lux text-[9px] uppercase tracking-[0.4em]">Open the guide</span>
          </div>
        </Link>
      </section>

      {/* 10d. FAQ TEASER */}
      <section className="max-w-5xl mx-auto px-6 py-36 grid md:grid-cols-12 gap-12">
        <Reveal className="md:col-span-4">
          <span className="text-[9px] uppercase tracking-[0.5em] text-mfn-gold block mb-4">Good to know</span>
          <h3 className="font-serif text-5xl font-light leading-none mb-8">Questions, answered.</h3>
          <Link href="/faq" className="link-lux text-[9px] uppercase tracking-[0.4em]">All FAQs</Link>
        </Reveal>
        <div className="md:col-span-8 divide-y divide-mfn-midnight/10 border-y border-mfn-midnight/10">
          {faqs.slice(0, 4).map((f) => (
            <details key={f.q} className="acc py-6">
              <summary className="flex justify-between items-center gap-6 font-serif text-2xl font-light">
                {f.q}
                <span className="acc-plus text-mfn-gold text-2xl transition-transform duration-500">+</span>
              </summary>
              <p className="text-sm font-light text-mfn-midnight/70 leading-relaxed mt-4 max-w-lg">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 10e. EDITORIAL: LOOKBOOK + JOURNAL */}
      <section className={`grid ${latestPosts.length ? 'md:grid-cols-2' : ''}`}>
        <Link href="/lookbook" className="group relative min-h-[70vh] bg-mfn-midnight text-mfn-silk flex items-end overflow-hidden grain">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(184,155,106,0.3),transparent_60%)] group-hover:scale-110 transition-transform duration-[3000ms]" />
          <div className="relative z-10 p-12 md:p-20">
            <span className="text-[9px] uppercase tracking-[0.5em] text-mfn-gold block mb-4">The After Hours Edit</span>
            <h3 className="font-serif text-6xl md:text-8xl font-light leading-[0.9] mb-6">The <span className="italic text-mfn-champagne">Lookbook</span></h3>
            <span className="link-lux text-[9px] uppercase tracking-[0.4em]">Enter the edit</span>
          </div>
        </Link>
        {latestPosts.length > 0 && (
        <div className="bg-mfn-blush p-12 md:p-20 flex flex-col justify-center">
          <span className="text-[9px] uppercase tracking-[0.5em] text-mfn-gold block mb-4">The Journal</span>
          <h3 className="font-serif text-4xl md:text-5xl font-light leading-tight mb-10">Notes from the Atelier</h3>
          <div className="divide-y divide-mfn-midnight/10 border-y border-mfn-midnight/10">
            {latestPosts.map((a) => (
              <Link key={a.slug} href={`/journal/${a.slug}`} className="group block py-6">
                <span className="text-[9px] uppercase tracking-[0.35em] text-mfn-midnight/40 block mb-2">{a.tags[0] || 'Journal'} · {fmtDate(a.date)}</span>
                <span className="font-serif text-2xl font-light leading-snug group-hover:text-mfn-gold transition-colors duration-500">{a.title}</span>
              </Link>
            ))}
          </div>
          <Link href="/journal" className="link-lux self-start text-[9px] uppercase tracking-[0.4em] mt-8">All articles</Link>
        </div>
        )}
      </section>

      <RecentlyViewed />

      {/* 11. INNER CIRCLE */}
      <section className="relative grain bg-mfn-midnight text-mfn-silk py-40 px-6 text-center">
        <Reveal className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <span className="text-2xl text-mfn-gold mb-6 block">✧</span>
          <h3 className="text-5xl md:text-7xl font-serif font-light mb-6">The Inner Circle</h3>
          <p className="text-mfn-silk/60 font-light leading-relaxed mb-12 text-sm md:text-base max-w-md">
            {process.env.WELCOME_DISCOUNT_CODE
              ? 'Join for priority access to private drops and evening guides. New members receive a private welcome code.'
              : 'Join for priority access to private drops and evening guides.'}
          </p>
          <NewsletterForm />
        </Reveal>
      </section>
    </div>
  );
}
