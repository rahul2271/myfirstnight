import { shopifyFetch } from '../../lib/shopify';
import { getGiftProductsQuery } from '../../lib/shopify/queries';
import { PageHero } from '../../components/PageHero';
import { GiftBuilder } from '../../components/GiftBuilder';

export const metadata = {
  title: 'Gift Builder',
  description: 'Build a bespoke gift set: choose up to three pieces, add a monogram and a handwritten note.',
};

export default async function GiftBuilderPage({ searchParams }: { searchParams: { add?: string } }) {
  let products: any[] = [];
  try {
    const { body } = await shopifyFetch<any>({ query: getGiftProductsQuery, variables: { first: 40 } });
    products = (body?.data?.products?.edges || []).filter(({ node }: any) => node.variants?.edges?.some((e: any) => e.node.availableForSale));
  } catch {}

  return (
    <>
      <PageHero dark eyebrow="Bespoke" title="The Gift Builder" intro="Compose a set, add a monogram and a handwritten note, and we will present it beautifully." />
      {products.length ? (
        <GiftBuilder products={products} preselect={searchParams?.add} />
      ) : (
        <p className="text-center py-32 font-serif italic text-2xl text-mfn-midnight/50">Our gift sets are being prepared.</p>
      )}
    </>
  );
}
