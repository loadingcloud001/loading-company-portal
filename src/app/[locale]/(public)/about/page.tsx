import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import {
  Target,
  Cpu,
  CheckCircle,
  Zap,
  Settings,
  HeadsetIcon,
  ShieldCheck,
  Radio,
  Thermometer,
  Camera,
  ArrowRight,
} from 'lucide-react';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('about');
  const tc = await getTranslations('categories');

  return (
    <div>
      {/* Page header */}
      <section className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              {t('title')}
            </h1>
            <p className="mt-6 text-lg text-zinc-300 leading-relaxed">
              {t('whatWeDoText')}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-zinc-900">
                  {t('mission')}
                </h2>
              </div>
              <p className="text-lg text-zinc-600 leading-relaxed">
                {t('missionText')}
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-zinc-50 rounded-2xl p-8 lg:p-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Cpu className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-zinc-900">
                  {t('whatWeDo')}
                </h2>
              </div>
              <p className="text-zinc-600 leading-relaxed">
                {t('whatWeDoText')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 sm:py-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900">
              {t('whatWeDo')}
            </h2>
            <p className="mt-4 text-lg text-zinc-600 max-w-2xl mx-auto">
              {tc('subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-zinc-900 mb-2">
                {tc('smart-helmet.name')}
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {tc('smart-helmet.desc')}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Thermometer className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-zinc-900 mb-2">
                {tc('environmental-monitoring.name')}
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {tc('environmental-monitoring.desc')}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Camera className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-zinc-900 mb-2">
                {tc('ai-surveillance.name')}
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {tc('ai-surveillance.desc')}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-100">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Radio className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-zinc-900 mb-2">
                {tc('proximity-alert.name')}
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {tc('proximity-alert.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900">
              {t('whyUs')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 mb-1">CIC Compliance</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  {t('whyUsPoints.compliance')}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 mb-1">End-to-End Integration</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  {t('whyUsPoints.integration')}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 mb-1">Customizable Solutions</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  {t('whyUsPoints.custom')}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                <HeadsetIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 mb-1">Local Support</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  {t('whyUsPoints.support')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
            {t('mission')}
          </h2>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-150"
          >
            Contact Us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
