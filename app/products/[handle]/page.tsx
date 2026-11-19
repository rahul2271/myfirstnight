import { shopifyFetch } from '../../../lib/shopify';
import { getProductQuery, getRecommendationsQuery } from '../../../lib/shopify/queries';
import { ProductCard } from '../../../components/ProductCard';
import { PincodeChecker } from '../../../components/PincodeChecker';
import { ReviewsSection } from '../../../components/ReviewsSection';
import { Stars } from '../../../components/Stars';
import { TrackView } from '../../../components/TrackView';
import { getReviews, summarize, metafieldRating } from '../../../lib/reviews';
import { numericId } from '../../../lib/analytics';
import { RecentlyViewed, RecentlyViewedTracker } from '../../../components/RecentlyViewed';
import { AddToCartButton } from '../../../components/AddToCartButton';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SITE_URL } from '../../../lib/config';

function Acc({ title, children, open }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details className="acc py-6" open={open}>
      <summary className="flex justify-between items-center text-[10px] uppercase tracking-[0.3em] font-medium">
        <span>{title}</span>
        <span className="acc-plus text-mfn-gold text-lg leading-none transition-transform duration-500">+</span>
      </summary>
      <p className="text-xs font-light text-mfn-midnight/70 leading-relaxed mt-4">{children}</p>
    </details>
  );
}

