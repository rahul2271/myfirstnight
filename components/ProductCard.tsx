import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '../lib/format';
import { Stars } from './Stars';
import { metafieldRating } from '../lib/reviews';

export function ProductCard({
  product,
  sizes = '(max-width: 768px) 80vw, 25vw',
  cta = 'Explore Piece',
  align = 'left',
}: {
  product: any;
  sizes?: string;
  cta?: string;
  align?: 'left' | 'center';
}) {
  const primary = product.featuredImage;
  const second = product.images?.edges?.[1]?.node;
  const price = product.priceRange?.maxVariantPrice;
  const rating = metafieldRating(product);

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group flex flex-col"
    >
      <div className="relative w-full aspect-[3/4] bg-mfn-blush mb-6 overflow-hidden">
        {primary ? (
          <Image
            src={primary.url}
            alt={primary.altText || product.title}
            fill
            sizes={sizes}
            className={`object-cover transition-all duration-[1400ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.04] ${
              second ? 'group-hover:opacity-0' : ''
            }`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[9px] tracking-[0.4em] text-mfn-midnight/20 uppercase">
            MyFirstNight
          </div>
        )}
        {second && (
          <Image
            src={second.url}
            alt={second.altText || product.title}
            fill
            sizes={sizes}
            className="object-cover absolute inset-0 opacity-0 transition-all duration-[1400ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:opacity-100 group-hover:scale-[1.04]"
          />
        )}

        {/* thin inner gold frame on hover */}
        <div className="absolute inset-3 border border-mfn-champagne/0 group-hover:border-mfn-champagne/70 transition-colors duration-700 pointer-events-none" />

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent pt-16 pb-6 flex justify-center opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700">
          <span className="text-mfn-silk text-[9px] uppercase tracking-[0.4em]">{cta}</span>
        </div>
      </div>

      <div className={`flex flex-col gap-2 ${align === 'center' ? 'items-center text-center' : 'items-start'}`}>
        <h3 className="text-[11px] font-normal tracking-[0.3em] uppercase text-mfn-midnight group-hover:text-mfn-gold transition-colors duration-500 line-clamp-1">
          {product.title}
        </h3>
        {rating && (
          <span className="flex items-center gap-2 text-[10px] text-mfn-midnight/45">
            <Stars value={rating.average} size={11} /> ({rating.count})
          </span>
        )}
        <p className="text-[13px] text-mfn-midnight/55 font-serif italic">
          {price ? formatPrice(price.amount, price.currencyCode) : ''}
        </p>
      </div>
    </Link>
  );
}
