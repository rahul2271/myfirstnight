import { shopifyFetch } from '../shopify';

const CART_FIELDS = `
  id
  checkoutUrl
  discountCodes { code applicable }
  cost {
    subtotalAmount { amount currencyCode }
    totalAmount { amount currencyCode }
  }
  discountAllocations { discountedAmount { amount } }
  lines(first: 50) {
    edges { node { discountAllocations { discountedAmount { amount } } } }
  }
`;

const createCartMutation = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`;

export type CartQuote = {
  cartId?: string | null;
  checkoutUrl: string | null;
  codeApplicable: boolean | null; // null = no code supplied
  subtotal: number;
  total: number;
  discount: number;
  currency: string;
  error?: string;
};

/**
 * Builds a real Shopify cart (optionally with a discount code) so the price,
 * the discount and the checkout URL all come from Shopify itself.
 */
export async function quoteShopifyCart(cartItems: any[], discountCode?: string, email?: string): Promise<CartQuote> {
  // Pre-filling the buyer email lets Shopify's abandoned-checkout emails recover the order.
  let buyerEmail = email;
  if (!buyerEmail && typeof window !== 'undefined') {
    try { buyerEmail = localStorage.getItem('mfn-email') || undefined; } catch {}
  }
  const lines = cartItems.map((item) => ({
    merchandiseId: item.variantId,
    quantity: item.quantity,
    ...(item.attributes?.length ? { attributes: item.attributes.map((a: any) => ({ key: String(a.key), value: String(a.value) })) } : {}),
  }));
  const code = discountCode?.trim();

  try {
    const { body } = await shopifyFetch<any>({
      query: createCartMutation,
      variables: { input: { lines, ...(code ? { discountCodes: [code] } : {}), ...(buyerEmail ? { buyerIdentity: { email: buyerEmail } } : {}) } },
      cache: 'no-store',
    });

    const result = body?.data?.cartCreate;
    if (result?.userErrors?.length) {
      return { checkoutUrl: null, codeApplicable: null, subtotal: 0, total: 0, discount: 0, currency: 'INR', error: result.userErrors[0].message };
    }

    const cart = result?.cart;
    const subtotal = parseFloat(cart?.cost?.subtotalAmount?.amount || '0');
    const total = parseFloat(cart?.cost?.totalAmount?.amount || '0');
    const cartLevel = (cart?.discountAllocations || []).reduce((a: number, d: any) => a + parseFloat(d.discountedAmount.amount), 0);
    const lineLevel = (cart?.lines?.edges || []).reduce(
      (a: number, { node }: any) => a + (node.discountAllocations || []).reduce((b: number, d: any) => b + parseFloat(d.discountedAmount.amount), 0),
      0
    );
    const match = (cart?.discountCodes || []).find((d: any) => d.code.toLowerCase() === code?.toLowerCase());

    return {
      cartId: cart?.id || null,
      checkoutUrl: cart?.checkoutUrl || null,
      codeApplicable: code ? !!match?.applicable : null,
      subtotal,
      total,
      discount: Math.max(cartLevel + lineLevel, 0),
      currency: cart?.cost?.totalAmount?.currencyCode || 'INR',
    };
  } catch (e) {
    console.error('Shopify cart error:', e);
    return { checkoutUrl: null, codeApplicable: null, subtotal: 0, total: 0, discount: 0, currency: 'INR', error: 'Could not reach the store. Please try again.' };
  }
}

export async function createShopifyCheckout(cartItems: any[], discountCode?: string) {
  const quote = await quoteShopifyCart(cartItems, discountCode);
  return quote.checkoutUrl;
}
