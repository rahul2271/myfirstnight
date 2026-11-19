// Server-only transactional email via Resend (https://resend.com). Env: RESEND_API_KEY, RESEND_FROM.
export const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

export function emailConfigured() {
  return !!(process.env.RESEND_API_KEY && process.env.RESEND_FROM);
}

export async function sendEmail({ to, subject, html, text }: { to: string; subject: string; html: string; text: string }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: process.env.RESEND_FROM, to: [to], subject, html, text }),
    cache: 'no-store',
  });
  if (!res.ok) console.error('Resend error:', res.status, await res.text().catch(() => ''));
  return res.ok;
}
