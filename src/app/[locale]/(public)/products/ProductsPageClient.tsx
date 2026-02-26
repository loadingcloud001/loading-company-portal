'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { ArrowRight, Package } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface Category {
  id: string;
  slug: string;
  name: string;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  shortDesc: string;
  images: string[];
  basePrice: number | null;
  pricingModel: string;
  isFeatured: boolean;
  categorySlug: string;
  categoryName: string;
}

export function ProductsPageClient({
  categories,
  products,
}: {
  categories: Category[];
  products: Product[];
}) {
  const t = useTranslations('products');
  const tc = useTranslations('common');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredProducts = activeCategory
    ? products.filter((p) => p.categorySlug === activeCategory)
    : products;

  const pricingLabel = (model: string) => {
    switch (model) {
      case 'unit':
        return t('perUnit');
      case 'site':
        return t('perSite');
      case 'month':
        return t('perMonth');
      default:
        return '';
    }
  };

  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-2 mb-12">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer',
              activeCategory === null
                ? 'bg-[#1e40af] text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            )}
          >
            {t('allCategories')}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={cn(
                'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer',
                activeCategory === cat.slug
                  ? 'bg-[#1e40af] text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">{tc('noResults')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}` as never}
                className="group rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Image placeholder */}
                <div className="relative h-52 bg-slate-100 flex items-center justify-center">
                  <Package className="h-16 w-16 text-slate-300 group-hover:text-[#1e40af]/40 transition-colors duration-300" />
                  {product.isFeatured && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="info">{t('featured')}</Badge>
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-xs font-semibold text-[#1e40af] uppercase tracking-wider mb-2">
                    {product.categoryName}
                  </p>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-[#1e40af] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1 line-clamp-3">
                    {product.shortDesc}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                    {product.basePrice ? (
                      <div className="text-sm">
                        <span className="font-bold text-slate-900">
                          {tc('hkd')} {product.basePrice.toLocaleString()}
                        </span>
                        <span className="text-slate-500 ml-1">
                          / {pricingLabel(product.pricingModel)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-500">{t('requestQuote')}</span>
                    )}
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-[#1e40af] group-hover:gap-2 transition-all">
                      {t('viewDetails')}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
