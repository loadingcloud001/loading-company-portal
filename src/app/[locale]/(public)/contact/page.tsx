import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ContactPageClient } from './ContactPageClient';

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('contact');
  const tf = await getTranslations('footer');

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact info sidebar */}
          <div className="lg:col-span-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-4">
              {t('title')}
            </h1>
            <p className="text-zinc-600 mb-8 leading-relaxed">
              {t('subtitle')}
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 mb-1">Email</h3>
                <a
                  href={`mailto:${tf('email')}`}
                  className="text-primary hover:text-primary-dark transition-colors"
                >
                  {tf('email')}
                </a>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 mb-1">Phone</h3>
                <a
                  href={`tel:${tf('phone')}`}
                  className="text-primary hover:text-primary-dark transition-colors"
                >
                  {tf('phone')}
                </a>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 mb-1">Company</h3>
                <p className="text-zinc-600">{tf('company')}</p>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <ContactPageClient />
          </div>
        </div>
      </div>
    </div>
  );
}
