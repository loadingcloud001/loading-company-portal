'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Users,
  FileText,
  ShoppingCart,
  DollarSign,
  Plus,
  Package,
  ArrowRight,
} from 'lucide-react';

function formatHKD(amount: number): string {
  return `HK$ ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

interface AdminStats {
  customerCount: number;
  quotationCount: number;
  orderCount: number;
  totalRevenue: number;
}

interface RecentQuotation {
  id: string;
  quotationNo: string;
  customerName?: string;
  date: string;
  total: number;
  status: string;
}

interface RecentOrder {
  id: string;
  orderNo: string;
  customerName?: string;
  date: string;
  total: number;
  status: string;
}

const quotationStatusBadgeMap: Record<string, BadgeVariant> = {
  draft: 'default',
  sent: 'info',
  accepted: 'success',
  rejected: 'danger',
  expired: 'warning',
};

const orderStatusBadgeMap: Record<string, BadgeVariant> = {
  pending: 'warning',
  confirmed: 'info',
  processing: 'info',
  shipped: 'warning',
  delivered: 'success',
  cancelled: 'danger',
};

export default function AdminDashboardPage() {
  const t = useTranslations('admin');
  const tq = useTranslations('quotations');
  const to = useTranslations('orders');
  const tc = useTranslations('common');

  const [stats, setStats] = useState<AdminStats>({
    customerCount: 0,
    quotationCount: 0,
    orderCount: 0,
    totalRevenue: 0,
  });
  const [recentQuotations, setRecentQuotations] = useState<RecentQuotation[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [customersRes, quotationsRes, ordersRes] = await Promise.all([
          fetch('/api/admin/customers'),
          fetch('/api/quotations'),
          fetch('/api/orders'),
        ]);

        let customers: { id: string }[] = [];
        let quotations: RecentQuotation[] = [];
        let orders: RecentOrder[] = [];

        if (customersRes.ok) {
          const cData = await customersRes.json();
          customers = Array.isArray(cData) ? cData : cData.customers || [];
        }

        if (quotationsRes.ok) {
          const qData = await quotationsRes.json();
          quotations = Array.isArray(qData) ? qData : qData.quotations || [];
        }

        if (ordersRes.ok) {
          const oData = await ordersRes.json();
          orders = Array.isArray(oData) ? oData : oData.orders || [];
        }

        const totalRevenue = orders
          .filter((o: RecentOrder) => o.status !== 'cancelled')
          .reduce((sum: number, o: RecentOrder) => sum + (o.total || 0), 0);

        setStats({
          customerCount: customers.length,
          quotationCount: quotations.length,
          orderCount: orders.length,
          totalRevenue,
        });

        setRecentQuotations(
          [...quotations]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5)
        );

        setRecentOrders(
          [...orders]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5)
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  function getQuotationStatusLabel(status: string): string {
    const map: Record<string, string> = {
      draft: tq('statusDraft'),
      sent: tq('statusSent'),
      accepted: tq('statusAccepted'),
      rejected: tq('statusRejected'),
      expired: tq('statusExpired'),
    };
    return map[status] || status;
  }

  function getOrderStatusLabel(status: string): string {
    const map: Record<string, string> = {
      pending: to('statusPending'),
      confirmed: to('statusConfirmed'),
      processing: to('statusProcessing'),
      shipped: to('statusShipped'),
      delivered: to('statusDelivered'),
      cancelled: to('statusCancelled'),
    };
    return map[status] || status;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-zinc-500">{tc('loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">{t('dashboard')}</h1>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="flex items-center gap-4 py-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-50 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">{t('totalCustomers')}</p>
              <p className="text-2xl font-bold text-zinc-900">{stats.customerCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 py-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">{t('totalQuotations')}</p>
              <p className="text-2xl font-bold text-zinc-900">{stats.quotationCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 py-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-amber-50 text-amber-600">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">{t('totalOrders')}</p>
              <p className="text-2xl font-bold text-zinc-900">{stats.orderCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 py-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-50 text-purple-600">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">{t('totalRevenue')}</p>
              <p className="text-2xl font-bold text-zinc-900">{formatHKD(stats.totalRevenue)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Quotations & Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Quotations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900">{t('manageQuotations')}</h2>
            <Link href="/admin/quotations">
              <span className="text-sm text-primary hover:underline flex items-center gap-1">
                {tc('viewAll')} <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentQuotations.length === 0 ? (
              <p className="px-6 py-8 text-sm text-zinc-500 text-center">{tc('noResults')}</p>
            ) : (
              <div className="divide-y divide-zinc-100">
                {recentQuotations.map((q) => (
                  <div key={q.id} className="flex items-center justify-between px-6 py-3">
                    <div>
                      <p className="text-sm font-medium text-zinc-900">{q.quotationNo}</p>
                      {q.customerName && (
                        <p className="text-xs text-zinc-500">{q.customerName}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-zinc-700">{formatHKD(q.total)}</span>
                      <Badge variant={quotationStatusBadgeMap[q.status] || 'default'}>
                        {getQuotationStatusLabel(q.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900">{t('manageOrders')}</h2>
            <Link href="/admin/orders">
              <span className="text-sm text-primary hover:underline flex items-center gap-1">
                {tc('viewAll')} <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentOrders.length === 0 ? (
              <p className="px-6 py-8 text-sm text-zinc-500 text-center">{tc('noResults')}</p>
            ) : (
              <div className="divide-y divide-zinc-100">
                {recentOrders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between px-6 py-3">
                    <div>
                      <p className="text-sm font-medium text-zinc-900">{o.orderNo}</p>
                      {o.customerName && (
                        <p className="text-xs text-zinc-500">{o.customerName}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-zinc-700">{formatHKD(o.total)}</span>
                      <Badge variant={orderStatusBadgeMap[o.status] || 'default'}>
                        {getOrderStatusLabel(o.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/admin/quotations">
          <Card className="hover:border-primary transition-colors cursor-pointer group">
            <CardContent className="flex items-center gap-3 py-5">
              <Plus className="h-5 w-5 text-zinc-400 group-hover:text-primary" />
              <span className="font-medium text-zinc-700 group-hover:text-primary">
                {t('createQuotation')}
              </span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/products">
          <Card className="hover:border-primary transition-colors cursor-pointer group">
            <CardContent className="flex items-center gap-3 py-5">
              <Package className="h-5 w-5 text-zinc-400 group-hover:text-primary" />
              <span className="font-medium text-zinc-700 group-hover:text-primary">
                {t('manageProducts')}
              </span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/customers">
          <Card className="hover:border-primary transition-colors cursor-pointer group">
            <CardContent className="flex items-center gap-3 py-5">
              <Users className="h-5 w-5 text-zinc-400 group-hover:text-primary" />
              <span className="font-medium text-zinc-700 group-hover:text-primary">
                {t('manageCustomers')}
              </span>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
