'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { COMPANY } from '@/lib/constants';
import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  ShoppingCart,
  Shield,
  LogOut,
  Menu,
  X,
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
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/check');
        if (!res.ok) {
          router.replace('/login');
          return;
        }
        const data = await res.json();
        if (data.user?.role !== 'admin') {
          router.replace('/login');
          return;
        }
        setAuthorized(true);
      } catch {
        router.replace('/login');
      }
    }
    checkAuth();
  }, [router]);

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

  const panelUrl = '/panel';

  function isActive(href: string): boolean {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    router.replace('/login');
  }

  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-slate-500">{t('loading')}</p>
      </div>
    );
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-200">
        <Image src="/logo.svg" alt={COMPANY.name} width={140} height={34} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                active
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
              )}
            >
              <span className={active ? 'text-blue-700' : 'text-slate-400'}>
                {item.icon}
              </span>
              {t(item.labelKey as never)}
            </Link>
          );
        })}

        {/* Divider + Full Admin Panel link */}
        <div className="pt-3 mt-3 border-t border-slate-200">
          <a
            href={panelUrl}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Shield className="h-5 w-5 text-slate-400" />
            {t('fullAdminPanel')}
          </a>
        </div>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors w-full cursor-pointer"
        >
          <LogOut className="h-5 w-5 text-slate-400" />
          {t('logout')}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col shrink-0 fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Sidebar - Mobile */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-200 ease-in-out lg:hidden',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
        {sidebarContent}
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">{t('title')}</h2>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
