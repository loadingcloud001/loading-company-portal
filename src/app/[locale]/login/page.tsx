'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import Image from 'next/image';
import { LogIn, Loader2, AlertCircle, Eye, EyeOff, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const t = useTranslations('auth');
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push('/dashboard' as any);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || t('invalidCredentials'));
      }
    } catch {
      setError(t('invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center overflow-hidden">
        <Image
          src="/images/smart-city.jpg"
          alt="Smart City"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="relative z-10 max-w-md px-12 text-center">
          <Link href="/" className="inline-block mb-8">
            <Image src="/logo-white.svg" alt="Loading Technology" width={200} height={48} />
          </Link>
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('loginTitle')}
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            Manage your projects, track orders, and access your dashboard.
          </p>
          <div className="mt-10 flex items-center justify-center gap-3 text-slate-400">
            <Shield className="h-5 w-5" />
            <span className="text-sm">Secure enterprise-grade platform</span>
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
              {t('loginTitle')}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {t('noAccount')}{' '}
              <Link
                href="/register"
                className="font-medium text-primary hover:text-blue-700 transition-colors"
              >
                {t('signUp')}
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {t('email')}
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('email')}
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {t('password')}
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('password')}
                  autoComplete="current-password"
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
                <LogIn className="h-4 w-4" />
              )}
              {t('login')}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Loading Technology Company Limited
          </p>
        </div>
      </div>
    </div>
  );
}
