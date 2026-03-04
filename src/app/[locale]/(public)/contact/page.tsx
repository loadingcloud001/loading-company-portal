import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ContactPageClient } from './ContactPageClient';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { CONTACT } from '@/lib/constants';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  return { title: t('title') };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'contact' });

  return (
    <div>
      {/* Hero */}
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

      {/* Two-column: Form + Contact Info */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Left — Contact Form */}
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {t('submit')}
              </h2>
              <p className="text-slate-600 mb-8">
                {t('subtitle')}
              </p>
              <ContactPageClient />
            </div>

            {/* Right — Contact Info Cards */}
            <div className="lg:col-span-2 space-y-6">
              {/* Phone + WhatsApp */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">{t('infoPhone')}</h3>
                    <a
                      href={`tel:${CONTACT.phone}`}
                      className="text-slate-600 hover:text-primary transition-colors block"
                    >
                      {CONTACT.phoneFormatted}
                    </a>
                    <a
                      href={CONTACT.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">{t('infoEmail')}</h3>
                    <a
                      href={`mailto:${CONTACT.email}`}
                      className="text-slate-600 hover:text-primary transition-colors"
                    >
                      {CONTACT.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">{t('infoAddress')}</h3>
                    <p className="text-slate-600">{t('infoAddressValue')}</p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">{t('infoBusinessHours')}</h3>
                    <p className="text-slate-600 text-sm">{t('businessHoursWeekday')}</p>
                    <p className="text-slate-600 text-sm">{t('businessHoursSaturday')}</p>
                    <p className="text-slate-500 text-sm">{t('businessHoursClosed')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map / Office Placeholder */}
      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            {t('ourOffice')}
          </h2>
          <p className="text-slate-600 mb-10 max-w-2xl mx-auto">
            {t('ourOfficeDesc')}
          </p>
          <div className="relative rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden h-72 sm:h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">{t('mapPlaceholder')} — {t('infoAddressValue')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
