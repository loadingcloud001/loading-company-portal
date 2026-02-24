'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  FileText,
  ShoppingCart,
  ArrowRight,
  Clock,
  CheckCircle,
  Send,
} from 'lucide-react';

function formatHKD(amount: number): string {
  return `HK$ ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

interface User {
  id: string;
  email: string;
  role: string;
  contactName: string;
}

interface Quotation {
  id: string;
  quotationNo: string;
  title: string;
  date: string;
  total: number;
  status: string;
}

interface Order {
  id: string;
  orderNo: string;
  date: string;
  total: number;
  status: string;
}

interface ActivityItem {
  id: string;
  type: 'quotation' | 'order';
  label: string;
  date: string;
  status: string;
  href: string;
}

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const tq = useTranslations('quotations');
  const to = useTranslations('orders');
  const tc = useTranslations('common');

  const [user, setUser] = useState<User | null>(null);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, quotationsRes, ordersRes] = await Promise.all([
          fetch('/api/auth/check'),
          fetch('/api/quotations'),
          fetch('/api/orders'),
        ]);

        if (!userRes.ok) throw new Error('Failed to fetch user');

        const userData = await userRes.json();
        setUser(userData);

        if (quotationsRes.ok) {
          const qData = await quotationsRes.json();
          setQuotations(Array.isArray(qData) ? qData : qData.quotations || []);
        }

        if (ordersRes.ok) {
          const oData = await ordersRes.json();
          setOrders(Array.isArray(oData) ? oData : oData.orders || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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

  const activeQuotations = quotations.filter(
    (q) => q.status === 'sent' || q.status === 'draft'
  );
  const pendingOrders = orders.filter(
    (o) => o.status === 'pending' || o.status === 'confirmed' || o.status === 'processing'
  );

  // Build recent activity from quotations + orders combined, sorted by date
  const recentActivity: ActivityItem[] = [
    ...quotations.map((q) => ({
      id: q.id,
      type: 'quotation' as const,
      label: `${tq('quotationNo')}: ${q.quotationNo} - ${q.title || ''}`,
      date: q.date,
      status: q.status,
      href: `/quotations/${q.id}`,
    })),
    ...orders.map((o) => ({
      id: o.id,
      type: 'order' as const,
      label: `${to('orderNo')}: ${o.orderNo}`,
      date: o.date,
      status: o.status,
      href: `/orders/${o.id}`,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  function getStatusBadgeVariant(status: string) {
    switch (status) {
      case 'draft':
        return 'default';
      case 'sent':
      case 'confirmed':
        return 'info';
      case 'accepted':
      case 'delivered':
        return 'success';
      case 'rejected':
      case 'cancelled':
        return 'danger';
      case 'expired':
        return 'warning';
      case 'pending':
      case 'processing':
      case 'shipped':
        return 'warning';
      default:
        return 'default';
    }
  }

  function getStatusLabel(type: string, status: string) {
    if (type === 'quotation') {
      const map: Record<string, string> = {
        draft: tq('statusDraft'),
        sent: tq('statusSent'),
        accepted: tq('statusAccepted'),
        rejected: tq('statusRejected'),
        expired: tq('statusExpired'),
      };
      return map[status] || status;
    }
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">
          {t('welcome')}, {user?.contactName}
        </h1>
        <p className="text-zinc-500 mt-1">{t('title')}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardContent className="flex items-center gap-4 py-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-50 text-blue-600">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">{t('activeQuotations')}</p>
              <p className="text-2xl font-bold text-zinc-900">
                {activeQuotations.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 py-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-amber-50 text-amber-600">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">{t('pendingOrders')}</p>
              <p className="text-2xl font-bold text-zinc-900">
                {pendingOrders.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-lg font-semibold text-zinc-900">
            {t('recentActivity')}
          </h2>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-zinc-500 py-4">{t('noActivity')}</p>
          ) : (
            <div className="divide-y divide-zinc-100">
              {recentActivity.map((item) => (
                <Link
                  key={`${item.type}-${item.id}`}
                  href={item.href}
                  className="flex items-center justify-between py-3 hover:bg-zinc-50 -mx-6 px-6 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {item.type === 'quotation' ? (
                      <FileText className="h-4 w-4 text-blue-500" />
                    ) : (
                      <ShoppingCart className="h-4 w-4 text-amber-500" />
                    )}
                    <span className="text-sm text-zinc-700">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                    <Badge variant={getStatusBadgeVariant(item.status)}>
                      {getStatusLabel(item.type, item.status)}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/quotations"
          className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 hover:border-primary hover:bg-blue-50/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-zinc-400 group-hover:text-primary" />
            <span className="font-medium text-zinc-700 group-hover:text-primary">
              {tq('title')}
            </span>
          </div>
          <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-primary" />
        </Link>

        <Link
          href="/orders"
          className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 hover:border-primary hover:bg-blue-50/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-5 w-5 text-zinc-400 group-hover:text-primary" />
            <span className="font-medium text-zinc-700 group-hover:text-primary">
              {to('title')}
            </span>
          </div>
          <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-primary" />
        </Link>
      </div>
    </div>
  );
}
