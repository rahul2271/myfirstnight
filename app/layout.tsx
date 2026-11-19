import type { Metadata } from 'next'
import { Inter, Cormorant_Garamond } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { Analytics } from '../components/Analytics'
import { ConsentBanner } from '../components/ConsentBanner'
import { SITE_URL } from '@/lib/config'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CartProviderWrapper } from '@/components/CartProviderWrapper' // Client wrapper for cart state
import { ConciergeProvider, ConciergeModal } from '@/components/ConciergeModal' // Client wrapper for white-glove booking

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'MyFirstNight | Luxury Intimates & Bridal Trousseau',
    template: '%s | MyFirstNight',
  },
  description:
    'Luxury intimates, mulberry silk and French lace bridal trousseaus, delivered in discreet, unbranded packaging across India.',
  keywords: ['luxury lingerie India', 'bridal lingerie', 'bridal trousseau', 'honeymoon lingerie', 'silk nightwear', 'wedding night gifts'],
  openGraph: {
    type: 'website',
    siteName: 'MyFirstNight',
    title: 'MyFirstNight | Luxury Intimates & Bridal Trousseau',
    description: 'Mulberry silk, French lace and absolute discretion.',
    images: ['/home-banner.png'],
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-mfn-silk text-mfn-midnight selection:bg-mfn-nude selection:text-mfn-midnight">

        {/* Concierge & Cart Providers Wrapping Layout */}
        <ConciergeProvider>
          <CartProviderWrapper>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <ConciergeModal />
            <Analytics />
            <ConsentBanner />
          </CartProviderWrapper>
        </ConciergeProvider>
      </body>
    </html>
  )
}