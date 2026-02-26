import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'terms' });
  return { title: t('title') };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'terms' });

  const content = t('content');
  const paragraphs = content.split('\n\n').filter(Boolean);

  return (
    <div>
      {/* Hero */}
      <section className="bg-slate-900 text-white py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              {t('title')}
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-slate-500 mb-10">{t('lastUpdated')}</p>

          <div className="prose prose-slate max-w-none">
            {paragraphs.map((paragraph, index) => {
              // Detect section headers (text before a colon at the start)
              const colonIdx = paragraph.indexOf(':');
              if (colonIdx > 0 && colonIdx < 60 && !paragraph.startsWith('http')) {
                const heading = paragraph.slice(0, colonIdx);
                const body = paragraph.slice(colonIdx + 1).trim();
                return (
                  <div key={index} className="mb-8">
                    <h2 className="text-xl font-semibold text-slate-900 mb-3">
                      {heading}
                    </h2>
                    <p className="text-slate-600 leading-relaxed">{body}</p>
                  </div>
                );
              }
              return (
                <p key={index} className="text-slate-600 leading-relaxed mb-6">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
