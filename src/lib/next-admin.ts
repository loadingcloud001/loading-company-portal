import type { NextAdminOptions } from '@premieroctet/next-admin';

/**
 * Shared Next-Admin options used by both the page and the API handler.
 * Configures every Portal Prisma model for the auto-generated admin panel.
 */
export const nextAdminOptions: NextAdminOptions = {
  title: '羅丁科技 Admin',
  model: {
    /* ── Customers ─────────────────────────────────── */
    PortalCustomer: {
      toString: (customer) => customer.contactName ?? customer.email,
      title: 'Customers',
      icon: 'UsersIcon',
      list: {
        display: [
          'id',
          'email',
          'contactName',
          'companyName',
          'phone',
          'role',
          'status',
          'createdAt',
        ],
        search: ['email', 'contactName', 'companyName', 'phone'],
      },
      edit: {
        display: [
          'email',
          'contactName',
          'companyName',
          'phone',
          'address',
          'role',
          'status',
        ],
        fields: {
          password: { visible: () => false },
        },
      },
    },

    /* ── Product Categories ────────────────────────── */
    PortalProductCategory: {
      toString: (cat) => `${cat.name} / ${cat.nameZh}`,
      title: 'Categories',
      icon: 'TagIcon',
      list: {
        display: ['id', 'name', 'nameZh', 'slug', 'sortOrder', 'isActive'],
        search: ['name', 'nameZh', 'slug'],
      },
      edit: {
        display: [
          'name',
          'nameZh',
          'slug',
          'description',
          'descriptionZh',
          'icon',
          'sortOrder',
          'isActive',
        ],
      },
    },

    /* ── Products ──────────────────────────────────── */
    PortalProduct: {
      toString: (p) => `${p.name} / ${p.nameZh}`,
      title: 'Products',
      icon: 'CubeIcon',
      list: {
        display: [
          'id',
          'name',
          'nameZh',
          'slug',
          'category',
          'basePrice',
          'isActive',
          'isFeatured',
          'createdAt',
        ],
        search: ['name', 'nameZh', 'slug'],
      },
      edit: {
        display: [
          'name',
          'nameZh',
          'slug',
          'category',
          'shortDesc',
          'shortDescZh',
          'description',
          'descriptionZh',
          'basePrice',
          'pricingModel',
          'leadTimeDays',
          'images',
          'specifications',
          'hardwareList',
          'demoUrl',
          'demoType',
          'isActive',
          'isFeatured',
        ],
      },
    },

    /* ── Demos ─────────────────────────────────────── */
    PortalDemo: {
      toString: (d) => `${d.name} / ${d.nameZh}`,
      title: 'Demos',
      icon: 'PlayIcon',
      list: {
        display: ['id', 'name', 'nameZh', 'demoType', 'url', 'category', 'isActive'],
        search: ['name', 'nameZh'],
      },
      edit: {
        display: [
          'name',
          'nameZh',
          'slug',
          'description',
          'descriptionZh',
          'demoType',
          'url',
          'thumbnail',
          'category',
          'isActive',
        ],
      },
    },

    /* ── Quotations ────────────────────────────────── */
    PortalQuotation: {
      toString: (q) => q.quotationNo ?? q.id,
      title: 'Quotations',
      icon: 'DocumentTextIcon',
      list: {
        display: [
          'id',
          'quotationNo',
          'customer',
          'title',
          'total',
          'status',
          'validUntil',
          'createdAt',
        ],
        search: ['quotationNo', 'title'],
      },
      edit: {
        display: [
          'quotationNo',
          'customer',
          'title',
          'description',
          'validUntil',
          'subtotal',
          'discount',
          'total',
          'status',
          'bankDetails',
          'notes',
          'internalNotes',
        ],
      },
    },

    /* ── Quotation Items ───────────────────────────── */
    PortalQuotationItem: {
      toString: (item) => item.name ?? item.id,
      title: 'Quotation Items',
      icon: 'ListBulletIcon',
      list: {
        display: ['id', 'quotation', 'product', 'name', 'quantity', 'unitPrice', 'totalPrice'],
        search: ['name'],
      },
      edit: {
        display: ['quotation', 'product', 'name', 'description', 'quantity', 'unitPrice', 'totalPrice'],
      },
    },

    /* ── Orders ────────────────────────────────────── */
    PortalOrder: {
      toString: (o) => o.orderNo ?? o.id,
      title: 'Orders',
      icon: 'ShoppingCartIcon',
      list: {
        display: [
          'id',
          'orderNo',
          'customer',
          'quotation',
          'status',
          'total',
          'depositRequired',
          'depositPaid',
          'createdAt',
        ],
        search: ['orderNo'],
      },
      edit: {
        display: [
          'orderNo',
          'customer',
          'quotation',
          'status',
          'subtotal',
          'discount',
          'total',
          'depositRequired',
          'depositPaid',
          'deliveryAddress',
          'expectedDelivery',
          'deliveredAt',
          'notes',
        ],
      },
    },

    /* ── Payments ──────────────────────────────────── */
    PortalPayment: {
      toString: (p) => `${p.type} — ${p.amount}`,
      title: 'Payments',
      icon: 'CreditCardIcon',
      list: {
        display: ['id', 'order', 'type', 'amount', 'method', 'status', 'confirmedAt', 'createdAt'],
        search: ['bankRef'],
      },
      edit: {
        display: [
          'order',
          'type',
          'amount',
          'method',
          'status',
          'confirmedAt',
          'confirmedBy',
          'bankRef',
          'receiptUrl',
          'notes',
        ],
      },
    },

    /* ── Deliveries ────────────────────────────────── */
    PortalDelivery: {
      toString: (d) => d.trackingNo ?? d.id,
      title: 'Deliveries',
      icon: 'TruckIcon',
      list: {
        display: ['id', 'order', 'trackingNo', 'carrier', 'status', 'createdAt'],
        search: ['trackingNo', 'carrier'],
      },
      edit: {
        display: ['order', 'trackingNo', 'carrier', 'status', 'items', 'notes'],
      },
    },

    /* ── Inquiries ─────────────────────────────────── */
    PortalInquiry: {
      toString: (inq) => `${inq.name} — ${inq.subject}`,
      title: 'Inquiries',
      icon: 'EnvelopeIcon',
      list: {
        display: ['id', 'name', 'email', 'company', 'subject', 'status', 'createdAt'],
        search: ['name', 'email', 'subject', 'company'],
      },
      edit: {
        display: [
          'customer',
          'name',
          'email',
          'phone',
          'company',
          'subject',
          'message',
          'productSlug',
          'status',
        ],
      },
    },
  },

  sidebar: {
    groups: [
      {
        title: 'Catalog',
        models: ['PortalProductCategory', 'PortalProduct', 'PortalDemo'],
      },
      {
        title: 'Sales',
        models: ['PortalQuotation', 'PortalQuotationItem', 'PortalOrder'],
      },
      {
        title: 'Finance & Logistics',
        models: ['PortalPayment', 'PortalDelivery'],
      },
      {
        title: 'CRM',
        models: ['PortalCustomer', 'PortalInquiry'],
      },
    ],
  },

  externalLinks: [
    { url: '/zh/admin', label: 'Back to Dashboard' },
    { url: '/zh', label: 'View Site' },
  ],
};

/** Base path for the next-admin UI pages */
export const ADMIN_BASE_PATH = '/panel';

/** Base path for the next-admin API handler */
export const ADMIN_API_BASE_PATH = '/api/panel';
