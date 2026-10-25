import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'TAPPING — Production-Ready Link-in-Bio, Digital vCard & Smart NFC Cards',
  description: 'The modern pastel-bento platform combining link-in-bio, digital business cards, dynamic QR codes, and laser-engraved metal NFC hardware.',
  icons: {
    icon: '/favicon.ico',
  },
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
      </head>
      <body className="bg-[#FAF7F2] text-[#1F2024] antialiased">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
