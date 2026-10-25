import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://tapping.bio'),
  title: {
    default: 'Tapping — Everything you are in one simple link in bio | India',
    template: '%s | Tapping',
  },
  description:
    'The premier link in bio platform built for Indian creators, founders, artists, and brands. Showcase links, product sliders, digital contact cards (.vcf), dynamic QR codes, and laser-engraved metal NFC cards.',
  keywords: [
    'Link in bio India',
    'Linktree alternative India',
    'Digital visiting card India',
    'Smart metal NFC card',
    'Contactless business card India',
    'Dynamic QR code generator',
    'Creator store link in bio',
    'vCard contact export',
    'Tapping bio',
  ],
  authors: [{ name: 'Tapping Technologies India', url: 'https://tapping.bio' }],
  creator: 'Tapping Technologies India',
  publisher: 'Tapping',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://tapping.bio',
    siteName: 'Tapping',
    title: 'Tapping — Everything you are in one simple link in bio',
    description:
      'The premier link in bio platform for Indian creators and founders. Connect socials, products, and contact cards with smart metal NFC hardware.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'Tapping Link in Bio & Smart NFC Hardware',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tapping — Everything you are in one simple link in bio',
    description:
      'The modern link in bio platform for Indian creators and founders. Smart links, product sliders & metal NFC cards.',
    creator: '@tappingbio',
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&auto=format&fit=crop&q=80'],
  },
  alternates: {
    canonical: 'https://tapping.bio',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://tapping.bio/#organization',
      name: 'Tapping Technologies India',
      url: 'https://tapping.bio',
      logo: 'https://tapping.bio/icon.png',
      description: 'Production platform for link in bio, digital business cards, and laser-engraved metal NFC hardware.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bengaluru',
        addressRegion: 'Karnataka',
        addressCountry: 'IN',
      },
    },
    {
      '@type': 'WebApplication',
      '@id': 'https://tapping.bio/#webapp',
      name: 'Tapping Link in Bio & NFC Platform',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      offers: {
        '@type': 'Offer',
        price: '299',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
      },
      creator: {
        '@id': 'https://tapping.bio/#organization',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Alfa+Slab+One&family=Anton&family=Audiowide&family=Bangers&family=Bebas+Neue&family=Black+Ops+One&family=Bodoni+Moda:ital,wght@0,600;1,400&family=Bungee&family=Caveat:wght@600&family=Chakra+Petch:wght@600&family=Cinzel:wght@600;700;800&family=Cinzel+Decorative:wght@700&family=Cormorant+Garamond:ital,wght@0,600;1,600&family=Dancing+Script:wght@700&family=Dela+Gothic+One&family=Electrolize&family=Fredoka:wght@400;600;700&family=Fugaz+One&family=Great+Vibes&family=Knewave&family=Major+Mono+Display&family=Michroma&family=Monoton&family=Montserrat:wght@400;700;800;900&family=Orbitron:wght@600;800;900&family=Oxanium:wght@600;700&family=Pacifico&family=Permanent+Marker&family=Pixelify+Sans:wght@600&family=Playfair+Display:ital,wght@0,600;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=Press+Start+2P&family=Righteous&family=Rubik+Mono+One&family=Russo+One&family=Satisfy&family=Shrikhand&family=Silkscreen:wght@400;700&family=Space+Grotesk:wght@600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Staatliches&family=Syne:wght@600;700;800&family=Teko:wght@600;700&family=Titan+One&family=Unbounded:wght@600;700;800&family=VT323&family=Zen+Dots&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#FAF7F2] text-[#141518] antialiased">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
