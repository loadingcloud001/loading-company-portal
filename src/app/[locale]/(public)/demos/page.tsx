import { getTranslations, setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { DemosPageClient } from './DemosPageClient';

const placeholderDemos: { id: string; name: string; nameZh: string; slug: string; description: string; descriptionZh: string; demoType: string; url: string; thumbnail: string | null }[] = [
  {
    id: 'demo-1',
    name: 'BIM Safety Dashboard',
    nameZh: 'BIM 安全儀表板',
    slug: 'bim-dashboard',
    description: 'Interactive BIM model with real-time safety data overlay. Monitor worker locations, environmental data, and safety alerts in a 3D context.',
    descriptionZh: '互動式 BIM 模型，配備即時安全數據覆蓋。在 3D 場景中監控工人位置、環境數據及安全警報。',
    demoType: 'iframe',
    url: 'https://example.com/bim-demo',
    thumbnail: null,
  },
  {
    id: 'demo-2',
    name: 'Environmental Monitor',
    nameZh: '環境監測平台',
    slug: 'environmental-monitor',
    description: 'Real-time environmental monitoring dashboard showing air quality, noise levels, temperature, humidity, and wind speed data from on-site sensors.',
    descriptionZh: '即時環境監測儀表板，顯示來自現場感應器的空氣質素、噪音水平、溫度、濕度及風速數據。',
    demoType: 'link',
    url: 'https://example.com/env-monitor',
    thumbnail: null,
  },
  {
    id: 'demo-3',
    name: 'Mobile Safety App',
    nameZh: '流動安全應用',
    slug: 'mobile-safety-app',
    description: 'Mobile application for on-site safety management. Workers can report hazards, view alerts, and access safety documentation from their phones.',
    descriptionZh: '用於現場安全管理的流動應用。工人可以報告隱患、查看警報及從手機存取安全文件。',
    demoType: 'qrcode',
    url: 'https://example.com/mobile-app',
    thumbnail: null,
  },
];

export default async function DemosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('demos');

  // Try to fetch from DB
  let dbDemos: typeof placeholderDemos = [];
  try {
    const raw = await prisma.portalDemo.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    if (raw.length > 0) {
      dbDemos = raw.map((d) => ({
        id: d.id,
        name: d.name,
        nameZh: d.nameZh,
        slug: d.slug,
        description: d.description ?? '',
        descriptionZh: d.descriptionZh ?? '',
        demoType: d.demoType,
        url: d.url,
        thumbnail: d.thumbnail ?? null,
      }));
    }
  } catch {
    // DB not available
  }

  const demos = dbDemos.length > 0 ? dbDemos : placeholderDemos;

  const serializedDemos = demos.map((d) => ({
    id: d.id,
    name: locale === 'zh' ? d.nameZh : d.name,
    slug: d.slug,
    description: locale === 'zh' ? (d.descriptionZh || d.description || '') : (d.description || ''),
    demoType: d.demoType,
    url: d.url,
    thumbnail: d.thumbnail,
  }));

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900">
            {t('title')}
          </h1>
          <p className="mt-4 text-lg text-zinc-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <DemosPageClient demos={serializedDemos} />
      </div>
    </div>
  );
}
