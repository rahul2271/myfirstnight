import Link from 'next/link';
import { getArticles, fmtDate } from '../../lib/journal';
import { PageHero } from '../../components/PageHero';
import { Reveal } from '../../components/Reveal';
import { NewsletterForm } from '../../components/NewsletterForm';

export const metadata = {
  title: 'The Journal',
  description: 'Guides on bridal trousseaus, silk and lace care, sizing and the art of gifting.',
};

export default async function JournalPage() {
  const articles = await getArticles();
  const [lead, ...rest] = articles;

  return (
    <>
      <PageHero eyebrow="The Journal" title="Notes from the Atelier" intro="Guides for brides, gifts and the quiet details of luxury intimates." />

      {articles.length === 0 && (
        <p className="text-center py-40 font-serif italic text-2xl text-mfn-midnight/50">Our first notes are being written.</p>
      )}

      {lead && (
        <section className="max-w-[1500px] mx-auto px-6 md:px-16 pt-24">
          <Reveal>
            <Link href={`/journal/${lead.slug}`} className="group grid md:grid-cols-2 gap-10 md:gap-20 items-center">
              <div className="relative aspect-[4/3] overflow-hidden bg-mfn-blush">
                {lead.cover && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={lead.cover.url} alt={lead.cover.alt} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2500ms] group-hover:scale-105" />
                )}
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-[0.5em] text-mfn-gold block mb-5">{lead.tags[0] || 'Featured'} · {lead.readMinutes} min read</span>
                <h2 className="font-serif text-4xl md:text-6xl font-light leading-[1.05] mb-6 group-hover:text-mfn-gold transition-colors duration-500">{lead.title}</h2>
                <p className="text-sm font-light text-mfn-midnight/65 leading-relaxed max-w-lg mb-8">{lead.excerpt}</p>
                <span className="link-lux text-[9px] uppercase tracking-[0.4em]">Read the article</span>
              </div>
            </Link>
          </Reveal>
        </section>
      )}

      {rest.length > 0 && (
        <section className="max-w-[1500px] mx-auto px-6 md:px-16 py-32 grid md:grid-cols-3 gap-12 md:gap-14">
          {rest.map((a, i) => (
            <Reveal key={a.slug} delay={i * 100}>
              <Link href={`/journal/${a.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-mfn-blush mb-6">
                  {a.cover && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.cover.url} alt={a.cover.alt} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2500ms] group-hover:scale-105" />
                  )}
                </div>
                <span className="text-[9px] uppercase tracking-[0.4em] text-mfn-gold block mb-3">{a.tags[0] || 'Journal'} · {fmtDate(a.date)}</span>
                <h3 className="font-serif text-2xl md:text-3xl font-light leading-tight mb-3 group-hover:text-mfn-gold transition-colors duration-500">{a.title}</h3>
                <p className="text-sm font-light text-mfn-midnight/60 leading-relaxed line-clamp-3">{a.excerpt}</p>
              </Link>
            </Reveal>
          ))}
        </section>
      )}

      <section className="relative grain bg-mfn-midnight text-mfn-silk py-32 px-6 text-center">
        <div className="relative z-10 max-w-xl mx-auto">
          <h3 className="font-serif text-4xl md:text-6xl font-light mb-8">Never miss a note</h3>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
