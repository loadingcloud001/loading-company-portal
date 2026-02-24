'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { FileText, ArrowLeft } from 'lucide-react';

function formatHKD(amount: number): string {
  return `HK$ ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

interface Quotation {
  id: string;
  quotationNo: string;
  title: string;
  date: string;
  total: number;
  status: string;
}

const statusBadgeMap: Record<string, BadgeVariant> = {
  draft: 'default',
  sent: 'info',
  accepted: 'success',
  rejected: 'danger',
  expired: 'warning',
};

export default function QuotationsPage() {
  const t = useTranslations('quotations');
  const tc = useTranslations('common');

  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchQuotations() {
      try {
        const res = await fetch('/api/quotations');
        if (!res.ok) throw new Error('Failed to fetch quotations');
        const data = await res.json();
        setQuotations(Array.isArray(data) ? data : data.quotations || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchQuotations();
  }, []);

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
          {quotations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <FileText className="h-12 w-12 text-zinc-300 mb-4" />
              <p className="text-zinc-500">{t('noQuotations')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50/50">
                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      {t('quotationNo')}
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      {t('items')}
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      {t('date')}
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      {t('total')}
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      {tc('status')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {quotations.map((q) => (
                    <tr
                      key={q.id}
                      className="hover:bg-zinc-50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/quotations/${q.id}`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          {q.quotationNo}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/quotations/${q.id}`}
                          className="text-sm text-zinc-700"
                        >
                          {q.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-500">
                        {new Date(q.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-900 text-right font-medium">
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
    </div>
  );
}
