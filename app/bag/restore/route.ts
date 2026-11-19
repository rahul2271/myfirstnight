import { NextResponse } from 'next/server';
import { shopifyFetch } from '../../../lib/shopify';

const query = `query restore($id: ID!) { cart(id: $id) { checkoutUrl totalQuantity } }`;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const home = (flag: string) => NextResponse.redirect(new URL(`/?bag=${flag}`, url.origin));
  try {
    const id = Buffer.from(url.searchParams.get('c') || '', 'base64url').toString();
    if (!id.startsWith('gid://shopify/Cart/')) return home('invalid');
    const { body } = await shopifyFetch<any>({ query, variables: { id }, cache: 'no-store' });
    const cart = body?.data?.cart;
    if (!cart?.checkoutUrl || !cart.totalQuantity) return home('expired');
    return NextResponse.redirect(cart.checkoutUrl); // URL comes from Shopify itself
  } catch {
    return home('error');
  }
}
