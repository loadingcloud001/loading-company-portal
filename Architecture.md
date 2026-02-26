# Loading Technology Company Portal — Architecture

## Overview

A bilingual (English/Traditional Chinese) B2B company portal for Loading Technology Company Limited (裝載科技有限公司), supplying IoT safety and monitoring systems for the Hong Kong construction industry.

---

## Live Environment

| Item | Value |
|------|-------|
| **Production URL** | https://loading-company-portal-mheny.ondigitalocean.app |
| **Default locale** | `zh` (Traditional Chinese) |
| **Platform** | DigitalOcean App Platform (SGP — Singapore) |
| **Plan** | `apps-s-1vcpu-0.5gb` |
| **Auto-deploy** | On push to `main` branch |
| **GitHub Repo** | https://github.com/loadingcloud001/loading-company-portal |

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS v4 | 4.x |
| Internationalisation | next-intl | 4.x |
| ORM | Prisma | 6.x |
| Database | Supabase PostgreSQL | — |
| Auth | Custom JWT-style cookie sessions | — |
| Animations | Framer Motion | — |
| Component variants | class-variance-authority (cva) | — |
| Class utilities | clsx + tailwind-merge | — |
| Icons | lucide-react | — |
| PDF generation | jsPDF / html2canvas | — |

---

## Database

| Item | Value |
|------|-------|
| Provider | Supabase (Tokyo — ap-northeast-1) |
| Project ID | `ptmiancqhjymalbzdcnu` |
| Pooler URL | `aws-1-ap-northeast-1.pooler.supabase.com:6543` (PgBouncer) |
| Direct URL | `aws-1-ap-northeast-1.pooler.supabase.com:5432` |
| Password | `LoadingPortal2026Sec` |

### Schema Tables

| Table | Purpose |
|-------|---------|
| `PortalCustomer` | Customers + admin users (`role: customer | admin`) |
| `ProductCategory` | 6 product categories (smart-helmet, proximity-alert, etc.) |
| `Product` | Individual products with pricing, specs, images |
| `Quotation` | Customer quotations (draft → sent → accepted/rejected) |
| `QuotationItem` | Line items on each quotation |
| `Order` | Customer orders converted from quotations |
| `OrderItem` | Line items on each order |
| `Payment` | Payment records against orders |
| `Delivery` | Delivery details per order |
| `Inquiry` | Contact form submissions |
| `Demo` | Demo environments (iframe or external URL) |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout (fonts, global metadata)
│   ├── globals.css                   # Design tokens + global styles
│   ├── sitemap.ts                    # Auto-generated sitemap.xml
│   ├── robots.ts                     # robots.txt
│   ├── api/                          # API route handlers
│   │   ├── auth/{login,logout,register,check}/
│   │   ├── products/
│   │   ├── quotations/{[id],pdf}/
│   │   ├── orders/{[id]}/
│   │   ├── inquiries/
│   │   └── admin/customers/
│   └── [locale]/                     # next-intl locale segment (zh | en)
│       ├── layout.tsx                # Provides NextIntlClientProvider only
│       ├── (public)/                 # Public pages — wrapped with Nav + Footer
│       │   ├── layout.tsx
│       │   ├── page.tsx              # Home page
│       │   ├── about/
│       │   ├── products/{[slug]}/
│       │   ├── demos/
│       │   ├── contact/
│       │   ├── privacy/
│       │   └── terms/
│       ├── (auth)/                   # Authenticated customer dashboard
│       │   ├── layout.tsx            # Sidebar nav + auth check (redirects to /login)
│       │   ├── dashboard/
│       │   ├── quotations/{[id]}/
│       │   └── orders/{[id]}/
│       ├── admin/                    # Admin panel (role=admin required)
│       │   ├── layout.tsx            # Responsive sidebar + role check
│       │   ├── page.tsx
│       │   ├── products/
│       │   ├── customers/
│       │   ├── quotations/
│       │   └── orders/
│       ├── login/
│       └── register/
│
├── components/
│   ├── layout/
│   │   ├── PublicNav.tsx             # Top navigation bar (public pages)
│   │   ├── Footer.tsx                # 4-column footer
│   │   └── LanguageSwitcher.tsx      # EN/ZH toggle
│   ├── ui/                           # Reusable primitives (cva + cn pattern)
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx                 # Also exports Textarea
│   │   ├── Select.tsx
│   │   └── Modal.tsx
│   ├── motion/
│   │   └── index.tsx                 # Framer Motion wrappers (FadeInUp, Counter, etc.)
│   ├── demos/
│   │   ├── DemoCard.tsx
│   │   └── DemoModal.tsx
│   └── products/
│       └── ProductCard.tsx
│
├── i18n/
│   ├── routing.ts                    # Locales config (zh default, en)
│   ├── request.ts                    # Server-side i18n request config
│   └── navigation.ts                 # Typed Link/useRouter/usePathname
│
└── lib/
    ├── auth.ts                       # Session cookie helpers
    ├── prisma.ts                     # Prisma client singleton
    └── utils.ts                      # cn() — clsx + tailwind-merge

