import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'products' });
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}
import { ProductsPageClient } from './ProductsPageClient';

// Static placeholder data for when the DB is empty
interface PlaceholderProduct {
  id: string; slug: string; name: string; nameZh: string;
  shortDesc: string; shortDescZh: string; images: string[];
  basePrice: number | null; pricingModel: string;
  isFeatured: boolean; categoryId: string;
  demoUrl?: string | null; demoType?: string | null;
}
interface PlaceholderCategory {
  id: string; slug: string; name: string; nameZh: string;
  description: string; descriptionZh: string; icon: string;
  sortOrder: number; isActive: boolean; products: PlaceholderProduct[];
}
const placeholderCategories: PlaceholderCategory[] = [
  {
    id: 'cat-1',
    slug: 'ai-monitoring',
    name: 'AI Safety Monitoring',
    nameZh: 'AI安全監察系統',
    description: 'AI-powered CCTV for PPE detection, hazard alerts and behavior monitoring',
    descriptionZh: 'AI驅動的閉路電視，用於個人防護裝備偵測、危險警報及行為監控',
    icon: 'Camera',
    sortOrder: 1,
    isActive: true,
    products: [],
  },
  {
    id: 'cat-2',
    slug: 'smart-wearables',
    name: 'Smart Wearable Devices',
    nameZh: '智能穿戴裝置',
    description: 'Smart helmets and wristbands with sensors for worker safety',
    descriptionZh: '配備感應器的智能安全帽和手環，保障工人安全',
    icon: 'ShieldCheck',
    sortOrder: 2,
    isActive: true,
    products: [],
  },
  {
    id: 'cat-3',
    slug: 'proximity-alert',
    name: 'Proximity Alert System',
    nameZh: '接近警報系統',
    description: 'UWB/RFID anti-collision detection between workers and machinery',
    descriptionZh: 'UWB/RFID防碰撞偵測系統，防止工人與機械碰撞',
    icon: 'Radio',
    sortOrder: 3,
    isActive: true,
    products: [],
  },
  {
    id: 'cat-4',
    slug: 'environmental-monitoring',
    name: 'Environmental Monitoring',
    nameZh: '環境監測系統',
    description: 'IoT sensors for air quality, noise, weather and gas detection',
    descriptionZh: '用於空氣質素、噪音、天氣及氣體偵測的IoT感應器',
    icon: 'Thermometer',
    sortOrder: 4,
    isActive: true,
    products: [],
  },
  {
    id: 'cat-5',
    slug: 'digital-platform',
    name: 'Digital Management Platform',
    nameZh: '數碼管理平台',
    description: 'Centralised management platform, ePTW, dashboards and data analytics',
    descriptionZh: '集中管理平台、電子工作許可證、儀表板及數據分析',
    icon: 'Monitor',
    sortOrder: 5,
    isActive: true,
    products: [
      {
        id: 'prod-1',
        slug: 'cmp-platform',
        name: 'CMP — Construction Management Platform',
        nameZh: 'CMP — 建造管理平台',
        shortDesc: 'Centralised management platform for real-time site safety monitoring, data analytics, alerts, and reporting.',
        shortDescZh: '集中管理平台，提供實時工地安全監控、數據分析、警報及報告。',
        images: [],
        basePrice: 0,
        pricingModel: 'monthly',
        isFeatured: true,
        categoryId: 'cat-5',
      },
    ],
  },
  {
    id: 'cat-6',
    slug: 'access-tracking',
    name: 'Access & Equipment Tracking',
    nameZh: '出入管理及設備追蹤',
    description: 'Site access control and digitized equipment tracking systems',
    descriptionZh: '工地出入管理及數碼化設備追蹤系統',
    icon: 'Fingerprint',
    sortOrder: 6,
    isActive: true,
    products: [],
  },
];

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('products');
  const tc = await getTranslations('categories');

  // Try to fetch from DB
  let dbCategories: typeof placeholderCategories = [];
  try {
    const raw = await prisma.portalProductCategory.findMany({
      where: { isActive: true },
      include: {
        products: {
          where: { isActive: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    if (raw.length > 0) {
      dbCategories = raw.map((cat) => ({
        id: cat.id,
        slug: cat.slug,
        name: cat.name,
        nameZh: cat.nameZh,
        description: cat.description ?? '',
        descriptionZh: cat.descriptionZh ?? '',
        icon: cat.icon ?? '',
        sortOrder: cat.sortOrder,
        isActive: cat.isActive,
        products: cat.products.map((p) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          nameZh: p.nameZh,
          shortDesc: p.shortDesc ?? '',
          shortDescZh: p.shortDescZh ?? '',
          images: p.images,
          basePrice: p.basePrice ? Number(p.basePrice) : null,
          pricingModel: p.pricingModel,
          isFeatured: p.isFeatured,
          categoryId: p.categoryId,
          demoUrl: p.demoUrl ?? null,
        })),
      }));
    }
  } catch {
    // DB not available, use placeholder data
  }

  const categories = dbCategories.length > 0 ? dbCategories : placeholderCategories;

  // Flatten all products with category info
  const allProducts = categories.flatMap((cat) =>
    cat.products.map((p) => ({
      ...p,
      categorySlug: cat.slug,
      categoryName: locale === 'zh' ? cat.nameZh : cat.name,
    }))
  );

  const serializedCategories = categories.map((cat) => ({
    id: cat.id,
    slug: cat.slug,
    name: locale === 'zh' ? cat.nameZh : cat.name,
  }));

  const serializedProducts = allProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: locale === 'zh' ? p.nameZh : p.name,
    shortDesc: locale === 'zh' ? (p.shortDescZh || p.shortDesc) : (p.shortDesc || ''),
    images: p.images,
    basePrice: p.basePrice,
    pricingModel: p.pricingModel,
    isFeatured: p.isFeatured,
    categorySlug: p.categorySlug,
    categoryName: p.categoryName,
    demoUrl: p.demoUrl ?? null,
  }));

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-slate-900 text-white py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              {t('title')}
            </h1>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Product Listing */}
      <ProductsPageClient
        categories={serializedCategories}
        products={serializedProducts}
      />
    </div>
  );
}
