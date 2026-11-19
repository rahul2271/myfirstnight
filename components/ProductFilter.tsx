'use client';

import { useState, useMemo } from 'react';
import { ProductCard } from './ProductCard';

export function ProductFilter({ products, initialQuery = '' }: { products: any[]; initialQuery?: string }) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState('featured');

  // Filter and sort products dynamically on the client side
  const filteredProducts = useMemo(() => {
    return products
      .filter(({ node: product }) => {
        const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
      })
      .sort((a, b) => {
        const priceA = parseFloat(a.node.priceRange?.maxVariantPrice?.amount || 0);
        const priceB = parseFloat(b.node.priceRange?.maxVariantPrice?.amount || 0);

        if (sortBy === 'price-low') return priceA - priceB;
        if (sortBy === 'price-high') return priceB - priceA;
        return 0; // Default featured order
      });
  }, [products, searchQuery, sortBy]);

  return (
    <div className="w-full">
      
      {/* ==========================================
          SEARCH & FILTER CONTROL BAR
          ========================================== */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16 pb-8 border-b border-mfn-midnight/10">
        
        {/* Live Search Input */}
        <div className="w-full md:w-96 relative">
          <input
            type="text"
            placeholder="Search archive pieces..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-b border-mfn-midnight/20 py-3 text-xs tracking-widest text-mfn-midnight placeholder:text-mfn-midnight/40 focus:outline-none focus:border-mfn-midnight transition-colors"
          />
          <span className="absolute right-0 top-3 text-[10px] tracking-widest text-mfn-midnight/40 uppercase">
            [Search]
          </span>
        </div>

        {/* Sorting Dropdown & Count */}
        <div className="flex items-center justify-between w-full md:w-auto gap-8">
          <span className="text-[10px] uppercase tracking-[0.3em] text-mfn-midnight/50">
            Showing {filteredProducts.length} Pieces
          </span>

          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-mfn-midnight/60">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-[10px] uppercase tracking-[0.3em] text-mfn-midnight py-2 border-b border-mfn-midnight/20 focus:outline-none cursor-pointer"
            >
              <option value="featured" className="bg-mfn-silk">Featured Curations</option>
              <option value="price-low" className="bg-mfn-silk">Price: Low to High</option>
              <option value="price-high" className="bg-mfn-silk">Price: High to Low</option>
            </select>
          </div>
        </div>

      </div>

      {/* ==========================================
          PRODUCTS GRID
          ========================================== */}
      {filteredProducts.length === 0 ? (
        <div className="py-32 text-center">
          <p className="font-serif italic text-lg text-mfn-midnight/50 mb-4">No pieces found matching your criteria.</p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-[9px] uppercase tracking-[0.4em] border-b border-mfn-midnight pb-1 hover:text-mfn-nude"
          >
            Clear Search Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-24">
          {filteredProducts.map(({ node: product }: any) => (
            <ProductCard key={product.id} product={product} sizes="(max-width: 768px) 100vw, 33vw" />
          ))}
        </div>
      )}

    </div>
  );
}