'use client';

import { useState } from 'react';
import { useCart } from './CartDrawer';
import { formatPrice } from '../lib/format';

export function AddToCartButton({ product, variants }: { product: any, variants: any[] }) {
  const { addToCart } = useCart();
  
  // Default to the first variant
  const [selectedVariant, setSelectedVariant] = useState(variants[0]?.node);

  // Extract prices dynamically from the currently selected variant
  const currency = selectedVariant?.price?.currencyCode || 'INR';
  const currentPrice = parseFloat(selectedVariant?.price?.amount || 0);
  const compareAtPrice = selectedVariant?.compareAtPrice ? parseFloat(selectedVariant.compareAtPrice.amount) : null;

  // Calculate discount amount and percentage if compareAtPrice exists
  const hasDiscount = compareAtPrice && compareAtPrice > currentPrice;
  const discountAmount = hasDiscount ? compareAtPrice - currentPrice : 0;
  const discountPercentage = hasDiscount ? Math.round((discountAmount / compareAtPrice) * 100) : 0;

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    // Pass the exact current discounted price to the cart
    addToCart(product, selectedVariant.id, selectedVariant.title, currentPrice);
  };

  return (
    <div className="w-full">
      {/* Live Dynamic Pricing Display */}
      <div className="flex items-baseline gap-4 mb-8">
        <span className="text-2xl font-serif italic text-mfn-midnight">
          {formatPrice(currentPrice, currency)}
        </span>

        {hasDiscount && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-light text-mfn-midnight/40 line-through">
              {formatPrice(compareAtPrice, currency)}
            </span>
            <span className="text-[10px] uppercase tracking-wider bg-mfn-nude/20 text-mfn-midnight px-2.5 py-1 rounded-sm font-medium">
              Save {formatPrice(discountAmount, currency)} ({discountPercentage}% OFF)
            </span>
          </div>
        )}
      </div>

      {/* Size Selector */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] uppercase tracking-[0.3em] font-medium">Select Size</span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {variants.map(({ node: variant }: any) => {
            const isSelected = selectedVariant?.id === variant.id;
            return (
              <button 
                key={variant.id}
                type="button"
                onClick={() => setSelectedVariant(variant)}
                className={`py-4 border text-[10px] uppercase tracking-[0.3em] transition-colors ${
                  isSelected 
                    ? 'bg-mfn-midnight text-mfn-silk border-mfn-midnight' 
                    : 'border-mfn-midnight/20 hover:border-mfn-midnight text-mfn-midnight'
                }`}
              >
                {variant.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Add to Cart Button */}
      <button 
        type="button"
        onClick={handleAddToCart}
        className="w-full bg-mfn-midnight text-mfn-silk py-5 text-[10px] uppercase tracking-[0.4em] hover:bg-mfn-gold hover:text-mfn-midnight transition-colors duration-500 cursor-pointer"
      >
        Add to Trousseau
      </button>
    </div>
  );
}