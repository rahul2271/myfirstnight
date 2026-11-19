import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getArticle, getArticles, fmtDate } from '../../../lib/journal';
import { SITE_URL, whatsappLink } from '../../../lib/config';
import { Reveal } from '../../../components/Reveal';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const a = await getArticle(params.slug);
  if (!a) return {};
  const title = a.seoTitle || a.title;
  const description = a.seoDescription || a.excerpt;
  return {
    title,
    description,
    alternates: { canonical: `/journal/${a.slug}` },
    openGraph: { type: 'article', title, description, publishedTime: a.date, images: a.cover ? [a.cover.url] : undefined },
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const a = await getArticle(params.slug);
  if (!a) notFound();
  const more = (await getArticles(6)).filter((x) => x.slug !== a.slug).slice(0, 2);
  const url = `${SITE_URL}/journal/${a.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.excerpt,
    datePublished: a.date,
    author: { '@type': 'Organization', name: 'MyFirstNight' },
    publisher: { '@type': 'Organization', name: 'MyFirstNight' },
    mainEntityOfPage: url,
    ...(a.cover && { image: a.cover.url }),
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="relative grain bg-mfn-midnight text-mfn-silk pt-56 pb-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(184,155,106,0.22),transparent_65%)]" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <Link href="/journal" className="text-[9px] uppercase tracking-[0.5em] text-mfn-gold block mb-8 hover:text-mfn-champagne transition-colors">← The Journal</Link>
          <h1 className="font-serif font-light leading-[1.02] text-4xl md:text-7xl mb-8">{a.title}</h1>
          <p className="text-[10px] uppercase tracking-[0.35em] text-mfn-silk/50">{fmtDate(a.date)} · {a.readMinutes} min read{a.tags[0] ? ` · ${a.tags[0]}` : ''}</p>
        </div>
      </header>

      {a.cover && (
        <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-10">
          <div className="relative aspect-[16/9] overflow-hidden bg-mfn-blush">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.cover.url} alt={a.cover.alt} className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-6 py-24">
        {a.excerpt && <p className="font-serif italic text-2xl md:text-3xl font-light leading-[1.4] text-mfn-midnight/80 mb-16">{a.excerpt}</p>}

        <div
          className="space-y-6 text-[15px] font-light leading-[1.9] text-mfn-midnight/80 [&_h2]:font-serif [&_h2]:text-4xl [&_h2]:font-light [&_h2]:mt-16 [&_h2]:mb-4 [&_h3]:font-serif [&_h3]:text-2xl [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_img]:w-full [&_img]:h-auto [&_blockquote]:border-l [&_blockquote]:border-mfn-gold [&_blockquote]:pl-6 [&_blockquote]:font-serif [&_blockquote]:italic [&_blockquote]:text-xl"
          dangerouslySetInnerHTML={{ __html: a.html }}
        />

        <div className="mt-20 pt-8 border-t border-mfn-midnight/10 flex flex-wrap items-center justify-between gap-6 text-[10px] uppercase tracking-[0.3em]">
          <span className="text-mfn-midnight/50">Share</span>
          <a href={`https://wa.me/?text=${encodeURIComponent(`${a.title} ${url}`)}`} target="_blank" rel="noopener noreferrer" className="link-lux">WhatsApp</a>
          <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(a.title)}`} target="_blank" rel="noopener noreferrer" className="link-lux">X</a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" className="link-lux">Facebook</a>
        </div>
      </div>

      {/* Conversion block */}
      <section className="bg-mfn-blush py-24 px-6 text-center">
        <span className="text-[9px] uppercase tracking-[0.5em] text-mfn-gold block mb-4">Continue the ritual</span>
        <h3 className="font-serif text-4xl md:text-5xl font-light mb-10">Find your piece</h3>
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/bridal" className="bg-mfn-midnight text-mfn-silk px-10 py-5 text-[9px] uppercase tracking-[0.4em] hover:bg-mfn-gold hover:text-mfn-midnight transition-colors duration-500">Bridal Trousseau</Link>
          <Link href="/size-guide" className="border border-mfn-midnight/30 px-10 py-5 text-[9px] uppercase tracking-[0.4em] hover:border-mfn-midnight transition-colors">Size Guide</Link>
          {whatsappLink() && <a href={whatsappLink(`Hello MyFirstNight, I read "${a.title}" and would like some advice.`)} target="_blank" rel="noopener noreferrer" className="link-lux text-[9px] uppercase tracking-[0.4em] self-center">Ask the concierge</a>}
        </div>
      </section>

      {more.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-12">
          {more.map((m) => (
            <Reveal key={m.slug}>
              <Link href={`/journal/${m.slug}`} className="group block">
                <span className="text-[9px] uppercase tracking-[0.4em] text-mfn-gold block mb-3">Keep reading</span>
                <h4 className="font-serif text-3xl font-light leading-tight group-hover:text-mfn-gold transition-colors duration-500">{m.title}</h4>
              </Link>
            </Reveal>
          ))}
        </section>
      )}
    </article>
  );
}
