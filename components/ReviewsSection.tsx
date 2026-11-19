import { Stars } from './Stars';
import { Review, summarize } from '../lib/reviews';

export function ReviewsSection({ reviews, fallback }: { reviews: Review[]; fallback: { average: number; count: number } | null }) {
  const s = summarize(reviews);
  if (!s && !fallback) return null;
  const avg = s?.average ?? fallback!.average;
  const count = s?.count ?? fallback!.count;

  return (
    <section id="reviews" className="max-w-[1700px] mx-auto mt-40 scroll-mt-40">
      <span className="text-[9px] uppercase tracking-[0.5em] text-mfn-gold block mb-3">Words from our clients</span>
      <h3 className="font-serif text-4xl md:text-5xl font-light mb-14">Reviews</h3>

      <div className="grid md:grid-cols-12 gap-16">
        <div className="md:col-span-4">
          <div className="font-serif text-8xl font-light leading-none mb-4">{avg.toFixed(1)}</div>
          <Stars value={avg} size={18} />
          <p className="text-[10px] uppercase tracking-[0.3em] text-mfn-midnight/50 mt-4">Based on {count} review{count > 1 ? 's' : ''}</p>
          {s && (
            <div className="mt-8 space-y-2">
              {s.dist.map(({ n, c }) => (
                <div key={n} className="flex items-center gap-3 text-[10px] tracking-widest text-mfn-midnight/60">
                  <span className="w-3">{n}</span>
                  <div className="flex-1 h-px bg-mfn-midnight/10 relative">
                    <div className="absolute inset-y-0 -top-px h-[3px] bg-mfn-gold" style={{ width: `${(c / s.count) * 100}%` }} />
                  </div>
                  <span className="w-4 text-right">{c}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-8 divide-y divide-mfn-midnight/10 border-y border-mfn-midnight/10">
          {reviews.slice(0, 8).map((r) => (
            <article key={r.id} className="py-8">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
                <Stars value={r.rating} size={13} />
                {r.verified && <span className="text-[9px] uppercase tracking-[0.3em] text-mfn-gold">✦ Verified purchase</span>}
              </div>
              {r.title && <h4 className="font-serif text-2xl font-light mb-2">{r.title}</h4>}
              <p className="text-sm font-light text-mfn-midnight/70 leading-relaxed max-w-2xl">{r.body}</p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-mfn-midnight/45 mt-4">
                {r.author}{r.location ? ` · ${r.location}` : ''}
              </p>
            </article>
          ))}
          {reviews.length === 0 && <p className="py-8 text-sm text-mfn-midnight/60 font-light">Verified ratings are shown above. Written reviews will appear here.</p>}
        </div>
      </div>
    </section>
  );
}
