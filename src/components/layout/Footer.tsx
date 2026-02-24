'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Mail, Phone } from 'lucide-react';

function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-3">
              <span className="text-primary">Loading</span> Technology
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {t('tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-300 mb-4">
              {t('quickLinks')}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/"
                  className="text-sm text-zinc-400 hover:text-white transition-colors duration-150"
                >
                  {tNav('home')}
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-sm text-zinc-400 hover:text-white transition-colors duration-150"
                >
                  {tNav('products')}
                </Link>
              </li>
              <li>
                <Link
                  href="/demos"
                  className="text-sm text-zinc-400 hover:text-white transition-colors duration-150"
                >
                  {tNav('demos')}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-zinc-400 hover:text-white transition-colors duration-150"
                >
                  {tNav('about')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-zinc-400 hover:text-white transition-colors duration-150"
                >
                  {tNav('contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-300 mb-4">
              {t('contact')}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm text-zinc-400">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a
                  href={`mailto:${t('email')}`}
                  className="hover:text-white transition-colors duration-150"
                >
                  {t('email')}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-zinc-400">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a
                  href={`tel:${t('phone')}`}
                  className="hover:text-white transition-colors duration-150"
                >
                  {t('phone')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-zinc-800">
          <p className="text-center text-xs text-zinc-500">
            &copy; {currentYear} {t('company')}. {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
