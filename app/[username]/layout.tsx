import type { Metadata } from 'next';
import React from 'react';

interface UsernameLayoutProps {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const username = resolvedParams.username?.toLowerCase() || 'creator';
  const cleanHandle = username.replace(/[^a-z0-9_-]/g, '');

  const title = `@${cleanHandle} | Tapping Link in Bio & Digital Contact Card`;
  const description = `Connect with @${cleanHandle} on Tapping. Explore official bio links, curated product collections, direct vCard phonebook download, and permanent vector QR code.`;
  const canonicalUrl = `https://tapping.bio/${cleanHandle}`;

  return {
    title,
    description,
    keywords: [
      `${cleanHandle} bio link`,
      `${cleanHandle} tapping`,
      `${cleanHandle} contact card`,
      `${cleanHandle} vCard`,
      'Link in bio India',
      'Contactless business card',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'profile',
      title,
      description,
      url: canonicalUrl,
      siteName: 'Tapping',
      locale: 'en_IN',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&auto=format&fit=crop&q=80',
          width: 1200,
          height: 630,
          alt: `@${cleanHandle} on Tapping Bio`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@tappingbio',
      images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&auto=format&fit=crop&q=80'],
    },
  };
}

export default async function UsernameLayout({
  children,
  params,
}: UsernameLayoutProps) {
  const resolvedParams = await params;
  const username = resolvedParams.username?.toLowerCase() || 'creator';
  const cleanHandle = username.replace(/[^a-z0-9_-]/g, '');

  const profileJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `https://tapping.bio/${cleanHandle}#profilepage`,
    url: `https://tapping.bio/${cleanHandle}`,
    name: `@${cleanHandle} on Tapping`,
    dateCreated: '2026-01-01T00:00:00Z',
    dateModified: new Date().toISOString(),
    mainEntity: {
      '@type': 'Person',
      '@id': `https://tapping.bio/${cleanHandle}#person`,
      name: cleanHandle,
      alternateName: `@${cleanHandle}`,
      url: `https://tapping.bio/${cleanHandle}`,
      description: `Official bio link and contactless contact card for @${cleanHandle} on Tapping.`,
      sameAs: [
        `https://tapping.bio/${cleanHandle}`,
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }}
      />
      {children}
    </>
  );
}
