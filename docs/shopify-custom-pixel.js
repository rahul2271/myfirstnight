/**
 * PURCHASE TRACKING (runs on Shopify's checkout, which your headless site can't see).
 *
 * Shopify Admin → Settings → Customer events → Add custom pixel → paste this file.
 * Replace the two IDs below, save, then click "Connect".
 * Test with: GA4 → Admin → DebugView, and Meta → Events Manager → Test events.
 *
 * Note: if you ALSO use Shopify's "Google & YouTube" or "Facebook & Instagram" sales
 * channels with purchase tracking enabled, remove the duplicate there (or here).
 */
const GA_ID = 'G-XXXXXXXXXX';
const META_PIXEL_ID = '1945241539454796';

// --- GA4 ---
const gs = document.createElement('script');
gs.async = true;
gs.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
document.head.appendChild(gs);
window.dataLayer = window.dataLayer || [];
window.gtag = function () { window.dataLayer.push(arguments); };
gtag('js', new Date());
gtag('config', GA_ID, { send_page_view: false });

// --- Meta Pixel ---
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', META_PIXEL_ID);

const num = (gid) => String(gid || '').split('/').pop();

analytics.subscribe('checkout_started', (event) => {
  const c = event.data.checkout;
  gtag('event', 'begin_checkout', { currency: c.currencyCode, value: c.totalPrice.amount });
});

analytics.subscribe('payment_info_submitted', (event) => {
  const c = event.data.checkout;
  gtag('event', 'add_payment_info', { currency: c.currencyCode, value: c.totalPrice.amount });
  fbq('track', 'AddPaymentInfo', { currency: c.currencyCode, value: c.totalPrice.amount });
});

analytics.subscribe('checkout_completed', (event) => {
  const c = event.data.checkout;
  const orderId = (c.order && c.order.id) || c.token;
  const items = c.lineItems.map((li) => ({
    item_id: num(li.variant && li.variant.product && li.variant.product.id),
    item_name: li.title,
    price: li.variant && li.variant.price && li.variant.price.amount,
    quantity: li.quantity,
  }));

  gtag('event', 'purchase', {
    transaction_id: orderId,
    currency: c.currencyCode,
    value: c.totalPrice.amount,
    shipping: c.shippingLine && c.shippingLine.price ? c.shippingLine.price.amount : 0,
    items,
  });

  fbq('track', 'Purchase', {
    currency: c.currencyCode,
    value: c.totalPrice.amount,
    content_type: 'product',
    content_ids: items.map((i) => i.item_id),
    num_items: items.reduce((a, i) => a + i.quantity, 0),
  }, { eventID: String(orderId) });
});
