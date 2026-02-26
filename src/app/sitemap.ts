import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loading-company-portal-4wru2.ondigitalocean.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['zh', 'en'];
  const routes = [
    '',
    '/about',
    '/products',
    '/demos',
    '/contact',
    '/privacy',
    '/terms',
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1.0 : 0.8,
      });
    }
  }

  return entries;
}
