'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

export type Letter = { id: string; quote: string; author: string; location: string; piece: string };

// Letters come from REAL reviews marked "featured" in Shopify (metaobject type: review).
export function LoveLetters({ letters: loveLetters = [] }: { letters?: Letter[] }) {
  if (loveLetters.length === 0) return null;
  return (
    <section className="w-full py-32 bg-[#F7F4EF] text-mfn-midnight border-t border-mfn-midnight/10 px-6 md:px-16 overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[9px] uppercase tracking-[0.6em] text-mfn-nude mb-3 block">Private Correspondences</span>
          <h2 className="text-3xl md:text-5xl font-serif font-light tracking-tight">Words from Our Clients</h2>
        </div>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={50}
          slidesPerView={1}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="love-letters-swiper pb-16"
        >
          {loveLetters.map((letter) => (
            <SwiperSlide key={letter.id}>
              <div className="max-w-3xl mx-auto text-center flex flex-col items-center px-4">
                
                {/* Decorative Quote Mark */}
                <span className="text-4xl font-serif italic text-mfn-nude mb-6">“</span>

                {/* Quote Text */}
                <p className="text-lg md:text-2xl font-serif font-light italic leading-relaxed text-mfn-midnight/80 mb-10">
                  {letter.quote}
                </p>

                {/* Author Details */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[11px] uppercase tracking-[0.3em] font-medium text-mfn-midnight">
                    {letter.author} <span className="text-mfn-midnight/40">— {letter.location}</span>
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-mfn-nude">
                    {letter.piece ? `Acquisition: ${letter.piece}` : ''}
                  </span>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>

      {/* Custom Pagination Styling */}
      <style jsx global>{`
        .love-letters-swiper .swiper-pagination-bullet {
          background-color: #C8B1A0 !important;
          opacity: 0.4;
          width: 8px;
          height: 8px;
          border-radius: 0px; /* Sharp minimal luxury square dots */
          transition: all 0.5s ease;
        }
        .love-letters-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          width: 24px;
        }
      `}</style>
    </section>
  );
}