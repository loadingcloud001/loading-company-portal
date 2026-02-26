'use client';

import { useEffect, useState, Fragment } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import {
  FileText,
  Plus,
  Trash2,
  X,
} from 'lucide-react';

function formatHKD(amount: number): string {
  return `HK$ ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

interface Quotation {
  id: string;
  quotationNo: string;
  customerName?: string;
  title: string;
  date: string;
  total: number;
  status: string;
}

interface Customer {
  id: string;
  contactName: string;
  email: string;
  companyName?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

interface LineItem {
  tempId: string;
  productId?: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

const statusBadgeMap: Record<string, BadgeVariant> = {
  draft: 'default',
  sent: 'info',
  accepted: 'success',
  rejected: 'danger',
  expired: 'warning',
};

export default function AdminQuotationsPage() {
  const t = useTranslations('admin');
  const tq = useTranslations('quotations');
  const tc = useTranslations('common');

  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Form fields
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [title, setTitle] = useState('');
  const [items, setItems] = useState<LineItem[]>([
    { tempId: '1', name: '', quantity: 1, unitPrice: 0 },
  ]);
  const [notes, setNotes] = useState('');
  const [bankDetails, setBankDetails] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [quotationsRes, customersRes, productsRes] = await Promise.all([
          fetch('/api/quotations'),
          fetch('/api/admin/customers'),
          fetch('/api/products'),
        ]);

        if (quotationsRes.ok) {
          const qData = await quotationsRes.json();
          setQuotations(Array.isArray(qData) ? qData : qData.quotations || []);
        }

        if (customersRes.ok) {
          const cData = await customersRes.json();
          setCustomers(Array.isArray(cData) ? cData : cData.customers || []);
        }

        if (productsRes.ok) {
          const pData = await productsRes.json();
          setProducts(Array.isArray(pData) ? pData : pData.products || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  function getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      draft: tq('statusDraft'),
      sent: tq('statusSent'),
      accepted: tq('statusAccepted'),
      rejected: tq('statusRejected'),
      expired: tq('statusExpired'),
    };
    return map[status] || status;
  }

  function addItem() {
    setItems([
      ...items,
      { tempId: Date.now().toString(), name: '', quantity: 1, unitPrice: 0 },
    ]);
  }

  function removeItem(tempId: string) {
    if (items.length <= 1) return;
    setItems(items.filter((item) => item.tempId !== tempId));
  }

  function updateItem(tempId: string, field: keyof LineItem, value: string | number) {
    setItems(
      items.map((item) =>
        item.tempId === tempId ? { ...item, [field]: value } : item
      )
    );
  }

  function handleProductSelect(tempId: string, productId: string) {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setItems(
        items.map((item) =>
          item.tempId === tempId
            ? { ...item, productId, name: product.name, unitPrice: product.price }
            : item
        )
      );
    }
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  function resetForm() {
    setSelectedCustomerId('');
    setTitle('');
    setItems([{ tempId: '1', name: '', quantity: 1, unitPrice: 0 }]);
    setNotes('');
    setBankDetails('');
    setFormError('');
  }

  async function handleSubmit() {
    if (!selectedCustomerId) {
      setFormError('Please select a customer');
      return;
    }
    if (!title.trim()) {
      setFormError('Please enter a title');
      return;
    }
    if (items.some((item) => !item.name.trim())) {
      setFormError('All items must have a name');
      return;
    }

    setFormLoading(true);
    setFormError('');

    try {
      const res = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: selectedCustomerId,
          title,
          items: items.map((item) => ({
            productId: item.productId || undefined,
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
          notes,
          bankDetails,
        }),
      });

      if (!res.ok) throw new Error('Failed to create quotation');

      const newQuotation = await res.json();
      setQuotations([newQuotation, ...quotations]);
      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setFormLoading(false);
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{t('manageQuotations')}</h1>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4" />
          {t('createQuotation')}
        </Button>
      </div>

      {/* Quotations Table */}
      <Card>
        <CardContent className="p-0">
          {quotations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <FileText className="h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-500">{tc('noResults')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50">
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {tq('quotationNo')}
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {tq('date')}
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {tq('total')}
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {tc('status')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {quotations.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {q.quotationNo}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {q.customerName || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {q.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(q.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 text-right font-medium">
                        {formatHKD(q.total)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant={statusBadgeMap[q.status] || 'default'}>
                          {getStatusLabel(q.status)}
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

      {/* Create Quotation Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        title={t('createQuotation')}
        size="lg"
      >
        <div className="space-y-6">
          {formError && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              {formError}
            </div>
          )}

          {/* Customer Select */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {t('selectCustomer')}
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="block w-full appearance-none rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            >
              <option value="">{t('selectCustomer')}...</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.contactName} {c.companyName ? `(${c.companyName})` : ''} - {c.email}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Quotation title"
          />

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-slate-700">
                {tq('items')}
              </label>
              <Button variant="ghost" size="sm" onClick={addItem}>
                <Plus className="h-3 w-3" />
                {t('addItem')}
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.tempId}
                  className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/50"
                >
                  <div className="flex-1 space-y-2">
                    {/* Product select or custom name */}
                    <div className="flex gap-2">
                      <select
                        value={item.productId || ''}
                        onChange={(e) => {
                          if (e.target.value) {
                            handleProductSelect(item.tempId, e.target.value);
                          }
                        }}
                        className="block w-full appearance-none rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                      >
                        <option value="">Custom item...</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} - {formatHKD(p.price)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(item.tempId, 'name', e.target.value)}
                      placeholder="Item name"
                      className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    />
                    <div className="flex gap-2">
                      <div className="w-24">
                        <label className="block text-xs text-slate-500 mb-1">{tq('quantity')}</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(item.tempId, 'quantity', parseInt(e.target.value) || 1)
                          }
                          className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                        />
                      </div>
                      <div className="w-36">
                        <label className="block text-xs text-slate-500 mb-1">{tq('unitPrice')}</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) =>
                            updateItem(item.tempId, 'unitPrice', parseFloat(e.target.value) || 0)
                          }
                          className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-zinc-500 mb-1">{tq('total')}</label>
                        <p className="px-3 py-2 text-sm font-medium text-slate-900">
                          {formatHKD(item.quantity * item.unitPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.tempId)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                    disabled={items.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Subtotal */}
            <div className="mt-4 flex justify-end">
              <div className="text-right">
                <p className="text-sm text-slate-500">{tq('subtotal')}</p>
                <p className="text-lg font-bold text-slate-900">{formatHKD(subtotal)}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <Textarea
            label={tq('notes')}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes..."
          />

          {/* Bank Details */}
          <Textarea
            label={tq('bankDetails')}
            value={bankDetails}
            onChange={(e) => setBankDetails(e.target.value)}
            placeholder="Bank transfer details..."
          />

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button
              variant="ghost"
              onClick={() => {
                setShowCreateModal(false);
                resetForm();
              }}
            >
              {tc('cancel')}
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={formLoading}
            >
              {tc('create')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
