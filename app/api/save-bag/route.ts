import { NextResponse } from 'next/server';
import { quoteShopifyCart } from '../../../lib/shopify/cart';
import { subscribeEmail } from '../../../lib/subscribe';
import { sendEmail, emailConfigured, esc } from '../../../lib/email';
import { SITE_URL, BRAND } from '../../../lib/config';
import { formatPrice } from '../../../lib/format';

// "Email me my bag": creates a real Shopify cart (buyer email attached, so Shopify's
// abandoned-checkout emails can also follow up), then emails a private restore link.
const hits = new Map<string, { n: number; t: number }>();

export async function POST(req: Request) {
  if (!emailConfigured()) return NextResponse.json({ ok: false, error: 'Saving your bag by email is not available yet.' }, { status: 503 });

  const body = await req.json().catch(() => null);
  const email = String(body?.email || '').trim().toLowerCase();
  const items: any[] = Array.isArray(body?.items) ? body.items.slice(0, 20) : [];
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !items.length) {
    return NextResponse.json({ ok: false, error: 'Please enter a valid email address.' }, { status: 400 });
  }

  // 3 emails / hour per email, 10 / hour per IP (best effort, per instance)
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'x';
  for (const [k, limit] of [[`e:${email}`, 3], [`i:${ip}`, 10]] as [string, number][]) {
    const r = hits.get(k);
    if (r && Date.now() - r.t < 3600_000) {
      if (++r.n > limit) return NextResponse.json({ ok: false, error: 'Please try again a little later.' }, { status: 429 });
    } else hits.set(k, { n: 1, t: Date.now() });
  }

  const lines = items.map((i) => ({
    variantId: String(i.variantId || ''),
    quantity: Math.min(Math.max(parseInt(i.quantity, 10) || 1, 1), 10),
    attributes: Array.isArray(i.attributes) ? i.attributes.slice(0, 6) : [],
  }));
  const code = typeof body.couponCode === 'string' ? body.couponCode : undefined;
  const quote = await quoteShopifyCart(lines, code, email);
  if (!quote.cartId || !quote.checkoutUrl) return NextResponse.json({ ok: false, error: 'We could not save your bag. Please try again.' }, { status: 502 });

  if (body.optIn === true) await subscribeEmail(email, 'inner-circle').catch(() => {});

  const link = `${SITE_URL}/bag/restore?c=${Buffer.from(quote.cartId).toString('base64url')}`;
  const rows = items
    .map((i) => {
      const extra = (Array.isArray(i.attributes) ? i.attributes : []).filter((a: any) => a?.key && !String(a.key).startsWith('_'))
        .map((a: any) => `${esc(a.key)}: ${esc(a.value)}`).join(' · ');
      return `<tr><td style="padding:14px 0;border-bottom:1px solid #e8e0d4;font-family:Georgia,serif;font-size:17px;color:#050608">${esc(i.title)}<br><span style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a7a60">${esc(i.size)} · Qty ${esc(Math.max(parseInt(i.quantity, 10) || 1, 1))}${extra ? `<br>${extra}` : ''}</span></td></tr>`;
    })
    .join('');
  const total = formatPrice(quote.total, quote.currency);

  const html = `<div style="background:#F7F4EF;padding:32px 12px"><table align="center" width="560" style="max-width:560px;background:#fff;border-collapse:collapse"><tr><td style="background:#050608;color:#E4D3B4;text-align:center;padding:28px;font-family:Georgia,serif;font-size:22px;letter-spacing:6px;text-transform:uppercase">MyFirstNight</td></tr><tr><td style="padding:36px 32px"><p style="font-family:Georgia,serif;font-size:26px;color:#050608;margin:0 0 12px">Your bag is waiting.</p><p style="font-family:Arial,sans-serif;font-size:13px;line-height:1.7;color:#555;margin:0 0 20px">You asked us to keep these pieces safe. Pick up exactly where you left off.</p><table width="100%" style="border-collapse:collapse">${rows}</table><p style="font-family:Georgia,serif;font-size:18px;color:#050608;margin:20px 0">Total: ${esc(total)}</p><a href="${esc(link)}" style="display:inline-block;background:#050608;color:#F7F4EF;text-decoration:none;font-family:Arial,sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;padding:16px 32px">Return to my bag</a><p style="font-family:Arial,sans-serif;font-size:11px;color:#999;margin:28px 0 0;line-height:1.6">Delivered in discreet, unbranded packaging. You received this because this address was entered on myfirstnight.in. If that wasn’t you, ignore this email. Questions: ${esc(BRAND.email)}</p></td></tr></table></div>`;
  const text = `Your bag is waiting.\n\n${items.map((i) => `- ${i.title} (${i.size}) x${i.quantity}`).join('\n')}\n\nTotal: ${total}\nReturn to your bag: ${link}\n\nIf this wasn't you, ignore this email.`;

  const sent = await sendEmail({ to: email, subject: 'Your MyFirstNight bag, saved', html, text });
  if (!sent) return NextResponse.json({ ok: false, error: 'We could not send the email. Please try again.' }, { status: 502 });
  return NextResponse.json({ ok: true });
}
