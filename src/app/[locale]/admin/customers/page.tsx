'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Users, ChevronDown, ChevronUp } from 'lucide-react';

interface Customer {
  id: string;
  contactName: string;
  email: string;
  companyName?: string;
  quotationCount?: number;
  orderCount?: number;
  status?: string;
}

export default function AdminCustomersPage() {
  const t = useTranslations('admin');
  const tc = useTranslations('common');

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch('/api/admin/customers');
        if (!res.ok) throw new Error('Failed to fetch customers');
        const data = await res.json();
        setCustomers(Array.isArray(data) ? data : data.customers || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchCustomers();
  }, []);

  function toggleExpand(id: string) {
    setExpandedId(expandedId === id ? null : id);
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
        <h1 className="text-2xl font-bold text-slate-900">{t('manageCustomers')}</h1>
      </div>

      <Card>
        <CardContent className="p-0">
          {customers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Users className="h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-500">{tc('noResults')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50">
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Quotations
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {tc('status')}
                    </th>
                    <th className="w-10 px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customers.map((customer) => (
                    <>
                      <tr
                        key={customer.id}
                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => toggleExpand(customer.id)}
                      >
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-slate-900">
                            {customer.contactName}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {customer.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {customer.companyName || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 text-center">
                          {customer.quotationCount ?? 0}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 text-center">
                          {customer.orderCount ?? 0}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge
                            variant={
                              customer.status === 'active' ? 'success' : 'default'
                            }
                          >
                            {customer.status === 'active' ? 'Active' : customer.status || 'Active'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          {expandedId === customer.id ? (
                            <ChevronUp className="h-4 w-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-slate-400" />
                          )}
                        </td>
                      </tr>
                      {expandedId === customer.id && (
                        <tr key={`${customer.id}-detail`}>
                          <td colSpan={7} className="bg-slate-50 px-6 py-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                                  Contact Name
                                </p>
                                <p className="text-slate-900">{customer.contactName}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                                  Email
                                </p>
                                <p className="text-slate-900">{customer.email}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                                  Company
                                </p>
                                <p className="text-slate-900">{customer.companyName || '-'}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
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
