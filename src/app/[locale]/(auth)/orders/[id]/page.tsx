'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { ArrowLeft, Circle, CheckCircle2, Truck, Package, Clock } from 'lucide-react';

function formatHKD(amount: number): string {
  return `HK$ ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

interface Payment {
  id: string;
  date: string;
  amount: number;
  method: string;
  reference?: string;
}

interface DeliveryInfo {
  address?: string;
  expectedDate?: string;
  trackingNo?: string;
  carrier?: string;
}

interface OrderDetail {
  id: string;
  orderNo: string;
  date: string;
  status: string;
  total: number;
  depositRequired: number;
  depositPaid: number;
  payments: Payment[];
  delivery?: DeliveryInfo;
  items?: {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
}

const statusBadgeMap: Record<string, BadgeVariant> = {
  pending: 'warning',
  confirmed: 'info',
  processing: 'info',
  shipped: 'warning',
  delivered: 'success',
  cancelled: 'danger',
};

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export default function OrderDetailPage() {
  const t = useTranslations('orders');
  const tc = useTranslations('common');
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (!res.ok) throw new Error('Failed to fetch order');
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchOrder();
  }, [id]);

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

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-zinc-500">{tc('noResults')}</p>
      </div>
    );
  }

  const currentStepIndex = order.status === 'cancelled'
    ? -1
    : STATUS_STEPS.indexOf(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/orders"
          className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-zinc-500" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-zinc-900">
            {t('orderNo')}: {order.orderNo}
          </h1>
        </div>
        <Badge variant={statusBadgeMap[order.status] || 'default'} className="text-sm">
          {getStatusLabel(order.status)}
        </Badge>
      </div>

      {/* Order Info */}
      <Card className="mb-6">
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">{t('date')}</p>
              <p className="text-sm font-medium text-zinc-900 mt-1">
                {new Date(order.date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">{tc('status')}</p>
              <p className="text-sm font-medium text-zinc-900 mt-1">
                {getStatusLabel(order.status)}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">{t('total')}</p>
              <p className="text-sm font-bold text-zinc-900 mt-1">
                {formatHKD(order.total)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Timeline */}
      {order.status !== 'cancelled' && (
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-zinc-900">{tc('status')}</h2>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-0">
              {STATUS_STEPS.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div key={step} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      {isCompleted ? (
                        <CheckCircle2
                          className={`h-6 w-6 ${isCurrent ? 'text-primary' : 'text-emerald-500'}`}
                        />
                      ) : (
                        <Circle className="h-6 w-6 text-zinc-300" />
                      )}
                      {index < STATUS_STEPS.length - 1 && (
                        <div
                          className={`w-0.5 h-8 ${
                            index < currentStepIndex ? 'bg-emerald-500' : 'bg-zinc-200'
                          }`}
                        />
                      )}
                    </div>
                    <div className="pb-8 last:pb-0">
                      <p
                        className={`text-sm font-medium ${
                          isCompleted ? 'text-zinc-900' : 'text-zinc-400'
                        }`}
                      >
                        {getStatusLabel(step)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deposit Info */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold text-zinc-900">{t('deposit')}</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">{t('depositRequired')}</p>
              <p className="text-sm font-bold text-zinc-900 mt-1">
                {formatHKD(order.depositRequired)}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">{t('depositPaid')}</p>
              <p className="text-sm font-bold text-zinc-900 mt-1">
                {formatHKD(order.depositPaid)}
              </p>
            </div>
          </div>
          {order.depositPaid < order.depositRequired && (
            <div className="mt-4">
              <div className="w-full bg-zinc-200 rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2 transition-all"
                  style={{
                    width: `${Math.min(
                      (order.depositPaid / order.depositRequired) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                {Math.round((order.depositPaid / order.depositRequired) * 100)}%
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold text-zinc-900">{t('paymentHistory')}</h2>
        </CardHeader>
        <CardContent className="p-0">
          {(!order.payments || order.payments.length === 0) ? (
            <div className="px-6 py-8 text-center">
              <Clock className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
              <p className="text-sm text-zinc-500">{tc('noResults')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50/50">
                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      {t('date')}
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      {t('total')}
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Reference
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {order.payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 text-sm text-zinc-700">
                        {new Date(payment.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-zinc-900 text-right">
                        {formatHKD(payment.amount)}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-700">
                        {payment.method}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-500">
                        {payment.reference || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delivery Information */}
      {order.delivery && (
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-zinc-900">{t('deliveryInfo')}</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.delivery.address && (
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">{t('deliveryAddress')}</p>
                  <p className="text-sm text-zinc-900 mt-1">{order.delivery.address}</p>
                </div>
              )}
              {order.delivery.expectedDate && (
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">{t('expectedDelivery')}</p>
                  <p className="text-sm text-zinc-900 mt-1">
                    {new Date(order.delivery.expectedDate).toLocaleDateString()}
                  </p>
                </div>
              )}
              {order.delivery.trackingNo && (
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">{t('tracking')}</p>
                  <p className="text-sm text-zinc-900 mt-1">
                    {order.delivery.carrier && `${order.delivery.carrier}: `}
                    {order.delivery.trackingNo}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
