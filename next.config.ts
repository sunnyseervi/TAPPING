import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,

  // ─── Image Optimization ─────────────────────────────────────────────────────
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400, // 24h cache for optimized images
    dangerouslyAllowSVG: false,
  },

  // ─── Compression ─────────────────────────────────────────────────────────────
  compress: true,

  // ─── Aggressive HTTP Caching Headers ─────────────────────────────────────────
  async headers() {
    return [
      {
        // Static assets: 1 year immutable
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Optimized images: 24h
        source: "/_next/image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=3600",
          },
        ],
      },
      {
        // Public assets: 7 days
        source: "/:path((?!_next).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
          // Security headers
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        // API routes: no cache
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache",
          },
        ],
      },
    ];
  },

  // ─── Redirects ────────────────────────────────────────────────────────────────
  async redirects() {
    return [
      // Redirect www → apex
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.tapping.bio" }],
        destination: "https://tapping.bio/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
