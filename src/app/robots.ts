import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/constants';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || SITE.defaultUrl;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/dashboard/', '/api/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
