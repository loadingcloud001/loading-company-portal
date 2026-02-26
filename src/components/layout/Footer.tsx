'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import Image from 'next/image';

function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const tCat = useTranslations('categories');
  const currentYear = new Date().getFullYear();

  const productLinks = [
    'smart-helmet', 'proximity-alert', 'environmental-monitoring',
    'ai-surveillance', 'access-control', 'lifting-operations',
  ] as const;

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Image src="/logo-white.svg" alt="Loading Technology" width={160} height={40} className="mb-4" />
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              {t('tagline')}
            </p>
            <a
              href="https://wa.me/85291234567"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {t('whatsapp')}
            </a>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">
              {t('products')}
            </h4>
            <ul className="space-y-2.5">
              {productLinks.map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/products?category=${slug}`}
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-1 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-3.5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    {tCat(`${slug}.name`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">
              {t('quickLinks')}
            </h4>
            <ul className="space-y-2.5">
              {(['home', 'products', 'demos', 'about', 'contact'] as const).map((key) => (
                <li key={key}>
                  <Link
                    href={key === 'home' ? '/' : `/${key}`}
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-1 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-3.5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    {tNav(key)}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/privacy" className="text-sm text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-1 group">
                  <ArrowRight className="h-3 w-3 opacity-0 -ml-3.5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-1 group">
                  <ArrowRight className="h-3 w-3 opacity-0 -ml-3.5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                  {t('terms')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">
              {t('contact')}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-slate-400">
                <Mail className="h-4 w-4 text-primary-light shrink-0 mt-0.5" />
                <a href={`mailto:${t('email')}`} className="hover:text-white transition-colors">
                  {t('email')}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-slate-400">
                <Phone className="h-4 w-4 text-primary-light shrink-0 mt-0.5" />
                <a href={`tel:${t('phone')}`} className="hover:text-white transition-colors">
                  {t('phone')}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-slate-400">
                <MapPin className="h-4 w-4 text-primary-light shrink-0 mt-0.5" />
                <span>{t('address')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              &copy; {currentYear} {t('company')}. {t('rights')}
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                {t('privacy')}
              </Link>
              <Link href="/terms" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                {t('terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
