'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight, Star, Package } from 'lucide-react';

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
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900">
            {t('title')}
          </h1>
        </div>

        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer ${
              activeCategory === null
                ? 'bg-primary text-white'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            {t('allCategories')}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer ${
                activeCategory === cat.slug
                  ? 'bg-primary text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <Package className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
            <p className="text-zinc-500">{tc('noResults')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-xl border border-zinc-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
              >
                {/* Product image placeholder */}
                <div className="relative h-48 bg-gradient-to-br from-zinc-100 to-zinc-50 flex items-center justify-center">
                  {product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="h-16 w-16 text-zinc-300" />
                  )}
                  {product.isFeatured && (
                    <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 bg-secondary text-white text-xs font-semibold rounded-full">
                      <Star className="h-3 w-3" />
                      {t('featured')}
                    </span>
                  )}
                </div>

                {/* Product details */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="text-xs font-medium text-primary mb-1.5">
                    {product.categoryName}
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-zinc-600 leading-relaxed mb-4 flex-1">
                    {product.shortDesc}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100">
                    {product.basePrice ? (
                      <div className="text-sm">
                        <span className="font-semibold text-zinc-900">
                          {tc('hkd')} {product.basePrice.toLocaleString()}
                        </span>
                        <span className="text-zinc-500 ml-1">
                          / {pricingLabel(product.pricingModel)}
                        </span>
                      </div>
                    ) : (
                      <div className="text-sm text-zinc-500">{t('requestQuote')}</div>
                    )}
                    <Link
                      href={`/products/${product.slug}` as any}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                    >
                      {t('viewDetails')}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
