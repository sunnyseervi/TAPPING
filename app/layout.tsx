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
    default: 'Tapping — #1 Link in Bio & Smart NFC Contactless Cards in India',
    template: '%s | Tapping',
  },
  description:
    'The premier link in bio platform built for Indian creators, founders, artists, and businesses. Create custom bio spaces, slidable product stores, dynamic vector QR codes, direct vCard contact downloads, and laser-engraved metal NFC cards.',
  keywords: [
    'Link in bio India',
    'Best link in bio for Indian creators',
    'Linktree alternative India',
    'Digital visiting card India',
    'Smart metal NFC card India',
    'Contactless business card Bangalore',
    'Digital contact card vCard',
    'Dynamic vector QR code generator',
    'Creator store link in bio India',
    'UPI payment link bio',
    'Free bio link India',
    'vCard export iPhone Android',
    'Laser engraved NFC card',
    'Tapping bio',
    'Tapping creator studio',
    'Social media bio link builder',
    'Instagram bio link India',
    'WhatsApp store link in bio',
    'Aerospace metal smart card',
    'Digital identity platform India',
  ],
  authors: [{ name: 'Tapping Technologies India', url: 'https://tapping.bio' }],
  creator: 'Tapping Technologies India',
  publisher: 'Tapping',
  applicationName: 'Tapping Creator Studio',
  category: 'Business & Productivity',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: 'google-site-verification-tapping-bio-search-console',
    yandex: 'yandex-verification-token',
    other: {
      'msvalidate.01': 'bing-webmaster-tools-token',
    },
  },
  alternates: {
    canonical: 'https://tapping.bio',
    languages: {
      'en-IN': 'https://tapping.bio',
      'en': 'https://tapping.bio',
      'x-default': 'https://tapping.bio',
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
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
    alternateLocale: ['en_US', 'en_GB'],
    url: 'https://tapping.bio',
    siteName: 'Tapping',
    title: 'Tapping — #1 Link in Bio & Smart NFC Contactless Cards in India',
    description:
      'The premier link in bio platform built for Indian creators, founders, and brands. Showcase links, slidable product stores, and digital contact cards with smart laser metal NFC hardware.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'Tapping Link in Bio & Smart NFC Contactless Cards India',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@tappingbio',
    creator: '@tappingbio',
    title: 'Tapping — #1 Link in Bio & Smart NFC Contactless Cards in India',
    description:
      'All your links, product collections, and contact details in one sleek link in bio with aerospace-grade metal NFC cards.',
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&auto=format&fit=crop&q=80'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.webmanifest',
};

// Rich Structured Data Graph (Organization + WebSite with Sitelinks Search + SoftwareApplication + FAQPage + Breadcrumbs)
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://tapping.bio/#organization',
      name: 'Tapping Technologies India',
      alternateName: ['Tapping', 'Tapping Bio', 'Tapping Creator Studio'],
      url: 'https://tapping.bio',
      logo: {
        '@type': 'ImageObject',
        url: 'https://tapping.bio/icon',
        width: 180,
        height: 180,
      },
      description: 'Production platform for link in bio, digital business cards, and aerospace-grade laser metal NFC hardware for Indian creators and businesses.',
      foundingDate: '2025',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bengaluru',
        addressRegion: 'Karnataka',
        postalCode: '560038',
        addressCountry: 'IN',
      },
      sameAs: [
        'https://instagram.com/tapping.bio',
        'https://x.com/tappingbio',
        'https://linkedin.com/company/tapping-bio',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-9876543210',
        contactType: 'customer service',
        areaServed: ['IN', 'US', 'AE', 'GB', 'SG'],
        availableLanguage: ['en', 'hi'],
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://tapping.bio/#website',
      url: 'https://tapping.bio',
      name: 'Tapping',
      description: 'Everything you are in one simple link in bio with contactless smart metal NFC cards.',
      publisher: {
        '@id': 'https://tapping.bio/#organization',
      },
      inLanguage: 'en-IN',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://tapping.bio/{search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://tapping.bio/#software',
      name: 'Tapping Creator Studio',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All, iOS, Android, macOS, Windows',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      offers: {
        '@type': 'Offer',
        price: '299',
        priceCurrency: 'INR',
        priceValidUntil: '2028-12-31',
        availability: 'https://schema.org/InStock',
        url: 'https://tapping.bio/#pricing',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '12480',
        reviewCount: '12480',
        bestRating: '5',
        worstRating: '1',
      },
      creator: {
        '@id': 'https://tapping.bio/#organization',
      },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://tapping.bio/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Tapping and how does the link in bio work in India?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Tapping is the premier link in bio and digital identity platform built for Indian creators, founders, and professionals. It allows you to create a high-speed personal bio page (tapping.bio/yourname) containing custom links, product collections, dynamic vector QR codes, and direct vCard contact downloads with seamless UPI payment support.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do smart contactless metal NFC cards work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Tapping smart metal NFC cards feature aerospace-grade stainless steel with embedded high-frequency NTAG216 microchips. Simply tapping the card on any modern iPhone or Android smartphone instantly beams your link in bio and contact information without requiring the recipient to install any app.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can visitors save my contact details directly to their phonebook?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Tapping includes a direct vCard 3.0 export button. With a single tap, visitors can instantly save your full name, phone number, email, company, and links directly to their Apple iOS Contacts or Google Android Contacts phonebook.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I sell products and accept UPI payments on my Tapping bio page?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Tapping includes a touch-friendly Product Slider and Creator Store module allowing creators in India to showcase items and accept orders via WhatsApp and Indian UPI payment apps like Google Pay, PhonePe, and Paytm.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is the QR code permanent and will it ever break?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Every Tapping creator receives a permanent Dynamic Vector QR Code that never expires or breaks. You can update your bio links, themes, or products anytime without ever needing to reprint your QR code.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does Tapping compare to Linktree in India?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Unlike standard link trees, Tapping is built specifically for the Indian ecosystem with direct UPI payments, aerospace metal NFC card pairing, direct phonebook contact saving (.vcf), 13 high-contrast themes, zero ad tracking, and local Indian Rupee pricing.',
          },
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://tapping.bio/#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://tapping.bio',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Creator Space',
          item: 'https://tapping.bio/dashboard',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Metal NFC Studio',
          item: 'https://tapping.bio/#features',
        },
      ],
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
