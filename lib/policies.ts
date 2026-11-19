import { BRAND } from './config';

export type PolicyKey = 'shipping' | 'returns' | 'privacy' | 'terms';
export type Section = { h: string; p: string[] };

// Shopify's own policies (Settings → Policies) take priority when filled in.
// These are well-structured DEFAULTS — have them reviewed against your real
// operations (and by a lawyer) before launch.
export const policies: Record<PolicyKey, { title: string; eyebrow: string; intro: string; sections: Section[] }> = {
  shipping: {
    title: 'Shipping & Discreet Delivery',
    eyebrow: 'Client Care',
    intro: 'Every order leaves our hands the way it should arrive: beautifully presented and completely private.',
    sections: [
      { h: 'Discreet packaging', p: [
        'Each piece arrives in our heavyweight presentation box, enclosed within a plain outer mailer. There is no brand name, no product description and no invoice showing prices inside the parcel.',
      ]},
      { h: 'Dispatch', p: [
        `Orders are prepared and dispatched within ${BRAND.dispatchHours} of confirmation. Personalised or monogrammed pieces may need additional time; we will tell you if that is the case.`,
        'You will receive a tracking link by email as soon as your order ships.',
      ]},
      { h: 'Delivery time & charges', p: [
        'The estimated delivery date and any shipping charge are shown at checkout once you enter your address.',
        'Remote pin codes may take longer. If a parcel is delayed beyond the estimate, write to us and we will chase it with the carrier.',
      ]},
      { h: 'Cash on delivery', p: ['If cash on delivery is available for your pin code it will appear as an option at checkout.'] },
    ],
  },
  returns: {
    title: 'Returns, Exchanges & Hygiene',
    eyebrow: 'Client Care',
    intro: 'We want you to love what you receive, and we also protect every customer’s hygiene.',
    sections: [
      { h: 'Hygiene policy', p: [
        'For hygiene reasons, intimate apparel can only be returned or exchanged if it is unworn, unwashed, and still has the hygiene seal and all original tags attached.',
      ]},
      { h: `Return window (${BRAND.returnWindowDays} days)`, p: [
        `Write to us within ${BRAND.returnWindowDays} days of delivery with your order number and a photo of the item and its packaging.`,
        'Once we approve the request we will share pick-up or return instructions.',
      ]},
      { h: 'Exchanges for size', p: ['Not sure of your size? Use our size guide or message the concierge before ordering. If an exchange is needed, we will arrange it subject to stock.'] },
      { h: 'Damaged or incorrect items', p: [
        'If something arrives damaged or is not what you ordered, contact us within 48 hours of delivery with photos and we will make it right at no cost to you.',
      ]},
      { h: 'Refunds', p: ['Approved refunds are returned to the original payment method. Banks usually take several working days to reflect them.'] },
      { h: 'Not eligible', p: ['Items that are worn, washed, altered, missing their hygiene seal or tags, as well as personalised pieces, cannot be returned unless faulty.'] },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    eyebrow: 'Legal',
    intro: 'Discretion is the core of our brand. This is how we handle your information.',
    sections: [
      { h: 'What we collect', p: [
        'Details you give us when you order or sign up: name, email, phone number, delivery address and order contents. Payment details are handled by our payment partners and are never stored on this website.',
        'Basic usage data through cookies and similar technologies, such as pages visited and device type.',
      ]},
      { h: 'How we use it', p: [
        'To process and deliver your orders, provide support, send order updates, and, if you opt in, send private offers and new-collection news. You can unsubscribe at any time.',
      ]},
      { h: 'Who we share it with', p: [
        'Only with service providers needed to run the store: our commerce platform (Shopify), payment gateways, courier partners and analytics or advertising tools such as Meta Pixel. We do not sell your personal data.',
      ]},
      { h: 'Your choices', p: [
        `You may ask to access, correct or delete your personal data by writing to ${BRAND.email}.`,
      ]},
      { h: 'Billing & parcel discretion', p: ['Statements from your bank or card may show our legal trading name. Parcels never reveal the contents.'] },
    ],
  },
  terms: {
    title: 'Terms of Service',
    eyebrow: 'Legal',
    intro: `By using this website and placing an order you agree to the terms below. ${BRAND.legalName} operates myfirstnight.in.`,
    sections: [
      { h: 'Orders & pricing', p: [
        'All prices are in Indian Rupees unless stated and include applicable taxes where shown. We may cancel an order in the event of a pricing error or stock issue and will refund any payment made.',
      ]},
      { h: 'Discount codes', p: ['Codes are single-use per order unless stated, cannot be exchanged for cash, and may exclude certain products. We may withdraw a code at any time.'] },
      { h: 'Age', p: ['Our products are intended for adults aged 18 and over.'] },
      { h: 'Intellectual property', p: ['All imagery, text, logos and designs on this site belong to us and may not be reproduced without written permission.'] },
      { h: 'Limitation of liability', p: ['To the extent permitted by law, we are not liable for indirect or consequential loss arising from use of the site or products.'] },
      { h: 'Governing law', p: ['These terms are governed by the laws of India.'] },
      { h: 'Contact', p: [`Questions about these terms: ${BRAND.email}.`] },
    ],
  },
};

export const faqs = [
  { q: 'Is the packaging really discreet?', a: 'Yes. Your presentation box travels inside a plain outer mailer with no brand name, no product description and no prices.' },
  { q: 'How do I find my size?', a: 'Use our size guide to calculate your size from two measurements, or message the concierge for a private fitting recommendation.' },
  { q: 'How long until my order ships?', a: `Orders are dispatched within ${BRAND.dispatchHours}. You will receive a tracking link by email.` },
  { q: 'Can I return or exchange an item?', a: `Unworn pieces with the hygiene seal and tags intact can be returned within ${BRAND.returnWindowDays} days of delivery. Read the full policy for details.` },
  { q: 'How do I use a discount code?', a: 'Open your bag, enter the code in the “Gift or discount code” field and press Apply. The saving is shown instantly and carried to checkout.' },
  { q: 'Can I send a gift directly to someone?', a: 'Absolutely. Enter the recipient’s address at checkout. No invoice or pricing is enclosed in the parcel.' },
  { q: 'Do you offer bridal or bulk gifting help?', a: 'Our concierge can assist with trousseau curation, bridal-party gifting and multi-recipient orders. Book from the Concierge button.' },
];
