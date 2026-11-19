// Consent-aware tracking for GA4 + Meta Pixel (+ Meta Conversions API via /api/meta-capi).
// Nothing fires until the visitor accepts the cookie banner.
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export type TrackItem = { id: string; name: string; price?: number; quantity?: number; variant?: string };
export type TrackEvent = 'view_item' | 'add_to_cart' | 'begin_checkout' | 'search' | 'lead';

export const CONSENT_KEY = 'mfn-consent';
const META_NAME: Record<TrackEvent, string> = {
  view_item: 'ViewContent',
  add_to_cart: 'AddToCart',
  begin_checkout: 'InitiateCheckout',
  search: 'Search',
  lead: 'Lead',
};
const GA_NAME: Record<TrackEvent, string> = {
  view_item: 'view_item',
  add_to_cart: 'add_to_cart',
  begin_checkout: 'begin_checkout',
  search: 'search',
  lead: 'generate_lead',
};

export const numericId = (gid?: string) => (gid || '').split('/').pop() || '';
const uid = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

export function hasConsent() {
  try { return localStorage.getItem(CONSENT_KEY) === 'granted'; } catch { return false; }
}

export function sendCapi(event_name: string, event_id: string, custom_data: any = {}) {
  if (process.env.NEXT_PUBLIC_META_CAPI !== 'true') return;
  try {
    fetch('/api/meta-capi', {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_name, event_id, event_source_url: window.location.href, custom_data }),
    });
  } catch {}
}

export function track(
  event: TrackEvent,
  p: { items?: TrackItem[]; value?: number; currency?: string; searchTerm?: string } = {}
) {
  if (typeof window === 'undefined' || !hasConsent()) return;
  const currency = p.currency || 'INR';
  const items = p.items || [];
  const value = p.value ?? items.reduce((a, i) => a + (i.price || 0) * (i.quantity || 1), 0);
  const eventId = uid();

  window.gtag?.('event', GA_NAME[event], {
    currency,
    value,
    search_term: p.searchTerm,
    items: items.map((i) => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.quantity || 1, item_variant: i.variant })),
  });

  const metaData: any = {
    currency,
    value,
    content_type: 'product',
    content_ids: items.map((i) => i.id),
    contents: items.map((i) => ({ id: i.id, quantity: i.quantity || 1, item_price: i.price })),
    num_items: items.reduce((a, i) => a + (i.quantity || 1), 0),
    search_string: p.searchTerm,
  };
  window.fbq?.('track', META_NAME[event], metaData, { eventID: eventId });
  sendCapi(META_NAME[event], eventId, metaData);
}
