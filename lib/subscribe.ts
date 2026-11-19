// Server-only: subscribe an email to Shopify marketing (customer with email consent).
const mutation = `
  mutation subscribe($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer { id }
      userErrors { field message }
    }
  }
`;

export async function subscribeEmail(email: string, tag = 'inner-circle'): Promise<{ ok: boolean; error?: string; status?: number }> {
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const domain = process.env.SHOPIFY_ADMIN_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const version = process.env.SHOPIFY_GRAPHQL_API_VERSION || '2024-01';
  if (!token || !domain) return { ok: false, error: 'Sign-up is not configured yet.', status: 503 };

  try {
    const res = await fetch(`https://${domain}/admin/api/${version}/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({
        query: mutation,
        variables: {
          input: {
            email,
            tags: [tag],
            emailMarketingConsent: { marketingState: 'SUBSCRIBED', marketingOptInLevel: 'SINGLE_OPT_IN' },
          },
        },
      }),
      cache: 'no-store',
    });
    const json = await res.json();
    const errors = json?.data?.customerCreate?.userErrors || [];
    const exists = errors.some((e: any) => /taken|already/i.test(e.message));
    if ((errors.length && !exists) || json?.errors) {
      console.error('Subscribe error:', errors, json?.errors);
      return { ok: false, error: 'We could not complete your request. Please try again.', status: 502 };
    }
    return { ok: true };
  } catch (e) {
    console.error(e);
    return { ok: false, error: 'Something went wrong. Please try again.', status: 500 };
  }
}
