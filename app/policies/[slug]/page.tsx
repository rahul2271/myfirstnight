import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { shopifyFetch } from '../../../lib/shopify';
import { getShopPoliciesQuery } from '../../../lib/shopify/queries';
import { policies, PolicyKey } from '../../../lib/policies';
import { PageHero } from '../../../components/PageHero';

const shopKey: Record<PolicyKey, string> = {
  shipping: 'shippingPolicy',
  returns: 'refundPolicy',
  privacy: 'privacyPolicy',
  terms: 'termsOfService',
};

export function generateStaticParams() {
  return Object.keys(policies).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = policies[params.slug as PolicyKey];
  return p ? { title: p.title, description: p.intro } : {};
}

export default async function PolicyPage({ params }: { params: { slug: string } }) {
  const key = params.slug as PolicyKey;
  const policy = policies[key];
  if (!policy) notFound();

  // Prefer the policy text maintained in Shopify admin, fall back to local defaults
  let shopifyHtml: string | null = null;
  try {
    const { body } = await shopifyFetch<any>({ query: getShopPoliciesQuery });
    shopifyHtml = body?.data?.shop?.[shopKey[key]]?.body || null;
  } catch {}

  return (
    <>
      <PageHero eyebrow={policy.eyebrow} title={policy.title} intro={policy.intro} />
      <div className="max-w-6xl mx-auto px-6 md:px-16 py-24 grid grid-cols-1 md:grid-cols-12 gap-16">
        <aside className="md:col-span-3">
          <nav className="md:sticky md:top-40 flex md:flex-col gap-4 flex-wrap text-[10px] uppercase tracking-[0.3em]">
            {(Object.keys(policies) as PolicyKey[]).map((k) => (
              <Link key={k} href={`/policies/${k}`} className={k === key ? 'text-mfn-gold' : 'text-mfn-midnight/60 hover:text-mfn-midnight transition-colors'}>
                {policies[k].title.split(' ')[0] === 'Returns,' ? 'Returns' : policies[k].title.split(' &')[0]}
              </Link>
            ))}
            <Link href="/faq" className="text-mfn-midnight/60 hover:text-mfn-midnight transition-colors">FAQ</Link>
            <Link href="/contact" className="text-mfn-midnight/60 hover:text-mfn-midnight transition-colors">Contact</Link>
          </nav>
        </aside>

        <article className="md:col-span-9 max-w-2xl">
          {shopifyHtml ? (
            <div
              className="space-y-5 text-sm font-light leading-relaxed text-mfn-midnight/75 [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:font-light [&_h2]:mt-12 [&_h3]:font-serif [&_h3]:text-2xl [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5"
              dangerouslySetInnerHTML={{ __html: shopifyHtml }}
            />
          ) : (
            policy.sections.map((s, i) => (
              <section key={s.h} className="mb-14">
                <span className="font-serif italic text-mfn-gold text-lg">{String(i + 1).padStart(2, '0')}</span>
                <h2 className="font-serif text-3xl font-light mb-4 mt-1">{s.h}</h2>
                {s.p.map((t, j) => (
                  <p key={j} className="text-sm font-light leading-relaxed text-mfn-midnight/70 mb-3">{t}</p>
                ))}
              </section>
            ))
          )}
          <p className="text-[10px] uppercase tracking-[0.3em] text-mfn-midnight/40 mt-16">Questions? <Link href="/contact" className="link-lux text-mfn-midnight">Contact us</Link></p>
        </article>
      </div>
    </>
  );
}
