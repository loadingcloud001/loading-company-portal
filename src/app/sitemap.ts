import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/constants';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || SITE.defaultUrl;

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = [...SITE.locales];
  const routes = [
    '',
    '/about',
    '/products',
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
