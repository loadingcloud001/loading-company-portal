import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface ProductCategory {
  name: string;
  nameZh: string;
  icon: string | null;
}

interface Product {
  id: string;
  name: string;
  nameZh: string;
  slug: string;
  shortDesc: string | null;
  shortDescZh: string | null;
  images: string[];
  basePrice: number | null;
  pricingModel: string;
  isFeatured: boolean;
  category: ProductCategory;
}

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const locale = useLocale();
  const t = useTranslations('products');
  const tCommon = useTranslations('common');

  const isZh = locale === 'zh';
  const name = isZh ? product.nameZh : product.name;
  const shortDesc = isZh
    ? product.shortDescZh || product.shortDesc
    : product.shortDesc || product.shortDescZh;
  const categoryName = isZh
    ? product.category.nameZh
    : product.category.name;

  const formatPrice = (price: number | null) => {
    if (price === null) return null;
    return `${tCommon('hkd')} ${price.toLocaleString()}`;
  };

  const pricingSuffix = () => {
    switch (product.pricingModel) {
      case 'per_unit':
        return t('perUnit');
      case 'per_site':
        return t('perSite');
      case 'per_month':
        return t('perMonth');
      default:
        return '';
    }
  };

  return (
    <Link
      href={`/products/${product.slug}` as `/products/${string}`}
      className="group block bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden hover:shadow-lg hover:border-zinc-300 transition-all duration-200"
    >
      {/* Image area */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 flex items-center justify-center">
            <span className="text-4xl">{product.category.icon || '📦'}</span>
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="info">{categoryName}</Badge>
        </div>

        {/* Featured badge */}
        {product.isFeatured && (
          <div className="absolute top-3 right-3">
            <Badge variant="warning">{t('featured')}</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-base font-semibold text-zinc-900 group-hover:text-primary transition-colors duration-150 line-clamp-1">
          {name}
        </h3>

        {shortDesc && (
          <p className="mt-1.5 text-sm text-zinc-500 line-clamp-2 leading-relaxed">
            {shortDesc}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between">
          {product.basePrice !== null ? (
            <div className="text-sm">
              <span className="font-semibold text-zinc-900">
                {formatPrice(product.basePrice)}
              </span>
              {pricingSuffix() && (
                <span className="text-zinc-400 ml-1">/ {pricingSuffix()}</span>
              )}
            </div>
          ) : (
            <div />
          )}

          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all duration-150">
            {t('viewDetails')}
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export { ProductCard };
export type { Product, ProductCategory };