messages/
├── en.json                           # English translations (~312 keys)
└── zh.json                           # Traditional Chinese translations (~312 keys)

prisma/
├── schema.prisma                     # Database schema
├── seed.ts                           # Seed data (admin user + product catalogue)
└── migrations/                       # SQL migration history

public/
├── logo.svg                          # Blue logo (for light backgrounds)
├── logo-white.svg                    # White logo (for dark backgrounds)
├── favicon.svg                       # 32×32 LT favicon
└── images/                           # Unsplash photos (CC0/free license)
```

---

## Authentication

- Session stored in an HTTP-only cookie `session` (JSON signed value)
- Helper: `src/lib/auth.ts` — `getSession()`, `createSession()`, `destroySession()`
- Customer middleware: `(auth)/layout.tsx` — fetches `/api/auth/check`, redirects to `/login` if 401
- Admin middleware: `admin/layout.tsx` — same check, additionally validates `role === 'admin'`

### Default Accounts (from seed)

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@loadingtechnology.com | `admin123` |

---

## Design System

| Token | Value |
|-------|-------|
| `--color-primary` | `#1e40af` (Blue 700) |
| `--color-primary-dark` | `#1e3a8a` (Blue 800) |
| `--color-secondary` | `#f59e0b` (Amber 400) |
| `--color-background` | `#ffffff` |
| `--color-foreground` | `#0f172a` (Slate 900) |
| `--color-muted` | `#f1f5f9` (Slate 100) |
| `--color-border` | `#e2e8f0` (Slate 200) |
| `--color-card` | `#ffffff` |
| `--color-ring` | `#3b82f6` (Blue 500) |
| `--color-destructive` | `#ef4444` (Red 500) |

All colour values live in `src/app/globals.css` inside `@layer base`.

---

## Internationalisation

- Library: `next-intl` v4
- Supported locales: `zh` (default), `en`
- URL pattern: `/{locale}/...` (e.g. `/zh/about`, `/en/about`)
- Root `/` redirects to `/zh` via middleware (`src/middleware.ts`)
- Translation files: `messages/en.json`, `messages/zh.json`
- Server usage: `getTranslations({ locale, namespace })` in Server Components
- Client usage: `useTranslations('namespace')` hook

---

## Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env .env.local   # already configured

# Push schema to database
npx prisma db push

# Seed database
npx tsx prisma/seed.ts

# Generate Prisma client
npx prisma generate

# Start dev server
npm run dev
# → http://localhost:3000
```

---

## Deployment

DigitalOcean App Platform build command (from `.do/app.yaml`):

```bash
npm install --include=dev && npx prisma generate && npm run build
```

Start command: `npm run start`

Environment variables set in DigitalOcean dashboard:
- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_APP_URL`

Push to `main` branch → auto-deploy triggers automatically.

---

## API Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/login` | — | Login, sets session cookie |
| POST | `/api/auth/logout` | — | Clears session cookie |
| POST | `/api/auth/register` | — | Register new customer |
| GET | `/api/auth/check` | Session | Returns current user info |
| GET | `/api/products` | — | List all published products |
| GET | `/api/quotations` | Customer | List own quotations |
| GET | `/api/quotations/[id]` | Customer | Get quotation detail |
| PATCH | `/api/quotations/[id]` | Customer | Accept/reject quotation |
| GET | `/api/quotations/[id]/pdf` | Customer | Download PDF |
| GET | `/api/orders` | Customer | List own orders |
| GET | `/api/orders/[id]` | Customer | Get order detail |
| POST | `/api/inquiries` | — | Submit contact form |
| GET | `/api/admin/customers` | Admin | List all customers |

---

*Last updated: February 2026*
