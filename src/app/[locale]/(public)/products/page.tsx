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
}
interface PlaceholderCategory {
  id: string; slug: string; name: string; nameZh: string;
  description: string; descriptionZh: string; icon: string;
  sortOrder: number; isActive: boolean; products: PlaceholderProduct[];
}
const placeholderCategories: PlaceholderCategory[] = [
  {
    id: 'cat-1',
    slug: 'smart-helmet',
    name: 'Smart Helmet System',
    nameZh: '智能安全帽系統',
    description: 'Worker health monitoring, fall detection, GPS tracking',
    descriptionZh: '工人健康監測、跌倒偵測、GPS 定位追蹤',
    icon: 'ShieldCheck',
    sortOrder: 1,
    isActive: true,
    products: [
      {
        id: 'prod-1',
        slug: 'smart-helmet-pro',
        name: 'Smart Helmet Pro',
        nameZh: '智能安全帽 Pro',
        shortDesc: 'Advanced worker safety helmet with real-time health monitoring, SOS alerts, and GPS tracking.',
        shortDescZh: '先進工人安全帽，配備即時健康監測、SOS 警報及 GPS 追蹤。',
        images: [],
        basePrice: 2500,
        pricingModel: 'unit',
        isFeatured: true,
        categoryId: 'cat-1',
      },
    ],
  },
  {
    id: 'cat-2',
    slug: 'proximity-alert',
    name: 'Proximity Alert System',
    nameZh: '接近警報系統',
    description: 'UWB/RFID collision prevention between workers and plant',
    descriptionZh: 'UWB/RFID 防撞系統，防止工人與機械碰撞',
    icon: 'Radio',
    sortOrder: 2,
    isActive: true,
    products: [
      {
        id: 'prod-2',
        slug: 'uwb-proximity-sensor',
        name: 'UWB Proximity Sensor Kit',
        nameZh: 'UWB 接近感應器套裝',
        shortDesc: 'Ultra-wideband proximity detection system for plant and personnel collision avoidance.',
        shortDescZh: '超寬帶接近偵測系統，用於機械與人員防碰撞。',
        images: [],
        basePrice: 8000,
        pricingModel: 'site',
        isFeatured: false,
        categoryId: 'cat-2',
      },
    ],
  },
  {
    id: 'cat-3',
    slug: 'environmental-monitoring',
    name: 'Environmental Monitoring',
    nameZh: '環境監測系統',
    description: 'Air quality, noise, gas detection, weather stations',
    descriptionZh: '空氣質素、噪音、氣體偵測、氣象站',
    icon: 'Thermometer',
    sortOrder: 3,
    isActive: true,
    products: [
      {
        id: 'prod-3',
        slug: 'env-monitor-station',
        name: 'Environmental Monitor Station',
        nameZh: '環境監測站',
        shortDesc: 'All-in-one environmental monitoring: air quality, noise, temperature, humidity, wind.',
        shortDescZh: '一體式環境監測：空氣質素、噪音、溫度、濕度、風速。',
        images: [],
        basePrice: 15000,
        pricingModel: 'site',
        isFeatured: true,
        categoryId: 'cat-3',
      },
    ],
  },
  {
    id: 'cat-4',
    slug: 'ai-surveillance',
    name: 'AI Video Surveillance',
    nameZh: 'AI 視像監控',
    description: 'CCTV with AI for PPE detection, unsafe behavior alerts',
    descriptionZh: '配備 AI 的閉路電視，偵測個人防護裝備及不安全行為',
    icon: 'Camera',
    sortOrder: 4,
    isActive: true,
    products: [
      {
        id: 'prod-4',
        slug: 'ai-camera-system',
        name: 'AI Camera System',
        nameZh: 'AI 攝像系統',
        shortDesc: 'Intelligent video surveillance with real-time PPE detection, zone intrusion, and behavior analysis.',
        shortDescZh: '智能視頻監控系統，具備即時 PPE 偵測、區域入侵及行為分析。',
        images: [],
        basePrice: 12000,
        pricingModel: 'unit',
        isFeatured: true,
        categoryId: 'cat-4',
      },
    ],
  },
  {
    id: 'cat-5',
    slug: 'access-control',
    name: 'Site Access Control',
    nameZh: '工地出入管理',
    description: 'Facial recognition, RFID cards, biometric turnstiles',
    descriptionZh: '人臉辨識、RFID 卡、生物識別閘機',
    icon: 'Fingerprint',
    sortOrder: 5,
    isActive: true,
    products: [
      {
        id: 'prod-5',
        slug: 'biometric-turnstile',
        name: 'Biometric Turnstile System',
        nameZh: '生物識別閘機系統',
        shortDesc: 'Multi-factor access control with facial recognition and RFID for construction sites.',
        shortDescZh: '多重驗證門禁系統，配備人臉辨識及 RFID。',
        images: [],
        basePrice: 20000,
        pricingModel: 'unit',
        isFeatured: false,
        categoryId: 'cat-5',
      },
    ],
  },
  {
    id: 'cat-6',
    slug: 'lifting-operations',
    name: 'Lifting Operations Monitoring',
    nameZh: '起重作業監測',
    description: 'Crane load/angle/wind sensors, anti-collision',
    descriptionZh: '吊機負載/角度/風速感應器、防碰撞系統',
    icon: 'Construction',
    sortOrder: 6,
    isActive: true,
    products: [
      {
        id: 'prod-6',
        slug: 'crane-monitoring-kit',
        name: 'Crane Monitoring Kit',
        nameZh: '吊機監測套裝',
        shortDesc: 'Comprehensive crane safety monitoring: load cell, wind gauge, angle sensor, anti-collision.',
        shortDescZh: '全面吊機安全監測：負載感應、風速計、角度感應器、防碰撞。',
        images: [],
        basePrice: 35000,
        pricingModel: 'unit',
        isFeatured: false,
        categoryId: 'cat-6',
      },
    ],
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
