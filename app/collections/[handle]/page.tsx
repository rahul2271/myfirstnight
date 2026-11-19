import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { shopifyFetch } from '../../../lib/shopify';
import { getCollectionQuery } from '../../../lib/shopify/queries';
import { PageHero } from '../../../components/PageHero';
import { ProductFilter } from '../../../components/ProductFilter';

async function load(handle: string) {
  try {
    const { body } = await shopifyFetch<any>({ query: getCollectionQuery, variables: { handle, first: 48 } });
    return body?.data?.collection || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const c = await load(params.handle);
  return c ? { title: c.title, description: c.description || undefined } : {};
}

export default async function CollectionPage({ params }: { params: { handle: string } }) {
  const c = await load(params.handle);
  if (!c) notFound();
  return (
    <>
      <PageHero eyebrow="The Edit" title={c.title} intro={c.description} />
      <div className="max-w-[1700px] mx-auto px-6 md:px-16 py-24">
        <ProductFilter products={c.products.edges} />
      </div>
    </>
  );
}
