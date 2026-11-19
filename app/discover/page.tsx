import { shopifyFetch } from '../../lib/shopify';
import { getProductsQuery } from '../../lib/shopify/queries';
import { ProductFilter } from '../../components/ProductFilter';

export const metadata = {
  title: 'The Archive',
  description: 'Explore handcrafted French Leavers lace, mulberry silk robes and bridal trousseau sets.',
};

export default async function DiscoverArchivePage({ searchParams }: { searchParams: { q?: string } }) {
  // Fetch full product catalog from Shopify Storefront API
  let products: any[] = [];
  try {
      const { body } = await shopifyFetch<any>({
      query: getProductsQuery,
      variables: { first: 60 },
    });
  
  products = body?.data?.products?.edges || [];
  } catch {
    products = []; // Shopify unreachable: render empty state instead of crashing
  }

  return (
    <div className="bg-mfn-silk text-mfn-midnight font-sans min-h-screen pt-52 pb-44 px-6 md:px-16 selection:bg-mfn-nude selection:text-mfn-midnight">
      
      {/* Archive Header */}
      <div className="max-w-[1700px] mx-auto text-center mb-20">
        <span className="text-[9px] uppercase tracking-[0.6em] text-mfn-nude mb-4 block">The Complete Archive</span>
        <h1 className="text-5xl md:text-8xl font-serif font-light tracking-tight mb-6 leading-none">
          Timeless Silks & Intimates
        </h1>
        <p className="max-w-xl mx-auto text-sm font-light text-mfn-midnight/70 leading-relaxed">
          Explore our complete curation of handcrafted French Leavers lace, mulberry silk robes, and bridal trousseau sets.
        </p>
      </div>

      {/* Interactive Search & Filter Component */}
      <div className="max-w-[1700px] mx-auto">
        <ProductFilter products={products} initialQuery={searchParams?.q || ''} />
      </div>

    </div>
  );
}