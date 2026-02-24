'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { ShoppingCart, ArrowLeft } from 'lucide-react';

function formatHKD(amount: number): string {
  return `HK$ ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

interface Order {
  id: string;
  orderNo: string;
  date: string;
  total: number;
  depositStatus: string;
  status: string;
}

const statusBadgeMap: Record<string, BadgeVariant> = {
  pending: 'warning',
  confirmed: 'info',
  processing: 'info',
  shipped: 'warning',
  delivered: 'success',
  cancelled: 'danger',
};

const depositBadgeMap: Record<string, BadgeVariant> = {
  unpaid: 'danger',
  partial: 'warning',
  paid: 'success',
};

export default function OrdersPage() {
  const t = useTranslations('orders');
  const tc = useTranslations('common');

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders');
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  function getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      pending: t('statusPending'),
      confirmed: t('statusConfirmed'),
      processing: t('statusProcessing'),
      shipped: t('statusShipped'),
      delivered: t('statusDelivered'),
      cancelled: t('statusCancelled'),
    };
    return map[status] || status;
  }

  function getDepositLabel(status: string): string {
    const map: Record<string, string> = {
      unpaid: t('depositRequired'),
      partial: t('deposit'),
      paid: t('depositPaid'),
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/dashboard"
          className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-zinc-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">{t('title')}</h1>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <ShoppingCart className="h-12 w-12 text-zinc-300 mb-4" />
              <p className="text-zinc-500">{t('noOrders')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50/50">
                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      {t('orderNo')}
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      {t('date')}
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      {t('total')}
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      {t('deposit')}
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      {tc('status')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-zinc-50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/orders/${order.id}`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          {order.orderNo}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-500">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-900 text-right font-medium">
                        {formatHKD(order.total)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant={depositBadgeMap[order.depositStatus] || 'default'}>
                          {getDepositLabel(order.depositStatus)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant={statusBadgeMap[order.status] || 'default'}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
