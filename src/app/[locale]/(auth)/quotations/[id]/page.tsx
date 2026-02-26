'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  ArrowLeft,
  Download,
  CheckCircle,
  XCircle,
} from 'lucide-react';

function formatHKD(amount: number): string {
  return `HK$ ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

interface QuotationItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface QuotationDetail {
  id: string;
  quotationNo: string;
  title: string;
  date: string;
  validUntil?: string;
  status: string;
  items: QuotationItem[];
  subtotal: number;
  discount: number;
  grandTotal: number;
  bankDetails?: string;
  notes?: string;
}

const statusBadgeMap: Record<string, BadgeVariant> = {
  draft: 'default',
  sent: 'info',
  accepted: 'success',
  rejected: 'danger',
  expired: 'warning',
};

export default function QuotationDetailPage() {
  const t = useTranslations('quotations');
  const tc = useTranslations('common');
  const params = useParams();
  const id = params.id as string;

  const [quotation, setQuotation] = useState<QuotationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function fetchQuotation() {
      try {
        const res = await fetch(`/api/quotations/${id}`);
        if (!res.ok) throw new Error('Failed to fetch quotation');
        const data = await res.json();
        setQuotation(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchQuotation();
  }, [id]);

  async function handleAction(action: 'accepted' | 'rejected') {
    if (!quotation) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/quotations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action }),
      });
      if (!res.ok) throw new Error('Failed to update quotation');
      const updated = await res.json();
      setQuotation(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setActionLoading(false);
    }
  }

  function getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      draft: t('statusDraft'),
      sent: t('statusSent'),
      accepted: t('statusAccepted'),
      rejected: t('statusRejected'),
      expired: t('statusExpired'),
    };
    return map[status] || status;
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

  if (!quotation) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-500">{tc('noResults')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/quotations"
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-slate-500" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">
            {t('quotationNo')}: {quotation.quotationNo}
          </h1>
          {quotation.title && (
            <p className="text-slate-500 mt-0.5">{quotation.title}</p>
          )}
        </div>
        <Badge variant={statusBadgeMap[quotation.status] || 'default'} className="text-sm">
          {getStatusLabel(quotation.status)}
        </Badge>
      </div>

      {/* Quotation Info */}
      <Card className="mb-6">
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">{t('date')}</p>
              <p className="text-sm font-medium text-slate-900 mt-1">
                {new Date(quotation.date).toLocaleDateString()}
              </p>
            </div>
            {quotation.validUntil && (
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">{t('validUntil')}</p>
                <p className="text-sm font-medium text-slate-900 mt-1">
                  {new Date(quotation.validUntil).toLocaleDateString()}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">{tc('status')}</p>
              <p className="text-sm font-medium text-slate-900 mt-1">
                {getStatusLabel(quotation.status)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items Table */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold text-slate-900">{t('items')}</h2>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {t('items')}
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {t('quantity')}
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {t('unitPrice')}
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {t('total')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quotation.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-900">{item.name}</p>
                      {item.description && (
                        <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 text-right">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 text-right">
                      {formatHKD(item.unitPrice)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 text-right">
                      {formatHKD(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="mb-6">
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">{t('subtotal')}</span>
              <span className="text-slate-900">{formatHKD(quotation.subtotal)}</span>
            </div>
            {quotation.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">{t('discount')}</span>
                <span className="text-red-600">-{formatHKD(quotation.discount)}</span>
              </div>
            )}
            <div className="border-t border-slate-200 pt-2 flex justify-between">
              <span className="font-semibold text-slate-900">{t('grandTotal')}</span>
              <span className="text-lg font-bold text-slate-900">
                {formatHKD(quotation.grandTotal)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank Details */}
      {quotation.bankDetails && (
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-900">{t('bankDetails')}</h2>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-700 whitespace-pre-line">
              {quotation.bankDetails}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {quotation.notes && (
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-900">{t('notes')}</h2>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-700 whitespace-pre-line">
              {quotation.notes}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {quotation.status === 'sent' && (
          <>
            <Button
              variant="primary"
              onClick={() => handleAction('accepted')}
              loading={actionLoading}
            >
              <CheckCircle className="h-4 w-4" />
              {t('accept')}
            </Button>
            <Button
              variant="danger"
              onClick={() => handleAction('rejected')}
              loading={actionLoading}
            >
              <XCircle className="h-4 w-4" />
              {t('reject')}
            </Button>
          </>
        )}
        <a
          href={`/api/quotations/${id}/pdf`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline">
            <Download className="h-4 w-4" />
            {tc('downloadPdf')}
          </Button>
        </a>
      </div>
    </div>
  );
}
