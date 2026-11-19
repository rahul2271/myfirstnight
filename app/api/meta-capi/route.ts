import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { META_PIXEL_ID } from '../../../lib/config';

// Server-side Meta Conversions API (deduplicated with the browser pixel by event_id).
// Env: META_CAPI_ACCESS_TOKEN (Events Manager → Settings → Conversions API), optional META_TEST_EVENT_CODE.
const ALLOWED = new Set(['PageView', 'ViewContent', 'AddToCart', 'InitiateCheckout', 'Search', 'Lead']);

export async function POST(req: Request) {
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!token) return NextResponse.json({ ok: false }, { status: 204 });

  const body = await req.json().catch(() => null);
  if (!body || !ALLOWED.has(body.event_name)) return NextResponse.json({ ok: false }, { status: 400 });

  const h = headers();
  const c = cookies();
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim();

  const payload: any = {
    data: [
      {
        event_name: body.event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: String(body.event_id || ''),
        event_source_url: String(body.event_source_url || ''),
        action_source: 'website',
        user_data: {
          client_ip_address: ip,
          client_user_agent: h.get('user-agent') || undefined,
          fbp: c.get('_fbp')?.value,
          fbc: c.get('_fbc')?.value,
        },
        custom_data: body.custom_data || {},
      },
    ],
  };
  if (process.env.META_TEST_EVENT_CODE) payload.test_event_code = process.env.META_TEST_EVENT_CODE;

  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${META_PIXEL_ID}/events?access_token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });
    return NextResponse.json({ ok: res.ok });
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
