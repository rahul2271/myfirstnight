import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Instantly refresh the site after editing in Shopify (otherwise changes appear within ~1–5 min).
// Call: /api/revalidate?secret=YOUR_REVALIDATE_SECRET  (e.g. from a Shopify Flow "Send HTTP request").
export async function GET(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || new URL(req.url).searchParams.get('secret') !== secret) return NextResponse.json({ ok: false }, { status: 401 });
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true, at: new Date().toISOString() });
}
export const POST = GET;
