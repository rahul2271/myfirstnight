'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import { ProductCard } from './ProductCard';

import 'swiper/css';
import 'swiper/css/free-mode';

export function ProductSlider({ products }: { products: any[] }) {
  return (
    <div className="w-full max-w-[1700px] mx-auto px-6 md:px-16">
      <Swiper
        modules={[FreeMode]}
        spaceBetween={35}
        slidesPerView={1.2}
        freeMode={true}
        breakpoints={{
          640: { slidesPerView: 2.2, spaceBetween: 30 },
          1024: { slidesPerView: 4, spaceBetween: 40 },
        }}
        className="w-full !py-12 !px-2"
      >
        {products.map(({ node: product }: any) => {
          return (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}