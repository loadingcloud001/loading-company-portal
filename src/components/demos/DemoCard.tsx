import { useLocale, useTranslations } from 'next-intl';
import { Monitor, ExternalLink, QrCode } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface DemoCategory {
  name: string;
  nameZh: string;
}

interface Demo {
  id: string;
  name: string;
  nameZh: string;
  slug: string;
  description: string | null;
  descriptionZh: string | null;
  demoType: 'iframe' | 'link' | 'qrcode';
  url: string;
  thumbnail: string | null;
  category?: DemoCategory | null;
}

interface DemoCardProps {
  demo: Demo;
  onClick?: () => void;
}

const demoTypeConfig: Record<
  Demo['demoType'],
  { icon: typeof Monitor; label: string; variant: 'info' | 'success' | 'warning' }
> = {
  iframe: { icon: Monitor, label: 'Interactive', variant: 'info' },
  link: { icon: ExternalLink, label: 'External', variant: 'success' },
  qrcode: { icon: QrCode, label: 'QR Code', variant: 'warning' },
};

function DemoCard({ demo, onClick }: DemoCardProps) {
  const locale = useLocale();
  const t = useTranslations('demos');

  const isZh = locale === 'zh';
  const name = isZh ? demo.nameZh : demo.name;
  const description = isZh
    ? demo.descriptionZh || demo.description
    : demo.description || demo.descriptionZh;
  const categoryName = demo.category
    ? isZh
      ? demo.category.nameZh
      : demo.category.name
    : null;

  const typeConfig = demoTypeConfig[demo.demoType];
  const TypeIcon = typeConfig.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full text-left bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden hover:shadow-lg hover:border-zinc-300 transition-all duration-200 cursor-pointer"
    >
      {/* Thumbnail area */}
      <div className="relative aspect-video overflow-hidden">
        {demo.thumbnail ? (
          <img
            src={demo.thumbnail}
            alt={name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-900 flex items-center justify-center">
            <TypeIcon className="h-12 w-12 text-white/30" />
          </div>
        )}

        {/* Demo type badge */}
        <div className="absolute top-3 left-3">
          <Badge variant={typeConfig.variant}>
            <TypeIcon className="h-3 w-3 mr-1" />
            {typeConfig.label}
          </Badge>
        </div>

        {/* Category badge */}
        {categoryName && (
          <div className="absolute top-3 right-3">
            <Badge variant="default">{categoryName}</Badge>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-200 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white px-4 py-2 rounded-lg text-sm font-medium text-primary shadow-lg">
            {t('openDemo')}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-base font-semibold text-zinc-900 group-hover:text-primary transition-colors duration-150 line-clamp-1">
          {name}
        </h3>
        {description && (
          <p className="mt-1.5 text-sm text-zinc-500 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </button>
  );
}

export { DemoCard };
export type { Demo, DemoCategory };
