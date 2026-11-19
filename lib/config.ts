export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://myfirstnight.in';

// Digits only, with country code, e.g. 919876543210
export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').replace(/\D/g, '');

export function whatsappLink(message = 'Hello MyFirstNight, I would like a private consultation.') {
  const text = encodeURIComponent(message);
  return WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}?text=${text}` : '';
}

export const BRAND = {
  name: 'MyFirstNight',
  legalName: process.env.NEXT_PUBLIC_LEGAL_NAME || 'MyFirstNight',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'care@myfirstnight.in',
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '',
  // Edit these once; they flow into the policy + FAQ pages.
  dispatchHours: '24–48 hours',
  dispatchDays: 2, // used for delivery-date estimates
  returnWindowDays: 7,
};

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1945241539454796';
export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';
