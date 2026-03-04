'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import {
  Package,
  Star,
  Plus,
  Pencil,
  Trash2,
  Search,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { formatHKD } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Category {
  id: string;
  name: string;
  nameZh: string;
  slug: string;
}

interface Product {
  id: string;
  categoryId: string;
  name: string;
  nameZh: string;
  slug: string;
  shortDesc: string | null;
  shortDescZh: string | null;
  description: string | null;
  descriptionZh: string | null;
  basePrice: number | null;
  pricingModel: string;
  leadTimeDays: number | null;
  demoUrl: string | null;
  demoType: string | null;
  isActive: boolean;
  isFeatured: boolean;
  category: { name: string; nameZh: string };
}

type FormData = {
  categoryId: string;
  name: string;
  nameZh: string;
  slug: string;
  shortDesc: string;
  shortDescZh: string;
  description: string;
  descriptionZh: string;
  basePrice: string;
  pricingModel: string;
  leadTimeDays: string;
  demoUrl: string;
  isActive: boolean;
  isFeatured: boolean;
};

const EMPTY_FORM: FormData = {
  categoryId: '',
  name: '',
  nameZh: '',
  slug: '',
  shortDesc: '',
  shortDescZh: '',
  description: '',
  descriptionZh: '',
  basePrice: '',
  pricingModel: 'unit',
  leadTimeDays: '',
  demoUrl: '',
  isActive: true,
  isFeatured: false,
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/* ------------------------------------------------------------------ */
/*  Toast                                                              */
/* ------------------------------------------------------------------ */

function Toast({
  message,
  variant,
  onDismiss,
}: {
  message: string;
  variant: 'success' | 'error';
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed top-6 right-6 z-[100] animate-in slide-in-from-top-2 fade-in">
      <div
        className={`flex items-center gap-2.5 rounded-lg px-4 py-3 shadow-lg text-sm font-medium ${
          variant === 'success'
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}
      >
        {variant === 'success' ? (
          <CheckCircle className="h-4 w-4 shrink-0" />
        ) : (
          <AlertCircle className="h-4 w-4 shrink-0" />
        )}
        {message}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Product Form Modal                                                 */
/* ------------------------------------------------------------------ */

function ProductFormModal({
  isOpen,
  onClose,
  onSaved,
  product,
  categories,
  t,
  tp,
  tc,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (msg: string) => void;
  product: Product | null;
  categories: Category[];
  t: ReturnType<typeof useTranslations>;
  tp: ReturnType<typeof useTranslations>;
  tc: ReturnType<typeof useTranslations>;
}) {
  const isEdit = !!product;
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setForm({
        categoryId: product.categoryId,
        name: product.name,
        nameZh: product.nameZh,
        slug: product.slug,
        shortDesc: product.shortDesc || '',
        shortDescZh: product.shortDescZh || '',
        description: product.description || '',
        descriptionZh: product.descriptionZh || '',
        basePrice: product.basePrice?.toString() || '',
        pricingModel: product.pricingModel,
        leadTimeDays: product.leadTimeDays?.toString() || '',
        demoUrl: product.demoUrl || '',
        isActive: product.isActive,
        isFeatured: product.isFeatured,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setError('');
  }, [product, isOpen]);

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // Auto-generate slug from English name when creating
      if (!isEdit && field === 'name' && typeof value === 'string') {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    setError('');
    if (!form.categoryId || !form.name || !form.nameZh || !form.slug) {
      setError(t('validationFieldsRequired'));
      return;
    }
    setSaving(true);
    try {
      const url = isEdit
        ? `/api/admin/products/${product!.id}`
        : '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || t('failedToSaveProduct'));
        return;
      }

      onSaved(isEdit ? t('productUpdated') : t('productCreated'));
      onClose();
    } catch {
      setError(t('networkError'));
    } finally {
      setSaving(false);
    }
  };

  const categoryOptions = [
    { value: '', label: String(t('selectCategory')) },
    ...categories.map((c) => ({ value: c.id, label: `${c.name} / ${c.nameZh}` })),
  ];

  const pricingOptions = [
    { value: 'unit', label: String(t('perUnit')) },
    { value: 'site', label: String(t('perSite')) },
    { value: 'monthly', label: String(t('monthlyPricing')) },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? String(t('editProduct')) : String(t('addProduct'))}
      size="lg"
    >
      <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Category */}
        <Select
          label={String(t('category'))}
          options={categoryOptions}
          value={form.categoryId}
          onChange={(e) => updateField('categoryId', e.target.value)}
        />

        {/* Names */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={String(t('productName'))}
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder={String(t('productNamePlaceholder'))}
          />
          <Input
            label={String(t('productNameZh'))}
            value={form.nameZh}
            onChange={(e) => updateField('nameZh', e.target.value)}
            placeholder={String(t('productNameZhPlaceholder'))}
          />
        </div>

        {/* Slug */}
        <Input
          label={String(t('productSlug'))}
          value={form.slug}
          onChange={(e) => updateField('slug', e.target.value)}
          placeholder={String(t('slugPlaceholder'))}
        />

        {/* Short descriptions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={String(t('shortDesc'))}
            value={form.shortDesc}
            onChange={(e) => updateField('shortDesc', e.target.value)}
          />
          <Input
            label={String(t('shortDescZh'))}
            value={form.shortDescZh}
            onChange={(e) => updateField('shortDescZh', e.target.value)}
          />
        </div>

        {/* Full descriptions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Textarea
            label={String(t('description'))}
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            rows={4}
          />
          <Textarea
            label={String(t('descriptionZh'))}
            value={form.descriptionZh}
            onChange={(e) => updateField('descriptionZh', e.target.value)}
            rows={4}
          />
        </div>

        {/* Pricing row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label={String(t('basePrice'))}
            type="number"
            min="0"
            step="0.01"
            value={form.basePrice}
            onChange={(e) => updateField('basePrice', e.target.value)}
          />
          <Select
            label={String(t('pricingModel'))}
            options={pricingOptions}
            value={form.pricingModel}
            onChange={(e) => updateField('pricingModel', e.target.value)}
          />
          <Input
            label={String(t('leadTimeDays'))}
            type="number"
            min="0"
            value={form.leadTimeDays}
            onChange={(e) => updateField('leadTimeDays', e.target.value)}
          />
        </div>

        {/* Demo URL */}
        <Input
          label={String(t('demoUrl'))}
          value={form.demoUrl}
          onChange={(e) => updateField('demoUrl', e.target.value)}
          placeholder={String(t('demoUrlPlaceholder'))}
        />

        {/* Toggles */}
        <div className="flex items-center gap-8">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
              checked={form.isActive}
              onChange={(e) => updateField('isActive', e.target.checked)}
            />
            <span className="text-sm font-medium text-slate-700">{t('active')}</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
              checked={form.isFeatured}
              onChange={(e) => updateField('isFeatured', e.target.checked)}
            />
            <span className="text-sm font-medium text-slate-700">{tp('featured')}</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50/50">
        <Button variant="ghost" onClick={onClose} disabled={saving}>
          {tc('cancel')}
        </Button>
        <Button onClick={handleSubmit} loading={saving}>
          {tc('save')}
        </Button>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/*  Delete Confirmation Modal                                          */
/* ------------------------------------------------------------------ */

function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  productName,
  deleting,
  t,
  tc,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
  deleting: boolean;
  t: ReturnType<typeof useTranslations>;
  tc: ReturnType<typeof useTranslations>;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={String(t('confirmDeleteTitle'))} size="sm">
      <div className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
            <Trash2 className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-slate-600">{t('confirmDeleteMessage')}</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">{productName}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50/50">
        <Button variant="ghost" onClick={onClose} disabled={deleting}>
          {tc('cancel')}
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={deleting}>
          {tc('delete')}
        </Button>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function AdminProductsPage() {
  const t = useTranslations('admin');
  const tp = useTranslations('products');
  const tc = useTranslations('common');
  const locale = useLocale();

  /* Data */
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /* Search */
  const [search, setSearch] = useState('');

  /* Modals */
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [deletingInProgress, setDeletingInProgress] = useState(false);

  /* Toast */
  const [toast, setToast] = useState<{
    message: string;
    variant: 'success' | 'error';
  } | null>(null);

  /* ---- Data fetching ---- */

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('anErrorOccurred'));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (!res.ok) return;
      const data = await res.json();
      setCategories(data.categories || []);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  /* ---- Handlers ---- */

  const openCreate = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const openDelete = (product: Product) => {
    setDeletingProduct(product);
    setDeleteOpen(true);
  };

  const handleSaved = (msg: string) => {
    setToast({ message: msg, variant: 'success' });
    fetchProducts();
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    setDeletingInProgress(true);
    try {
      const res = await fetch(`/api/admin/products/${deletingProduct.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setToast({
          message: data.error || String(t('failedToDeleteProduct')),
          variant: 'error',
        });
        return;
      }
      setToast({ message: String(t('productDeleted')), variant: 'success' });
      fetchProducts();
    } catch {
      setToast({ message: String(t('networkError')), variant: 'error' });
    } finally {
      setDeletingInProgress(false);
      setDeleteOpen(false);
      setDeletingProduct(null);
    }
  };

  /* ---- Toggle helpers ---- */

  const toggleField = async (product: Product, field: 'isActive' | 'isFeatured') => {
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !product[field] }),
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch {
      /* ignore */
    }
  };

  /* ---- Filtered list ---- */

  const filtered = search
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.nameZh.includes(search) ||
          p.category.name.toLowerCase().includes(search.toLowerCase())
      )
    : products;

  /* ---- Render ---- */

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
    <div className="p-6 lg:p-8">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onDismiss={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{t('manageProducts')}</h1>
        <Button onClick={openCreate} size="md">
          <Plus className="h-4 w-4" />
          {t('addProduct')}
        </Button>
      </div>

      {/* Search */}
      <div className="mb-4 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={String(t('searchProducts'))}
          className="w-full h-10 rounded-lg border border-slate-200 bg-white pl-9 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary"
        />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Package className="h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-500">{tc('noResults')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50">
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {t('productName')}
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {t('category')}
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {tp('pricing')}
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {tc('status')}
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {tp('featured')}
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {tc('actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      {/* Name (EN / ZH) */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {product.nameZh}
                        </p>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {locale === 'zh' ? product.category.nameZh : product.category.name}
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 text-sm text-slate-900 text-right font-medium">
                        {product.basePrice
                          ? formatHKD(Number(product.basePrice))
                          : '—'}
                      </td>

                      {/* Status toggle */}
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => toggleField(product, 'isActive')}
                          className="cursor-pointer"
                        >
                          <Badge
                            variant={product.isActive ? 'success' : 'default'}
                          >
                            {product.isActive ? t('active') : t('inactive')}
                          </Badge>
                        </button>
                      </td>

                      {/* Featured toggle */}
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => toggleField(product, 'isFeatured')}
                          className="cursor-pointer"
                        >
                          {product.isFeatured ? (
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500 inline" />
                          ) : (
                            <Star className="h-4 w-4 text-slate-300 inline" />
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEdit(product)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer"
                            title={String(tc('edit'))}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openDelete(product)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title={String(tc('delete'))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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

      {/* Modals */}
      <ProductFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
        product={editingProduct}
        categories={categories}
        t={t}
        tp={tp}
        tc={tc}
      />

      <DeleteConfirmModal
        isOpen={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeletingProduct(null);
        }}
        onConfirm={handleDelete}
        productName={deletingProduct?.name || ''}
        deleting={deletingInProgress}
        t={t}
        tc={tc}
      />
    </div>
  );
}
