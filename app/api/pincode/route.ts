import { NextResponse } from 'next/server';
import { BRAND } from '../../../lib/config';

// Pincode serviceability + COD + delivery estimate.
//  - City/state: India Post public API (free, no key).
//  - Serviceability, COD and ETA: Shiprocket (set SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD, SHIPROCKET_PICKUP_PINCODE).
// Without Shiprocket we only confirm the pincode exists and never claim COD/serviceability.

let tokenCache: { token: string; at: number } | null = null;
const hits = new Map<string, { n: number; t: number }>();

async function shiprocketToken(force = false) {
  if (!force && tokenCache && Date.now() - tokenCache.at < 8 * 24 * 3600 * 1000) return tokenCache.token;
  const res = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.SHIPROCKET_EMAIL, password: process.env.SHIPROCKET_PASSWORD }),
    cache: 'no-store',
  });
  const j = await res.json();
  if (!j?.token) throw new Error('Shiprocket login failed');
  tokenCache = { token: j.token, at: Date.now() };
  return j.token as string;
}

async function serviceability(pin: string, retry = true): Promise<any> {
  const token = await shiprocketToken(!retry);
  const url = `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=${process.env.SHIPROCKET_PICKUP_PINCODE}&delivery_postcode=${pin}&cod=0&weight=${process.env.SHIPROCKET_DEFAULT_WEIGHT || '0.5'}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
  if (res.status === 401 && retry) return serviceability(pin, false);
  return { status: res.status, json: await res.json().catch(() => ({})) };
}

const addDays = (d: number) => {
  const x = new Date();
  x.setDate(x.getDate() + d);
  return x.toISOString();
};

export async function GET(req: Request) {
  const pin = new URL(req.url).searchParams.get('pin') || '';
  if (!/^[1-9][0-9]{5}$/.test(pin)) return NextResponse.json({ ok: false, error: 'Enter a valid 6-digit pincode.' }, { status: 400 });

  // best-effort rate limit (per instance)
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'x';
  const now = Date.now();
  const rec = hits.get(ip);
  if (rec && now - rec.t < 60_000) {
    if (++rec.n > 20) return NextResponse.json({ ok: false, error: 'Too many requests. Please try again shortly.' }, { status: 429 });
  } else hits.set(ip, { n: 1, t: now });

  // 1) City / state
  let city = '', state = '', validPin: boolean | null = null;
  try {
    const r = await fetch(`https://api.postalpincode.in/pincode/${pin}`, { signal: AbortSignal.timeout(4000), next: { revalidate: 86400 } });
    const j = await r.json();
    if (j?.[0]?.Status === 'Success' && j[0].PostOffice?.length) {
      validPin = true;
      city = j[0].PostOffice[0].District;
      state = j[0].PostOffice[0].State;
    } else if (j?.[0]?.Status === 'Error') validPin = false;
  } catch {}

  if (validPin === false) return NextResponse.json({ ok: false, error: 'We could not find that pincode. Please check and try again.' }, { status: 404 });

  // 2) Courier serviceability (optional)
  const base = { ok: true, pin, city, state, serviceable: null as boolean | null, cod: null as boolean | null, etaFrom: null as string | null, etaTo: null as string | null };
  if (!process.env.SHIPROCKET_EMAIL || !process.env.SHIPROCKET_PASSWORD || !process.env.SHIPROCKET_PICKUP_PINCODE) return NextResponse.json(base);

  try {
    const { status, json } = await serviceability(pin);
    const couriers: any[] = json?.data?.available_courier_companies || [];
    if (!couriers.length) {
      const unserviceable = status === 404 || /serviceab/i.test(String(json?.message || ''));
      return NextResponse.json({ ...base, serviceable: unserviceable ? false : null });
    }
    const days = couriers.map((c) => parseInt(c.estimated_delivery_days, 10)).filter((n) => !isNaN(n));
    const min = Math.min(...days);
    const rec = couriers.find((c) => c.courier_company_id === json?.data?.recommended_courier_company_id);
    const max = Math.max(parseInt(rec?.estimated_delivery_days, 10) || min, min + 1);
    return NextResponse.json({
      ...base,
      serviceable: true,
      cod: couriers.some((c) => c.cod === 1 || c.cod === true),
      etaFrom: addDays(BRAND.dispatchDays + min),
      etaTo: addDays(BRAND.dispatchDays + max),
    });
  } catch (e) {
    console.error('Pincode check failed:', e);
    return NextResponse.json(base);
  }
}
