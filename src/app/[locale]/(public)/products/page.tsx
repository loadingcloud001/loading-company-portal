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
    slug: 'centralised-platform',
    name: 'Centralised Management Platform',
    nameZh: '集中管理平台',
    description: 'Central platform integrating all smart site safety devices, dashboards and data analytics',
    descriptionZh: '整合所有智慧工地安全裝置的中央平台，提供儀表板及數據分析',
    icon: 'Monitor',
    sortOrder: 1,
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
        categoryId: 'cat-1',
      },
    ],
  },
  {
    id: 'cat-2',
    slug: 'equipment-tracking',
    name: 'Plant & Equipment Tracking',
    nameZh: '機械設備追蹤系統',
    description: 'Digitized tracking system for site plants, powered tools and ladders',
    descriptionZh: '工地機械、電動工具及梯子的數碼化追蹤系統',
    icon: 'Wrench',
    sortOrder: 2,
    isActive: true,
    products: [],
  },
  {
    id: 'cat-3',
    slug: 'permit-to-work',
    name: 'Digital Permit-to-Work (ePTW)',
    nameZh: '電子工作許可證系統',
    description: 'Digitalized permit-to-work system for high risk activities',
    descriptionZh: '高風險作業的數碼化工作許可證系統',
    icon: 'ClipboardCheck',
    sortOrder: 3,
    isActive: true,
    products: [],
  },
  {
    id: 'cat-4',
    slug: 'hazard-access-control',
    name: 'Hazardous Area Access Control',
    nameZh: '危險區域電子門禁',
    description: 'Electronic lock and key system for hazardous areas access control',
    descriptionZh: '以電子鎖和鑰匙系統管理危險區域出入',
    icon: 'Lock',
    sortOrder: 4,
    isActive: true,
    products: [],
  },
  {
    id: 'cat-5',
    slug: 'plant-danger-alert',
    name: 'Mobile Plant Danger Zone Alert',
    nameZh: '流動機械危險區域警報',
    description: 'Unsafe acts and dangerous situation alert for mobile plant operation danger zones',
    descriptionZh: '偵測流動機械操作危險區內的不安全行為及危險情況並發出警報',
    icon: 'AlertTriangle',
    sortOrder: 5,
    isActive: true,
    products: [],
  },
  {
    id: 'cat-6',
    slug: 'crane-zone-alert',
    name: 'Crane Lifting Zone Alert',
    nameZh: '塔式起重機吊運區域警報',
    description: 'Unsafe acts and dangerous situation alert for tower crane lifting zones',
    descriptionZh: '偵測塔式起重機吊運區內的不安全行為及危險情況並發出警報',
    icon: 'Construction',
    sortOrder: 6,
    isActive: true,
    products: [],
  },
  {
    id: 'cat-7',
    slug: 'worker-monitoring',
    name: 'Smart Worker Monitoring',
    nameZh: '智能工人監測裝置',
    description: 'Smart monitoring devices for workers and frontline site personnel',
    descriptionZh: '工人及前線工地人員的智能監測裝置',
    icon: 'HardHat',
    sortOrder: 7,
    isActive: true,
    products: [],
  },
  {
    id: 'cat-8',
    slug: 'ai-safety-monitoring',
    name: 'AI Safety Monitoring',
    nameZh: 'AI安全監察系統',
    description: 'Safety monitoring system using artificial intelligence for real-time hazard detection',
    descriptionZh: '運用人工智能的安全監控系統，實時偵測危險情況',
    icon: 'Camera',
    sortOrder: 8,
    isActive: true,
    products: [],
  },
  {
    id: 'cat-9',
    slug: 'confined-space',
    name: 'Confined Space Monitoring',
    nameZh: '密閉空間監測系統',
    description: 'Monitoring system for confined space safety including gas detection and air quality',
    descriptionZh: '密閉空間安全監測系統，包括氣體偵測及空氣質素監控',
    icon: 'Wind',
    sortOrder: 9,
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
