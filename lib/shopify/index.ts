const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_GRAPHQL_API_VERSION || '2024-01';

export async function shopifyFetch<T>({
  query,
  variables,
  tags,
  cache,
  revalidate = 300,
}: {
  query: string;
  variables?: any;
  tags?: string[];
  cache?: RequestCache;
  revalidate?: number;
}): Promise<{ status: number; body: T } | never> {
  const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;

  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken!,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      }),
      ...(cache ? { cache } : { next: { revalidate, ...(tags && { tags }) } })
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body
    };
  } catch (error) {
    console.error('Error fetching from Shopify:', error);
    throw error;
  }
}
