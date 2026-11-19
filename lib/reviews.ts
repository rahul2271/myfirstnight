import { shopifyFetch } from './shopify';

export type Review = {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  location: string;
  date: string;
  verified: boolean;
  featured: boolean;
  productHandle: string;
  productTitle: string;
};

// Reads REAL reviews that you (or a review app via Shopify Flow/import) store as
// Shopify metaobjects of type "review". See SETUP.md for the 2-minute definition.
const query = `
  query reviews {
    metaobjects(type: "review", first: 100) {
      edges {
        node {
          id
          fields {
            key
            value
            reference { ... on Product { handle title } }
          }
        }
      }
    }
  }
`;

export async function getReviews(): Promise<Review[]> {
  try {
    const { body } = await shopifyFetch<any>({ query });
    const edges = body?.data?.metaobjects?.edges || [];
    return edges
      .map(({ node }: any) => {
        const f: Record<string, any> = {};
        (node.fields || []).forEach((x: any) => (f[x.key] = x));
        const rating = Math.round(parseFloat(f.rating?.value || '0'));
        return {
          id: node.id,
          author: f.author?.value || 'Verified client',
          rating,
          title: f.title?.value || '',
          body: f.body?.value || '',
          location: f.location?.value || '',
          date: f.date?.value || '',
          verified: f.verified?.value === 'true',
          featured: f.featured?.value === 'true',
          productHandle: f.product?.reference?.handle || '',
          productTitle: f.product?.reference?.title || '',
        } as Review;
      })
      .filter((r: Review) => r.rating >= 1 && r.rating <= 5 && r.body)
      .sort((a: Review, b: Review) => (b.date || '').localeCompare(a.date || ''));
  } catch {
    return [];
  }
}

export function summarize(reviews: Review[]) {
  if (!reviews.length) return null;
  const count = reviews.length;
  const average = reviews.reduce((a, r) => a + r.rating, 0) / count;
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, c: reviews.filter((r) => r.rating === n).length }));
  return { count, average, dist };
}

// Star rating written by Shopify/Judge.me/Loox etc. into the standard
// reviews.rating + reviews.rating_count product metafields.
export function metafieldRating(product: any): { average: number; count: number } | null {
  try {
    const raw = product?.reviewRating?.value;
    const count = parseInt(product?.reviewCount?.value || '0', 10);
    if (!raw || !count) return null;
    const average = parseFloat(typeof raw === 'string' && raw.startsWith('{') ? JSON.parse(raw).value : raw);
    return isNaN(average) ? null : { average, count };
  } catch {
    return null;
  }
}
