import Link from 'next/link';
import Image from 'next/image';
import { shopifyFetch } from '../../lib/shopify';
import { getCollectionsQuery } from '../../lib/shopify/queries';
import { PageHero } from '../../components/PageHero';

export const metadata = { title: 'Collections', description: 'Browse every MyFirstNight collection.' };

export default async function CollectionsPage() {
  let collections: any[] = [];
  try {
    const { body } = await shopifyFetch<any>({ query: getCollectionsQuery, variables: { first: 24 } });
    collections = (body?.data?.collections?.edges || []).map((e: any) => e.node);
  } catch {}

  return (
    <>
      <PageHero eyebrow="The Edit" title="Collections" intro="Curated edits for every evening." />
      <div className="max-w-[1700px] mx-auto px-6 md:px-16 py-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        {collections.length === 0 && <p className="col-span-full text-center font-serif italic text-mfn-midnight/50 text-xl">Collections are being curated.</p>}
        {collections.map((c) => (
          <Link key={c.id} href={`/collections/${c.handle}`} className="group relative aspect-[3/4] bg-mfn-midnight overflow-hidden">
            {c.image && <Image src={c.image.url} alt={c.image.altText || c.title} fill sizes="33vw" className="object-cover opacity-80 transition-transform duration-[2500ms] group-hover:scale-105" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
            <h3 className="absolute bottom-8 left-8 right-8 font-serif text-3xl font-light text-mfn-silk">{c.title}</h3>
          </Link>
        ))}
      </div>
    </>
  );
}
