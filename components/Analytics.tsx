'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { CONSENT_KEY, hasConsent, sendCapi } from '../lib/analytics';
import { GA_ID, META_PIXEL_ID } from '../lib/config';

export function Analytics() {
  const pathname = usePathname();
  const [consent, setConsent] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConsent(hasConsent());
    const sync = () => setConsent(hasConsent());
    window.addEventListener('mfn-consent', sync);
    return () => window.removeEventListener('mfn-consent', sync);
  }, []);

  // Fire a page view on first load and on every client-side navigation
  useEffect(() => {
    if (!consent || !ready) return;
    const id = `${Date.now()}-${Math.random()}`;
    window.gtag?.('event', 'page_view', { page_path: pathname, page_location: window.location.href });
    window.fbq?.('track', 'PageView', {}, { eventID: id });
    sendCapi('PageView', id);
  }, [pathname, consent, ready]);

  if (!consent) return null;

  return (
    <>
      {GA_ID && <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />}
      <Script id="mfn-tracking-init" strategy="afterInteractive" onReady={() => setReady(true)}>
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
          ${GA_ID ? `gtag('js', new Date()); gtag('config', '${GA_ID}', { send_page_view: false });` : ''}
          ${META_PIXEL_ID ? `
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');` : ''}
        `}
      </Script>
    </>
  );
}

export { CONSENT_KEY };
