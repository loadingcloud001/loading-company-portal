'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import Image from 'next/image';
import { UserPlus, Loader2, AlertCircle, Eye, EyeOff, CheckCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RegisterPage() {
  const t = useTranslations('auth');
  const router = useRouter();

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    contactName: '',
    companyName: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          contactName: form.contactName,
          companyName: form.companyName || undefined,
          phone: form.phone || undefined,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login' as any);
        }, 2000);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center overflow-hidden">
        <Image
          src="/images/office.jpg"
          alt="Office"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="relative z-10 max-w-md px-12 text-center">
          <Link href="/" className="inline-block mb-8">
            <Image src="/logo-white.svg" alt="Loading Technology" width={200} height={48} />
          </Link>
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('registerTitle')}
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            Join our platform to manage quotations, orders, and access exclusive products.
          </p>
          <div className="mt-10 flex items-center justify-center gap-3 text-slate-400">
            <Shield className="h-5 w-5" />
            <span className="text-sm">Free registration &middot; No credit card required</span>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-block">
              <Image src="/logo.svg" alt="Loading Technology" width={180} height={44} />
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {t('registerTitle')}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {t('hasAccount')}{' '}
              <Link
                href="/login"
                className="font-medium text-primary hover:text-blue-700 transition-colors"
              >
                {t('signIn')}
              </Link>
            </p>
          </div>

          {success ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-lg font-medium text-slate-900 mb-2">
                {t('registerSuccess')}
              </p>
              <p className="text-sm text-slate-500">Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {t('contactName')} <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  required
                  value={form.contactName}
                  onChange={(e) => handleChange('contactName', e.target.value)}
                  placeholder={t('contactName')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {t('email')} <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder={t('email')}
                  autoComplete="email"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('password')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={form.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      placeholder={t('password')}
                      autoComplete="new-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('confirmPassword')} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={form.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    placeholder={t('confirmPassword')}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('companyName')}
                  </label>
                  <Input
                    type="text"
                    value={form.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                    placeholder={t('companyName')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('phone')}
                  </label>
                  <Input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder={t('phone')}
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
                {t('register')}
              </Button>
            </form>
          )}

          <p className="mt-8 text-center text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Loading Technology Company Limited
          </p>
        </div>
      </div>
    </div>
  );
}
