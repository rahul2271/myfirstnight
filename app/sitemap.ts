import type { MetadataRoute } from 'next';
import { shopifyFetch } from '../lib/shopify';
import { SITE_URL } from '../lib/config';
import { getArticles } from '../lib/journal';

const handlesQuery = `
  query handles($first: Int) {
    products(first: $first) { edges { node { handle updatedAt } } }
  }
`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = ['', '/discover', '/bridal', '/gifting', '/gift-builder', '/lookbook', '/journal', '/collections', '/about', '/size-guide', '/faq', '/contact', '/policies/shipping', '/policies/returns', '/policies/privacy', '/policies/terms'].map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: p === '' ? 1 : 0.8,
  }));

  try {
    const { body } = await shopifyFetch<any>({ query: handlesQuery, variables: { first: 250 } });
    const products = (body?.data?.products?.edges || []).map(({ node }: any) => ({
      url: `${SITE_URL}/products/${node.handle}`,
      lastModified: new Date(node.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
    const posts = (await getArticles(50)).map((a) => ({
      url: `${SITE_URL}/journal/${a.slug}`,
      lastModified: new Date(a.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
    return [...pages, ...products, ...posts];
  } catch {
    return pages;
  }
}
