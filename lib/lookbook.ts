import { shopifyFetch } from './shopify';

export type LookProduct = {
  id: string; title: string; handle: string;
  priceRange: any; featuredImage?: { url: string; altText?: string };
  images: { edges: { node: { url: string; altText?: string } }[] };
};
export type Chapter = { id: string; title: string; subtitle: string; story: string; image?: { url: string; alt: string }; products: LookProduct[] };

const PRODUCT = `
  id title handle
  priceRange { maxVariantPrice { amount currencyCode } }
  featuredImage { url altText }
  images(first: 4) { edges { node { url altText } } }
`;

// Preferred: chapters you curate in Shopify (metaobject type "lookbook_chapter").
const chaptersQuery = `
  query lookbook {
    metaobjects(type: "lookbook_chapter", first: 20) {
      edges { node { id fields {
        key value
        reference { ... on MediaImage { image { url altText } } }
        references(first: 12) { nodes { ... on Product { ${PRODUCT} } } }
      } } }
    }
  }
`;

// Fallback: one chapter per collection.
const collectionsQuery = `
  query lookbookCollections {
    collections(first: 6) { edges { node { id title description image { url altText } products(first: 8) { edges { node { ${PRODUCT} } } } } } }
  }
`;

export async function getLookbook(): Promise<Chapter[]> {
  try {
    const { body } = await shopifyFetch<any>({ query: chaptersQuery, revalidate: 60 });
    const edges = body?.data?.metaobjects?.edges || [];
    const chapters: (Chapter & { order: number })[] = edges.map(({ node }: any) => {
      const f: Record<string, any> = {};
      (node.fields || []).forEach((x: any) => (f[x.key] = x));
      const img = f.image?.reference?.image;
      return {
        id: node.id,
        title: f.title?.value || 'Chapter',
        subtitle: f.subtitle?.value || '',
        story: f.story?.value || '',
        image: img ? { url: img.url, alt: img.altText || f.title?.value || '' } : undefined,
        products: (f.products?.references?.nodes || []).filter((p: any) => p?.handle),
        order: parseInt(f.order?.value || '999', 10),
      };
    });
    const real = chapters.filter((c) => c.products.length || c.image).sort((a, b) => a.order - b.order);
    if (real.length) return real;
  } catch {}

  try {
    const { body } = await shopifyFetch<any>({ query: collectionsQuery, revalidate: 60 });
    return (body?.data?.collections?.edges || [])
      .map(({ node }: any) => {
        const products = (node.products?.edges || []).map((e: any) => e.node);
        const img = node.image || products[0]?.featuredImage;
        return {
          id: node.id,
          title: node.title,
          subtitle: '',
          story: node.description || '',
          image: img ? { url: img.url, alt: img.altText || node.title } : undefined,
          products,
        } as Chapter;
      })
      .filter((c: Chapter) => c.products.length);
  } catch {
    return [];
  }
}