export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  try {
    const { body } = await shopifyFetch<any>({ query: getProductQuery, variables: { handle: params.handle } });
    const p = body?.data?.product;
    if (!p) return {};
    const img = p.images?.edges?.[0]?.node?.url;
    const desc = p.seo?.description || p.description?.slice(0, 160) || undefined;
    return {
      title: p.seo?.title || p.title,
      description: desc,
      alternates: { canonical: `/products/${p.handle}` },
      openGraph: { title: p.title, description: desc, images: img ? [img] : undefined },
    };
  } catch {
    return {};
  }
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const { handle } = params;

  const { body } = await shopifyFetch<any>({
    query: getProductQuery,
    variables: { handle },
  });

  const product = body?.data?.product;

  if (!product) {
    notFound();
  }

  let related: any[] = [];
  try {
    const rec = await shopifyFetch<any>({ query: getRecommendationsQuery, variables: { productId: product.id } });
    related = (rec.body?.data?.productRecommendations || []).filter((r: any) => r.handle !== product.handle).slice(0, 4);
  } catch {}

  const productReviews = (await getReviews()).filter((r) => r.productHandle === product.handle);
  const sum = summarize(productReviews);
  const ratingInfo = sum ? { average: sum.average, count: sum.count } : metafieldRating(product);

  const images = product.images?.edges || [];
  const variants = product.variants?.edges || [];
  
  const composition = product.composition?.value;
  const ritual = product.ritual?.value;
  const sizingNote = product.sizing_note?.value;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: images.map(({ node }: any) => node.url),
    url: `${SITE_URL}/products/${product.handle}`,
    brand: { '@type': 'Brand', name: 'MyFirstNight' },
    ...(ratingInfo && {
      aggregateRating: { '@type': 'AggregateRating', ratingValue: ratingInfo.average.toFixed(1), reviewCount: ratingInfo.count },
    }),
    ...(productReviews.length > 0 && {
      review: productReviews.slice(0, 5).map((r) => ({
        '@type': 'Review',
        reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
        author: { '@type': 'Person', name: r.author },
        reviewBody: r.body,
        ...(r.date && { datePublished: r.date }),
      })),
    }),
    offers: {
      '@type': 'Offer',
      priceCurrency: product.priceRange?.maxVariantPrice?.currencyCode,
      price: product.priceRange?.maxVariantPrice?.amount,
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/products/${product.handle}`,
    },
  };

  return (
    <div className="bg-mfn-silk text-mfn-midnight font-sans min-h-screen pt-52 pb-44 px-6 md:px-16 selection:bg-mfn-nude selection:text-mfn-midnight">
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb Navigation */}
      <div className="max-w-[1700px] mx-auto mb-16 flex items-center gap-3 text-[9px] uppercase tracking-[0.4em] text-mfn-midnight/50">
        <Link href="/" className="hover:text-mfn-midnight transition-colors">Home</Link>
        <span>/</span>
        <Link href="/discover" className="hover:text-mfn-midnight transition-colors">Archive</Link>
        <span>/</span>
        <span className="text-mfn-midnight">{product.title}</span>
      </div>

      <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-28">
        
        {/* LEFT: IMMERSIVE STICKY IMAGE GALLERY (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {images.map(({ node: image }: any, index: number) => (
            <div key={index} className="relative w-full aspect-[3/4] bg-[#EAE5DF] overflow-hidden rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <Image
                src={image.url}
                alt={image.altText || product.title}
                fill
                className="object-cover transition-transform duration-1000 hover:scale-105"
                priority={index === 0}
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>
          ))}
        </div>

        {/* RIGHT: STICKY PRODUCT DETAILS (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col lg:sticky lg:top-40 h-fit">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-[1px] bg-mfn-nude" />
            <span className="text-[9px] uppercase tracking-[0.5em] text-mfn-nude">Handcrafted Trousseau Piece</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif font-light mb-4 leading-tight tracking-tight">{product.title}</h1>

          {ratingInfo && (
            <a href="#reviews" className="inline-flex items-center gap-3 mb-6 text-[10px] tracking-widest text-mfn-midnight/55 hover:text-mfn-midnight transition-colors">
              <Stars value={ratingInfo.average} size={14} />
              {ratingInfo.average.toFixed(1)} · {ratingInfo.count} review{ratingInfo.count > 1 ? 's' : ''}
            </a>
          )}

          {/* Interactive Variant Selector, Live Pricing, MRP & Discount Calculator */}
          <AddToCartButton product={product} variants={variants} />

          <PincodeChecker />

          <div className="w-full h-[1px] bg-mfn-midnight/10 my-8" />

          {/* Core Description */}
          <div 
            className="text-sm font-light text-mfn-midnight/70 leading-relaxed mb-10 space-y-4"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />

          {/* STATIC BRAND USPs */}
          <div className="grid grid-cols-3 gap-4 py-8 border-y border-mfn-midnight/10 my-8 text-center">
            <div className="flex flex-col items-center">
              <span className="text-[9px] uppercase tracking-[0.3em] text-mfn-nude mb-1">01</span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-mfn-midnight">Pure Silk</span>
              <span className="text-[11px] text-mfn-midnight/50 font-serif italic mt-1">Weightless feel</span>
            </div>
            <div className="flex flex-col items-center border-x border-mfn-midnight/10 px-2">
              <span className="text-[9px] uppercase tracking-[0.3em] text-mfn-nude mb-1">02</span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-mfn-midnight">Discreet</span>
              <span className="text-[11px] text-mfn-midnight/50 font-serif italic mt-1">Unbranded boxes</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[9px] uppercase tracking-[0.3em] text-mfn-nude mb-1">03</span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-mfn-midnight">Atelier Cut</span>
              <span className="text-[11px] text-mfn-midnight/50 font-serif italic mt-1">Custom draped</span>
            </div>
          </div>

          {/* ACCORDIONS */}
          <div className="divide-y divide-mfn-midnight/10 border-y border-mfn-midnight/10">
            {composition && <Acc title="Fabric & Composition" open>{composition}</Acc>}
            {ritual && <Acc title="The Evening Ritual & Care">{ritual}</Acc>}
            {sizingNote && <Acc title="Sizing & Fit Guidance">{sizingNote}</Acc>}
            <Acc title="Privacy & Outer Packaging">
              Every order is packed in a heavyweight matte presentation box, enclosed inside a plain courier mailer with no brand markings or hint of its contents.
            </Acc>
          </div>

          <div className="flex flex-wrap gap-8 mt-6">
            <Link href="/size-guide" className="link-lux text-[9px] uppercase tracking-[0.4em]">Find your size</Link>
            <Link href={`/gift-builder?add=${product.handle}`} className="link-lux text-[9px] uppercase tracking-[0.4em]">Gift this piece</Link>
          </div>

          {/* CONCIERGE PROMISE */}
          <div className="mt-8 bg-[#F2ECE7] p-6 rounded-sm border border-mfn-midnight/5 flex flex-col gap-2">
            <span className="text-[9px] uppercase tracking-[0.4em] text-mfn-nude">Bridal & Anniversary Concierge</span>
            <p className="text-xs font-light text-mfn-midnight/80 leading-relaxed">
              Need custom sizing for a wedding trousseau or gift curation? Our private stylists are available via WhatsApp to guide your selection.
            </p>
          </div>

        </div>

      </div>

      <RecentlyViewedTracker
        item={{
          handle: product.handle,
          title: product.title,
          image: images[0]?.node?.url,
          amount: product.priceRange?.maxVariantPrice?.amount,
          currency: product.priceRange?.maxVariantPrice?.currencyCode,
        }}
      />

      <ReviewsSection reviews={productReviews} fallback={metafieldRating(product)} />

      <TrackView
        currency={product.priceRange?.maxVariantPrice?.currencyCode}
        item={{ id: numericId(product.id), name: product.title, price: parseFloat(product.priceRange?.maxVariantPrice?.amount || '0'), quantity: 1 }}
      />

      {related.length > 0 && (
        <section className="max-w-[1700px] mx-auto mt-40">
          <span className="text-[9px] uppercase tracking-[0.5em] text-mfn-gold block mb-3">Complete the ritual</span>
          <h3 className="font-serif text-4xl md:text-5xl font-light mb-14">You May Also Love</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 md:gap-x-10 gap-y-14">
            {related.map((r: any) => (
              <ProductCard key={r.id} product={r} sizes="(max-width: 768px) 50vw, 25vw" />
            ))}
          </div>
        </section>
      )}

      <div className="-mx-6 md:-mx-16 mt-16">
        <RecentlyViewed excludeHandle={product.handle} />
      </div>
    </div>
  );
}