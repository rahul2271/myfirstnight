import { shopifyFetch } from '../../lib/shopify';
import { getProductsQuery } from '../../lib/shopify/queries';
import Image from 'next/image';
import { ProductCard } from '../../components/ProductCard';
import { whatsappLink } from '../../lib/config';
import Link from 'next/link';

export const metadata = {
  title: 'Luxury Gifting',
  description: 'Weighted keepsake boxes, monogram wax seals and handwritten notes, delivered discreetly.',
};

export default async function GiftingPage() {
  // Fetch products from Shopify to showcase gift sets
  let products: any[] = [];
  try {
      const { body } = await shopifyFetch<any>({
      query: getProductsQuery,
      variables: { first: 4 },
    });
  
  products = body?.data?.products?.edges || [];
  } catch {
    products = []; // Shopify unreachable: render empty state instead of crashing
  }

  return (
    <div className="bg-mfn-silk text-mfn-midnight font-sans min-h-screen pt-52 pb-44 px-6 md:px-16 selection:bg-mfn-nude selection:text-mfn-midnight">
      
      {/* ==========================================
          1. CINEMATIC HERO SECTION
          ========================================== */}
      <div className="max-w-[1700px] mx-auto text-center mb-24">
        <span className="text-[9px] uppercase tracking-[0.6em] text-mfn-nude mb-4 block">The Art of Gifting</span>
        <h1 className="text-5xl md:text-8xl font-serif font-light tracking-tight mb-8 leading-none">
          Tokens of Absolute Devotion
        </h1>
        <p className="max-w-2xl mx-auto text-sm font-light text-mfn-midnight/70 leading-relaxed mb-12">
          From milestone anniversaries to bridal party trousseaus, present your sentiments in weighted keepsake boxes finished with custom wax seals and handwritten calligraphy notes.
        </p>

        {/* Curation Categories */}
        <div className="flex flex-wrap justify-center gap-6 text-[10px] uppercase tracking-[0.3em] text-mfn-midnight/60">
          <span className="text-mfn-midnight border-b border-mfn-midnight pb-1">All Curations</span>
          <span className="hover:text-mfn-midnight transition-colors cursor-pointer">Wedding Night Boxes</span>
          <span className="hover:text-mfn-midnight transition-colors cursor-pointer">Bridesmaid Gift Sets</span>
          <span className="hover:text-mfn-midnight transition-colors cursor-pointer">Anniversary Silks</span>
        </div>
      </div>

      {/* ==========================================
          2. EDITORIAL GIFTING SPLIT
          ========================================== */}
      <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 mb-32 items-center">
        <div className="lg:col-span-5 flex flex-col justify-center lg:px-12 order-2 lg:order-1">
          <span className="text-[9px] uppercase tracking-[0.5em] text-mfn-nude mb-4">The Unboxing Ritual</span>
          <h2 className="text-3xl md:text-5xl font-serif font-light mb-6 leading-tight">
            An unforgettable reveal, shrouded in privacy.
          </h2>
          <p className="text-sm font-light text-mfn-midnight/70 leading-relaxed mb-8">
            Every gift set arrives in our signature heavyweight matte presentation box. Enclosed within secure, unbranded outer mailers, the recipient experiences pure luxury without a hint of outer compromise.
          </p>
          <div className="space-y-3 text-[11px] font-light text-mfn-midnight/60">
            <p>✦ Complimentary handwritten calligraphy note included.</p>
            <p>✦ Sealed with custom MyFirstNight monogram wax.</p>
            <p>✦ Zero pricing or invoice details enclosed inside.</p>
          </div>
        </div>

        <div className="lg:col-span-7 relative aspect-[16/10] bg-[#EAE5DF] overflow-hidden rounded-sm shadow-xl order-1 lg:order-2">
          <Image
            src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1600&auto=format&fit=crop"
            alt="Luxury Gift Box Presentation"
            fill
            className="object-cover transition-transform duration-1000 hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
        </div>
      </div>

      {/* ==========================================
          3. FEATURED GIFT CURATIONS (Shopify Data)
          ========================================== */}
      <div className="max-w-[1700px] mx-auto mb-32">
        <div className="flex justify-between items-end mb-16 border-b border-mfn-midnight/10 pb-6">
          <div>
            <span className="text-[9px] uppercase tracking-[0.4em] text-mfn-nude mb-2 block">Curated Bundles</span>
            <h2 className="text-3xl md:text-4xl font-serif font-light">The Gifting Archive</h2>
          </div>
          <Link href="/discover" className="text-[10px] uppercase tracking-[0.3em] text-mfn-midnight hover:text-mfn-nude transition-colors">
            Explore All Sets [→]
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {products.map(({ node: product }: any) => (
            <ProductCard key={product.id} product={product} align="center" cta="Select Set" sizes="(max-width: 768px) 100vw, 25vw" />
          ))}
        </div>
      </div>

      {/* ==========================================
          4. BESPOKE CONCIERGE BANNER
          ========================================== */}
      <div className="max-w-[1700px] mx-auto bg-[#F2ECE7] border border-mfn-midnight/10 py-20 px-8 md:px-24 text-center rounded-sm">
        <span className="text-[9px] uppercase tracking-[0.5em] text-mfn-nude mb-4 block">Corporate & Personal Curation</span>
        <h2 className="text-3xl md:text-5xl font-serif font-light mb-6">Looking for a Bespoke Gift Hamper?</h2>
        <p className="max-w-xl mx-auto text-sm font-light text-mfn-midnight/70 leading-relaxed mb-10">
          Our gifting concierge assists with multi-recipient shipping, custom monogramming, and tailored bridal party gift boxes delivered anywhere in the world.
        </p>
        <a 
          href={whatsappLink("Hello MyFirstNight, I would like help with a bespoke gift set.") || "/"} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-mfn-midnight text-mfn-silk px-10 py-5 text-[10px] uppercase tracking-[0.4em] hover:bg-mfn-charcoal transition-colors shadow-lg"
        >
          Consult with a Gifting Concierge
        </a>
      </div>

    </div>
  );
}