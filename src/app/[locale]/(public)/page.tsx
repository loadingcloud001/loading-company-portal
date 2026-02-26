import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}
import {
  HardHat,
  Radio,
  Thermometer,
  Camera,
  Fingerprint,
  Construction,
  CheckSquare,
  Layers,
  Settings,
  Headphones,
  ArrowRight,
  BarChart3,
  Shield,
  Zap,
  Users,
} from 'lucide-react';
import { FaqAccordion } from './HomeClient';

/* ─── Category config ─── */

const categoryIcons: Record<string, React.ElementType> = {
  'smart-helmet': HardHat,
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
] as const;

/* ─── Why-us config ─── */

const whyUsItems = [
  { key: '1', icon: CheckSquare, color: 'text-blue-800', bg: 'bg-blue-50' },
  { key: '2', icon: Layers, color: 'text-blue-800', bg: 'bg-blue-50' },
  { key: '3', icon: Settings, color: 'text-blue-800', bg: 'bg-blue-50' },
  { key: '4', icon: Headphones, color: 'text-blue-800', bg: 'bg-blue-50' },
] as const;

/* ─── Stats config ─── */

const statIcons = [BarChart3, Shield, Users, Zap];

/* ─── Page ─── */

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tHero = await getTranslations('hero');
  const t = await getTranslations('home');
  const tCat = await getTranslations('categories');

  const stats = [
    { value: t('stat1Value'), label: t('stat1Label') },
    { value: t('stat2Value'), label: t('stat2Label') },
    { value: t('stat3Value'), label: t('stat3Label') },
    { value: t('stat4Value'), label: t('stat4Label') },
  ];

  const faqItems = [
    { question: t('faq1Q'), answer: t('faq1A') },
    { question: t('faq2Q'), answer: t('faq2A') },
    { question: t('faq3Q'), answer: t('faq3A') },
    { question: t('faq4Q'), answer: t('faq4A') },
  ];

  return (
    <div>
      {/* ──────────── Hero Section ──────────── */}
      <section className="relative min-h-[600px] lg:min-h-[680px] flex items-center overflow-hidden">
        {/* Background image */}
        <Image
          src="/images/hero-construction.jpg"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-slate-900/65" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40 w-full">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-white">
              {tHero('title')}
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-200 leading-relaxed max-w-2xl">
              {tHero('subtitle')}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#1e40af] text-white font-semibold rounded-lg hover:bg-[#1e3a8a] transition-colors duration-200 shadow-lg"
              >
                {tHero('cta')}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 text-white font-semibold rounded-lg border border-white/30 hover:bg-white/20 backdrop-blur-sm transition-colors duration-200"
              >
                {tHero('ctaDemo')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────── Stats Bar ──────────── */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-slate-500 mb-10">
            {t('statsTitle')}
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const Icon = statIcons[i];
              return (
                <div key={i} className="text-center">
                  <div className="flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5 text-[#1e40af] mr-2" />
                    <span className="text-3xl sm:text-4xl font-bold text-slate-900">
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──────────── Product Categories ──────────── */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
              {t('categoriesTitle')}
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              {t('categoriesSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorySlugs.map((slug) => {
              const Icon = categoryIcons[slug];
              return (
                <Link
                  key={slug}
                  href={`/products?category=${slug}` as any}
                  className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-[#1e40af]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#1e40af]/20 transition-colors duration-200">
                    <Icon className="h-6 w-6 text-[#1e40af]" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {tCat(`${slug}.name`)}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {tCat(`${slug}.desc`)}
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-[#1e40af] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span>{tCat(`${slug}.name`)}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──────────── Why Choose Us ──────────── */}
      <section className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
              {t('whyUsTitle')}
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              {t('whyUsSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyUsItems.map(({ key, icon: Icon, color, bg }) => (
              <div
                key={key}
                className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div
                  className={`w-14 h-14 ${bg} rounded-full flex items-center justify-center mx-auto mb-5`}
                >
                  <Icon className={`h-7 w-7 ${color}`} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  {t(`whyUs${key}Title` as any)}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t(`whyUs${key}Desc` as any)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── FAQ Section ──────────── */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
              {t('faqTitle')}
            </h2>
          </div>
          <FaqAccordion items={faqItems} />
        </div>
      </section>

      {/* ──────────── CTA Section ──────────── */}
      <section className="bg-gradient-to-r from-[#1e40af] to-[#1e3a8a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            {t('ctaTitle')}
          </h2>
          <p className="text-lg text-blue-100 mb-10 leading-relaxed max-w-2xl mx-auto">
            {t('ctaDesc')}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-[#1e40af] font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200 shadow-lg"
          >
            {t('ctaButton')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
