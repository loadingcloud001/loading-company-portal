'use client';

import { type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  ShoppingCart,
  Shield,
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

interface NavItem {
  href: string;
  labelKey: string;
  icon: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const t = useTranslations('admin');
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      href: '/admin',
      labelKey: 'dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      href: '/admin/products',
      labelKey: 'manageProducts',
      icon: <Package className="h-5 w-5" />,
    },
    {
      href: '/admin/customers',
      labelKey: 'manageCustomers',
      icon: <Users className="h-5 w-5" />,
    },
    {
      href: '/admin/quotations',
      labelKey: 'manageQuotations',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      href: '/admin/orders',
      labelKey: 'manageOrders',
      icon: <ShoppingCart className="h-5 w-5" />,
    },
  ];

  function isActive(href: string): boolean {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  }

  return (
    <div className="min-h-screen flex bg-zinc-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col shrink-0">
        {/* Sidebar Header */}
        <div className="px-6 py-5 border-b border-zinc-200">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-zinc-900">{t('title')}</h2>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                <span className={active ? 'text-primary' : 'text-zinc-400'}>
                  {item.icon}
                </span>
                {t(item.labelKey as never)}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
