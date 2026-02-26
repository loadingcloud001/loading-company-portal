import { getTranslations, setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/Badge';
import { ChevronRight, Package, ArrowLeft } from 'lucide-react';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('products');
  const tc = await getTranslations('common');
  const tn = await getTranslations('nav');

  // Try to fetch product from DB
  let product: {
    id: string;
    name: string;
    nameZh: string;
    slug: string;
    description: string | null;
    descriptionZh: string | null;
    shortDesc: string | null;
    shortDescZh: string | null;
    specifications: Record<string, string> | null;
    images: string[];
    basePrice: number | null;
    pricingModel: string;
    hardwareList: { name: string; desc: string }[] | null;
    leadTimeDays: number | null;
    isFeatured: boolean;
    categoryId: string;
    category: {
      name: string;
      nameZh: string;
      slug: string;
    };
  } | null = null;

  try {
    const raw = await prisma.portalProduct.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (raw) {
      product = {
        id: raw.id,
        name: raw.name,
        nameZh: raw.nameZh,
        slug: raw.slug,
        description: raw.description,
        descriptionZh: raw.descriptionZh,
        shortDesc: raw.shortDesc,
        shortDescZh: raw.shortDescZh,
        specifications: raw.specifications as Record<string, string> | null,
        images: raw.images,
        basePrice: raw.basePrice ? Number(raw.basePrice) : null,
        pricingModel: raw.pricingModel,
        hardwareList: raw.hardwareList as { name: string; desc: string }[] | null,
        leadTimeDays: raw.leadTimeDays,
        isFeatured: raw.isFeatured,
        categoryId: raw.categoryId,
        category: {
          name: raw.category.name,
          nameZh: raw.category.nameZh,
          slug: raw.category.slug,
        },
      };
    }
  } catch {
    // DB not available
  }

  // If product not found, show coming soon page
  if (!product) {
    return (
      <div className="py-20 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Package className="h-16 w-16 text-slate-300 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Product details coming soon
          </h1>
          <p className="text-slate-600 mb-8">
            We are currently updating our product catalog. Please check back soon or contact us for more information.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-[#1e40af] hover:text-blue-800 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backToProducts')}
          </Link>
        </div>
      </div>
    );
  }

  const name = locale === 'zh' ? product.nameZh : product.name;
  const description = locale === 'zh'
    ? (product.descriptionZh || product.description)
    : (product.description || '');
  const shortDesc = locale === 'zh'
    ? (product.shortDescZh || product.shortDesc)
    : (product.shortDesc || '');
  const categoryName = locale === 'zh' ? product.category.nameZh : product.category.name;

  const pricingLabel = (model: string) => {
    switch (model) {
      case 'unit': return t('perUnit');
      case 'site': return t('perSite');
      case 'month': return t('perMonth');
      default: return '';
    }
  };

  // Fetch related products
  let relatedProducts: {
    id: string;
    slug: string;
    name: string;
    nameZh: string;
    shortDesc: string | null;
    shortDescZh: string | null;
    basePrice: number | null;
    pricingModel: string;
    isFeatured: boolean;
  }[] = [];

  try {
    const related = await prisma.portalProduct.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true,
      },
      take: 3,
    });
    relatedProducts = related.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      nameZh: p.nameZh,
      shortDesc: p.shortDesc,
      shortDescZh: p.shortDescZh,
      basePrice: p.basePrice ? Number(p.basePrice) : null,
      pricingModel: p.pricingModel,
      isFeatured: p.isFeatured,
    }));
  } catch {
    // DB not available
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="text-slate-500 hover:text-[#1e40af] transition-colors"
            >
              {tn('home')}
            </Link>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <Link
              href="/products"
              className="text-slate-500 hover:text-[#1e40af] transition-colors"
            >
              {tn('products')}
            </Link>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="text-slate-900 font-medium truncate">{name}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail — Split Layout */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left: Image placeholder */}
            <div className="bg-slate-100 rounded-2xl aspect-square flex items-center justify-center">
              <Package className="h-24 w-24 text-slate-300" />
            </div>

            {/* Right: Product info */}
            <div className="flex flex-col justify-center space-y-6">
              {categoryName && (
                <p className="text-sm font-semibold text-[#1e40af] uppercase tracking-wider">
                  {categoryName}
                </p>
              )}

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                {name}
              </h1>

              {product.isFeatured && (
                <div>
                  <Badge variant="info">{t('featured')}</Badge>
                </div>
              )}

              {shortDesc && (
                <p className="text-lg text-slate-600 leading-relaxed">
                  {shortDesc}
                </p>
              )}

              {description && (
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              )}

              {/* Pricing */}
              {product.basePrice && (
                <div className="bg-slate-50 rounded-xl p-6">
                  <p className="text-sm font-medium text-slate-500 mb-1">{t('pricing')}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900">
                      {tc('hkd')} {product.basePrice.toLocaleString()}
                    </span>
                    <span className="text-slate-500">
                      / {pricingLabel(product.pricingModel)}
                    </span>
                  </div>
                </div>
              )}

              {/* Lead time */}
              {product.leadTimeDays && (
                <p className="text-sm text-slate-500">
                  {t('leadTime')}: {product.leadTimeDays} {t('leadTimeDays')}
                </p>
              )}

              {/* Request Quote button */}
              <div className="pt-2">
                <Link
                  href={`/contact?product=${product.slug}` as never}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1e40af] text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors duration-200"
                >
                  {t('requestQuote')}
                </Link>
              </div>
            </div>
          </div>

          {/* Specifications table */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mt-20">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-6">
                {t('specifications')}
              </h2>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value], idx) => (
                      <tr
                        key={key}
                        className={idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}
                      >
                        <td className="px-6 py-4 font-medium text-slate-900 w-1/3">
                          {key}
                        </td>
                        <td className="px-6 py-4 text-slate-600">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Hardware list */}
          {product.hardwareList && product.hardwareList.length > 0 && (
            <div className="mt-20">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-6">
                {t('hardware')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {product.hardwareList.map((hw, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <h4 className="font-semibold text-slate-900 mb-1">{hw.name}</h4>
                    <p className="text-sm text-slate-600">{hw.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-20 pt-16 border-t border-slate-200">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-8">
                {t('relatedProducts')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedProducts.map((rp) => {
                  const rpName = locale === 'zh' ? rp.nameZh : rp.name;
                  const rpDesc = locale === 'zh'
                    ? (rp.shortDescZh || rp.shortDesc || '')
                    : (rp.shortDesc || '');
                  return (
                    <Link
                      key={rp.id}
                      href={`/products/${rp.slug}` as never}
                      className="group rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
                    >
                      <div className="h-40 bg-slate-100 flex items-center justify-center">
                        <Package className="h-12 w-12 text-slate-300 group-hover:text-[#1e40af]/40 transition-colors duration-300" />
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-[#1e40af] transition-colors">
                          {rpName}
                        </h3>
                        <p className="text-sm text-slate-600 line-clamp-2">{rpDesc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Back to products link */}
      <div className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#1e40af] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backToProducts')}
          </Link>
        </div>
      </div>
    </div>
  );
}
