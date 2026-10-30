import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://tapping.bio';

  return {
    rules: [
      // Default: all crawlers allowed except admin/api
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin',
          '/api/',
          '/_next/',
          '/dashboard?*',
        ],
      },
      // Google web + image
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: ['/admin/'],
      },
      // Bing / Microsoft
      {
        userAgent: 'bingbot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      // Apple
      {
        userAgent: 'Applebot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      // Meta / Facebook
      {
        userAgent: 'facebookexternalhit',
        allow: '/',
        disallow: ['/admin/'],
      },
      // Twitter / X
      {
        userAgent: 'Twitterbot',
        allow: '/',
        disallow: ['/admin/'],
      },
      // LinkedIn
      {
        userAgent: 'LinkedInBot',
        allow: '/',
        disallow: ['/admin/'],
      },
      // WhatsApp link previews
      {
        userAgent: 'WhatsApp',
        allow: '/',
        disallow: ['/admin/'],
      },
      // AI – OpenAI GPTBot
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/dashboard'],
      },
      // AI – OpenAI ChatGPT-User (browsing plugin)
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      // AI – Anthropic Claude
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      // AI – Perplexity
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      // AI – Google Gemini / Bard
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      // AI – Common Crawl (used by many AI training datasets)
      {
        userAgent: 'CCBot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/dashboard'],
      },
      // AI – Cohere
      {
        userAgent: 'cohere-ai',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      // AI – Meta AI
      {
        userAgent: 'meta-externalagent',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      // AI – Bytedance
      {
        userAgent: 'Bytespider',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      // DuckDuckGo
      {
        userAgent: 'DuckDuckBot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      // Yandex
      {
        userAgent: 'YandexBot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
