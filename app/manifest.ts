import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tapping — Link in Bio & Smart NFC Contactless Cards',
    short_name: 'Tapping',
    description: 'The #1 link in bio and smart metal NFC platform built for Indian creators, founders, and brands.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAF7F2',
    theme_color: '#FAF7F2',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/icon',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['productivity', 'business', 'utilities'],
    lang: 'en-IN',
  };
}
