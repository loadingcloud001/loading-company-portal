import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}
import {
  Cpu,
  Code,
  Cog,
  GraduationCap,
  CheckCircle,
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
  const tc = await getTranslations('common');

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-slate-900 text-white py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              {t('title')}
            </h1>
            <p className="mt-6 text-xl text-slate-300 leading-relaxed">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Mission — Split Layout */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-6">
                {t('mission')}
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                {t('missionText')}
              </p>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
              <Image
                src="/images/team-meeting.jpg"
                alt={t('mission')}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-6">
              {t('whatWeDo')}
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              {t('whatWeDoText')}
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-center mb-16">
            {t('servicesTitle')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* IoT Hardware Supply */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-5">
                <Cpu className="h-6 w-6 text-[#1e40af]" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {t('service1Title')}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t('service1Desc')}
              </p>
            </div>

            {/* Software Development */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-5">
                <Code className="h-6 w-6 text-[#1e40af]" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {t('service2Title')}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t('service2Desc')}
              </p>
            </div>

            {/* System Integration */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-5">
                <Cog className="h-6 w-6 text-[#1e40af]" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {t('service3Title')}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t('service3Desc')}
              </p>
            </div>

            {/* Training & Support */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-5">
                <GraduationCap className="h-6 w-6 text-[#1e40af]" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {t('service4Title')}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t('service4Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline / Journey */}
      <section className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-center mb-16">
            {t('timelineTitle')}
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="relative pl-8 border-l-2 border-[#1e40af]/20 space-y-12">
              <div className="relative">
                <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-[#1e40af] border-4 border-white shadow" />
                <p className="text-sm font-bold text-[#1e40af] mb-1">{t('timeline1Year')}</p>
                <p className="text-slate-600 leading-relaxed">{t('timeline1Event')}</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-[#1e40af] border-4 border-white shadow" />
                <p className="text-sm font-bold text-[#1e40af] mb-1">{t('timeline2Year')}</p>
                <p className="text-slate-600 leading-relaxed">{t('timeline2Event')}</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-[#1e40af] border-4 border-white shadow" />
                <p className="text-sm font-bold text-[#1e40af] mb-1">{t('timeline3Year')}</p>
                <p className="text-slate-600 leading-relaxed">{t('timeline3Event')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-center mb-16">
            {t('whyUs')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {(['compliance', 'integration', 'custom', 'support'] as const).map((key) => (
              <div key={key} className="flex gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                  <CheckCircle className="h-5 w-5 text-[#1e40af]" />
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {t(`whyUsPoints.${key}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24 bg-[#1e40af]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            {t('ctaTitle')}
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            {t('ctaDesc')}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#1e40af] font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200"
          >
            {t('ctaButton')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
