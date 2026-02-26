'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

const subjectOptions = [
  { value: '', label: '— Select —' },
  { value: 'general', label: 'General Inquiry' },
  { value: 'product', label: 'Product Inquiry' },
  { value: 'technical', label: 'Technical Support' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'other', label: 'Other' },
];

export function ContactPageClient() {
  const t = useTranslations('contact');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', phone: '', company: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{t('successTitle')}</h3>
        <p className="text-slate-600 mb-6">{t('successMessage')}</p>
        <Button variant="outline" onClick={() => setStatus('idle')}>
          Send another inquiry
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6"
    >
      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label={t('nameLabel')}
          placeholder={t('namePlaceholder')}
          required
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
        <Input
          label={t('emailLabel')}
          type="email"
          placeholder={t('emailPlaceholder')}
          required
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />
      </div>

      {/* Company + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label={t('companyLabel')}
          placeholder={t('companyPlaceholder')}
          value={form.company}
          onChange={(e) => handleChange('company', e.target.value)}
        />
        <Input
          label={t('phoneLabel')}
          type="tel"
          placeholder={t('phonePlaceholder')}
          value={form.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
        />
      </div>

      {/* Subject */}
      <Select
        label={t('subjectLabel')}
        options={subjectOptions}
        required
        value={form.subject}
        onChange={(e) => handleChange('subject', e.target.value)}
      />

      {/* Message (textarea) */}
      <div className="w-full">
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {t('messageLabel')} <span className="text-red-500">*</span>
        </label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => handleChange('message', e.target.value)}
          placeholder={t('messagePlaceholder')}
          className={cn(
            'flex min-h-[120px] w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900',
            'placeholder:text-slate-400 transition-colors resize-y',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:border-primary'
          )}
        />
      </div>

      {/* Error feedback */}
      {status === 'error' && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {t('errorMessage')}
        </div>
      )}

      {/* Submit */}
      <Button type="submit" size="lg" loading={status === 'loading'}>
        <Send className="h-4 w-4" />
        {t('submitButton')}
      </Button>
    </form>
  );
}
