import Link from 'next/link';
import { faqs } from '../../lib/policies';
import { PageHero } from '../../components/PageHero';

export const metadata = { title: 'FAQ', description: 'Answers on sizing, discreet delivery, returns, gifting and discount codes.' };

export default function FaqPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero eyebrow="Client Care" title="Frequently Asked" intro="Everything you may want to know, answered with discretion." />
      <div className="max-w-3xl mx-auto px-6 py-24 divide-y divide-mfn-midnight/10 border-y border-mfn-midnight/10 my-16">
        {faqs.map((f) => (
          <details key={f.q} className="acc py-7">
            <summary className="flex justify-between items-center gap-6 font-serif text-2xl font-light">
              {f.q}
              <span className="acc-plus text-mfn-gold text-2xl transition-transform duration-500">+</span>
            </summary>
            <p className="text-sm font-light text-mfn-midnight/70 leading-relaxed mt-4 max-w-xl">{f.a}</p>
          </details>
        ))}
      </div>
      <div className="text-center pb-32">
        <p className="font-serif italic text-2xl text-mfn-midnight/60 mb-8">Still have a question?</p>
        <Link href="/contact" className="bg-mfn-midnight text-mfn-silk px-10 py-5 text-[10px] uppercase tracking-[0.4em] hover:bg-mfn-gold hover:text-mfn-midnight transition-colors duration-500">
          Speak to the Concierge
        </Link>
      </div>
    </>
  );
}
