import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, Package, MessageSquare, Clock, DollarSign } from 'lucide-react';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('products');
  const tc = await getTranslations('common');

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
      <div className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Package className="h-16 w-16 text-zinc-300 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-zinc-900 mb-4">
            Product details coming soon
          </h1>
          <p className="text-zinc-600 mb-8">
            We are currently updating our product catalog. Please check back soon or contact us for more information.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors"
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

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backToProducts')}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product images */}
            <div className="bg-gradient-to-br from-zinc-100 to-zinc-50 rounded-xl h-80 flex items-center justify-center">
              {product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <Package className="h-24 w-24 text-zinc-300" />
              )}
            </div>

            {/* Product info */}
            <div>
              <div className="text-sm font-medium text-primary mb-2">
                {categoryName}
              </div>
              <h1 className="text-3xl font-bold text-zinc-900 mb-4">{name}</h1>
              {shortDesc && (
                <p className="text-lg text-zinc-600 leading-relaxed mb-6">
                  {shortDesc}
                </p>
              )}
              {description && (
                <div className="prose prose-zinc max-w-none">
                  <p className="text-zinc-700 leading-relaxed whitespace-pre-line">
                    {description}
                  </p>
                </div>
              )}
            </div>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 mb-4">
                  {t('specifications')}
                </h2>
                <div className="bg-zinc-50 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      {Object.entries(product.specifications).map(([key, value], idx) => (
                        <tr
                          key={key}
                          className={idx % 2 === 0 ? 'bg-zinc-50' : 'bg-white'}
                        >
                          <td className="px-5 py-3 font-medium text-zinc-700 w-1/3">
                            {key}
                          </td>
                          <td className="px-5 py-3 text-zinc-600">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Hardware list */}
            {product.hardwareList && product.hardwareList.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 mb-4">
                  {t('hardware')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.hardwareList.map((hw, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-zinc-100 rounded-lg p-4"
                    >
                      <h4 className="font-medium text-zinc-900 text-sm">{hw.name}</h4>
                      <p className="text-xs text-zinc-500 mt-1">{hw.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Pricing card */}
              <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-zinc-900 mb-4">{t('pricing')}</h3>
                {product.basePrice ? (
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl font-bold text-zinc-900">
                      {tc('hkd')} {product.basePrice.toLocaleString()}
                    </span>
                    <span className="text-sm text-zinc-500">
                      / {pricingLabel(product.pricingModel)}
                    </span>
                  </div>
                ) : (
                  <p className="text-zinc-600 mb-2">Contact us for pricing</p>
                )}

                {product.leadTimeDays && (
                  <div className="flex items-center gap-2 text-sm text-zinc-500 mt-3">
                    <Clock className="h-4 w-4" />
                    <span>
                      {t('leadTime')}: {product.leadTimeDays} {t('days')}
                    </span>
                  </div>
                )}

                <Link
                  href={`/contact?product=${product.slug}` as any}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors duration-150"
                >
                  <MessageSquare className="h-4 w-4" />
                  {t('requestQuote')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
