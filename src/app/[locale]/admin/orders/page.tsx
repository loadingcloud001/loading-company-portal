'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { ShoppingCart } from 'lucide-react';

function formatHKD(amount: number): string {
  return `HK$ ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

interface Order {
  id: string;
  orderNo: string;
  customerName?: string;
  total: number;
  depositAmount?: number;
  status: string;
  createdAt: string;
}

const statusBadgeMap: Record<string, BadgeVariant> = {
  pending: 'warning',
  confirmed: 'info',
  processing: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'danger',
};

export default function AdminOrdersPage() {
  const t = useTranslations('admin');
  const to = useTranslations('orders');
  const tc = useTranslations('common');

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Status update modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  // Payment confirmation modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [bankRef, setBankRef] = useState('');
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

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

  function getStatusLabel(status: string): string {
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

  const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  async function handleStatusUpdate() {
    if (!selectedOrder || !newStatus) return;
    setUpdating(true);

    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      setOrders(orders.map((o) =>
        o.id === selectedOrder.id ? { ...o, status: newStatus } : o
      ));
      setShowStatusModal(false);
      setSelectedOrder(null);
      setNewStatus('');
    } catch {
      setError('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  }

  async function handlePaymentConfirm() {
    if (!selectedOrder || !paymentAmount) return;
    setPaymentSubmitting(true);

    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentAmount: parseFloat(paymentAmount),
          bankRef,
          status: 'confirmed',
        }),
      });

      if (!res.ok) throw new Error('Failed to confirm payment');

      setOrders(orders.map((o) =>
        o.id === selectedOrder.id ? { ...o, status: 'confirmed' } : o
      ));
      setShowPaymentModal(false);
      setSelectedOrder(null);
      setPaymentAmount('');
      setBankRef('');
    } catch {
      setError('Failed to confirm payment');
    } finally {
      setPaymentSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-500">{tc('loading')}</p>
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{t('manageOrders')}</h1>
      </div>

      <Card>
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <ShoppingCart className="h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-500">{tc('noResults')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50">
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {to('orderNo')}
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {to('date')}
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {to('total')}
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {tc('status')}
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {tc('actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {order.orderNo}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {order.customerName || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 text-right font-medium">
                        {formatHKD(order.total)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant={statusBadgeMap[order.status] || 'default'}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(order);
                              setNewStatus(order.status);
                              setShowStatusModal(true);
                            }}
                          >
                            {t('updateStatus')}
                          </Button>
                          {order.status === 'pending' && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order);
                                setPaymentAmount(order.depositAmount?.toString() || '');
                                setShowPaymentModal(true);
                              }}
                            >
                              {t('confirmPayment')}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Update Status Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedOrder(null);
        }}
        title={t('updateStatus')}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            {selectedOrder?.orderNo}
          </p>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {tc('status')}
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="block w-full appearance-none rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {getStatusLabel(s)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button variant="ghost" onClick={() => setShowStatusModal(false)}>
              {tc('cancel')}
            </Button>
            <Button
              variant="primary"
              onClick={handleStatusUpdate}
              loading={updating}
            >
              {tc('confirm')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirm Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedOrder(null);
        }}
        title={t('confirmPayment')}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            {selectedOrder?.orderNo} - {selectedOrder && formatHKD(selectedOrder.total)}
          </p>
          <Input
            label={to('deposit')}
            type="number"
            step="0.01"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            placeholder="0.00"
          />
          <Input
            label={t('bankRef')}
            value={bankRef}
            onChange={(e) => setBankRef(e.target.value)}
            placeholder="Bank transfer reference"
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button variant="ghost" onClick={() => setShowPaymentModal(false)}>
              {tc('cancel')}
            </Button>
            <Button
              variant="primary"
              onClick={handlePaymentConfirm}
              loading={paymentSubmitting}
            >
              {t('confirmPayment')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
