import { NextResponse } from 'next/server';
import { subscribeEmail } from '../../../lib/subscribe';

export async function POST(req: Request) {
  const { email } = await req.json().catch(() => ({ email: '' }));
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'Please enter a valid email address.' }, { status: 400 });
  }
  const r = await subscribeEmail(email);
  if (!r.ok) return NextResponse.json({ ok: false, error: r.error }, { status: r.status || 500 });
  return NextResponse.json({ ok: true, code: process.env.WELCOME_DISCOUNT_CODE || null });
}
