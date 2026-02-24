'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { Menu, X } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button } from '@/components/ui/Button';

const navLinks = [
  { href: '/', key: 'home' },
  { href: '/products', key: 'products' },
  { href: '/demos', key: 'demos' },
  { href: '/about', key: 'about' },
  { href: '/contact', key: 'contact' },
] as const;

function PublicNav() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-white transition-shadow duration-200 ${
        scrolled ? 'shadow-md' : 'shadow-none border-b border-zinc-100'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-zinc-900 shrink-0"
        >
          <span className="text-primary">Loading</span>
          <span className="hidden sm:inline">Technology</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                isActive(link.href)
                  ? 'text-primary bg-primary/5'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              {t(link.key)}
            </Link>
          ))}
        </div>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-2">
          <LanguageSwitcher />
          <Link href="/login">
            <Button variant="outline" size="sm">
              {t('login')}
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-200 ease-in-out ${
          mobileMenuOpen ? 'max-h-96 border-t border-zinc-100' : 'max-h-0'
        }`}
      >
        <div className="px-4 py-3 space-y-1 bg-white">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                isActive(link.href)
                  ? 'text-primary bg-primary/5'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              {t(link.key)}
            </Link>
          ))}
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-100">
            <LanguageSwitcher />
            <Link href="/login">
              <Button variant="outline" size="sm">
                {t('login')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export { PublicNav };
