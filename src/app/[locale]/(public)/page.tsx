import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import {
  ShieldCheck,
  Radio,
  Thermometer,
  Camera,
  Fingerprint,
  Construction,
  ArrowRight,
  CheckCircle,
  Zap,
  HeadsetIcon,
  Settings,
} from 'lucide-react';

const categoryIcons: Record<string, React.ElementType> = {
  'smart-helmet': ShieldCheck,
  'proximity-alert': Radio,
  'environmental-monitoring': Thermometer,
  'ai-surveillance': Camera,
  'access-control': Fingerprint,
  'lifting-operations': Construction,
};

const categorySlugs = [
  'smart-helmet',
  'proximity-alert',
  'environmental-monitoring',
  'ai-surveillance',
  'access-control',
  'lifting-operations',
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('hero');
  const tc = await getTranslations('categories');
  const ta = await getTranslations('about');

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              {t('title')}
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-blue-100 leading-relaxed max-w-2xl">
              {t('subtitle')}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-150 shadow-lg"
              >
                {t('cta')}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/demos"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-500/30 text-white font-semibold rounded-lg border border-white/30 hover:bg-blue-500/50 transition-colors duration-150"
              >
                {t('ctaDemo')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="py-20 sm:py-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900">
              {tc('title')}
            </h2>
            <p className="mt-4 text-lg text-zinc-600 max-w-2xl mx-auto">
              {tc('subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorySlugs.map((slug) => {
              const Icon = categoryIcons[slug];
              return (
                <Link
                  key={slug}
                  href={`/products?category=${slug}` as any}
                  className="group bg-white rounded-xl p-6 shadow-sm border border-zinc-100 hover:shadow-md hover:border-primary/20 transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-200">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                    {tc(`${slug}.name`)}
                  </h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    {tc(`${slug}.desc`)}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span>Learn more</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900">
              {ta('whyUs')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="font-semibold text-zinc-900 mb-2">CIC Compliance</h3>
              <p className="text-sm text-zinc-600">
                {ta('whyUsPoints.compliance')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="font-semibold text-zinc-900 mb-2">End-to-End</h3>
              <p className="text-sm text-zinc-600">
                {ta('whyUsPoints.integration')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="font-semibold text-zinc-900 mb-2">Customizable</h3>
              <p className="text-sm text-zinc-600">
                {ta('whyUsPoints.custom')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeadsetIcon className="h-7 w-7 text-orange-600" />
              </div>
              <h3 className="font-semibold text-zinc-900 mb-2">Local Support</h3>
              <p className="text-sm text-zinc-600">
                {ta('whyUsPoints.support')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24 bg-zinc-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {ta('mission')}
          </h2>
          <p className="text-lg text-zinc-300 mb-10 leading-relaxed">
            {ta('missionText')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors duration-150"
            >
              Get in Touch
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-zinc-800 text-white font-semibold rounded-lg border border-zinc-700 hover:bg-zinc-700 transition-colors duration-150"
            >
              {t('cta')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
