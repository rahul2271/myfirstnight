import { shopifyFetch } from '../../lib/shopify';
import { getProductsQuery } from '../../lib/shopify/queries';
import Image from 'next/image';
import { ProductCard } from '../../components/ProductCard';
import { whatsappLink } from '../../lib/config';
import Link from 'next/link';

export const metadata = {
  title: 'Bridal Trousseau',
  description: 'Curated wedding-night slips, robes and trousseau sets in mulberry silk and French lace.',
};

export default async function BridalTrousseauPage() {
  // Fetch products from Shopify to display in the bridal archive
  let products: any[] = [];
  try {
      const { body } = await shopifyFetch<any>({
      query: getProductsQuery,
      variables: { first: 6 },
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
        <span className="text-[9px] uppercase tracking-[0.6em] text-mfn-nude mb-4 block">The Bridal Trousseau Collection</span>
        <h1 className="text-5xl md:text-8xl font-serif font-light tracking-tight mb-8 leading-none">
          Legacy in Silk & Lace
        </h1>
        <p className="max-w-2xl mx-auto text-sm font-light text-mfn-midnight/70 leading-relaxed mb-12">
          Curated for new beginnings, wedding nights, and milestone celebrations. Each piece is meticulously handcrafted from weightless mulberry silk and French Leavers lace.
        </p>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-6 text-[10px] uppercase tracking-[0.3em] text-mfn-midnight/60">
          <span className="text-mfn-midnight border-b border-mfn-midnight pb-1">All Trousseau Pieces</span>
          <span className="hover:text-mfn-midnight transition-colors cursor-pointer">Wedding Night Slips</span>
          <span className="hover:text-mfn-midnight transition-colors cursor-pointer">Bridal Robes & Kimonos</span>
          <span className="hover:text-mfn-midnight transition-colors cursor-pointer">Anniversary Curations</span>
        </div>
      </div>

      {/* ==========================================
          2. EDITORIAL FEATURED BANNER SPLIT
          ========================================== */}
      <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 mb-32 items-center">
        <div className="lg:col-span-7 relative aspect-[16/10] bg-[#EAE5DF] overflow-hidden rounded-sm shadow-xl">
          <Image
            src="https://images.unsplash.com/photo-1584288426034-71286b2089cd?q=80&w=1600&auto=format&fit=crop"
            alt="Bridal Trousseau Curation"
            fill
            className="object-cover transition-transform duration-1000 hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
        </div>
        <div className="lg:col-span-5 flex flex-col justify-center lg:px-12">
          <span className="text-[9px] uppercase tracking-[0.5em] text-mfn-nude mb-4">The Heirloom Standard</span>
          <h2 className="text-3xl md:text-5xl font-serif font-light mb-6 leading-tight">
            Designed to be treasured for generations.
          </h2>
          <p className="text-sm font-light text-mfn-midnight/70 leading-relaxed mb-8">
            Our bridal trousseaus are delivered in weighted keepsake presentation boxes, wrapped in acid-free tissue and sealed with custom monogram wax. Absolute privacy and discretion guaranteed.
          </p>
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-mfn-midnight font-medium">
            <span>✦ 100% Mulberry Silk</span>
            <span>✦ Handcrafted Atelier</span>
          </div>
        </div>
      </div>

      {/* ==========================================
          3. DYNAMIC PRODUCTS GRID (Shopify Catalog)
          ========================================== */}
      <div className="max-w-[1700px] mx-auto mb-32">
        <div className="flex justify-between items-end mb-16 border-b border-mfn-midnight/10 pb-6">
          <div>
            <span className="text-[9px] uppercase tracking-[0.4em] text-mfn-nude mb-2 block">Handpicked Selection</span>
            <h2 className="text-3xl md:text-4xl font-serif font-light">The Trousseau Archive</h2>
          </div>
          <Link href="/discover" className="text-[10px] uppercase tracking-[0.3em] text-mfn-midnight hover:text-mfn-nude transition-colors">
            View Full Archive [→]
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-24">
          {products.map(({ node: product }: any) => (
            <ProductCard key={product.id} product={product} align="center" sizes="(max-width: 768px) 100vw, 33vw" />
          ))}
        </div>
      </div>

      {/* ==========================================
          4. PRIVATE BRIDAL CONCIERGE BANNER
          ========================================== */}
      <div className="max-w-[1700px] mx-auto bg-[#F2ECE7] border border-mfn-midnight/10 py-20 px-8 md:px-24 text-center rounded-sm">
        <span className="text-[9px] uppercase tracking-[0.5em] text-mfn-nude mb-4 block">White Glove Service</span>
        <h2 className="text-3xl md:text-5xl font-serif font-light mb-6">Private Bridal Styling Concierge</h2>
        <p className="max-w-xl mx-auto text-sm font-light text-mfn-midnight/70 leading-relaxed mb-10">
          Planning a complete trousseau or looking for a bespoke anniversary gift box? Connect directly with our senior stylists via encrypted WhatsApp consultation.
        </p>
        <a 
          href={whatsappLink("Hello MyFirstNight, I would like a private bridal consultation.") || "/"} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-mfn-midnight text-mfn-silk px-10 py-5 text-[10px] uppercase tracking-[0.4em] hover:bg-mfn-charcoal transition-colors shadow-lg"
        >
          Initiate Private Consultation
        </a>
      </div>

    </div>
  );
}