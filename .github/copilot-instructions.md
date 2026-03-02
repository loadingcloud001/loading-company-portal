# Loading Technology Company Portal — Copilot Instructions

## Architecture Overview

All services are deployed to **DigitalOcean cloud** — never on the local Ubuntu development machine. Infrastructure includes DigitalOcean Kubernetes Service (DOKS), DigitalOcean Managed PostgreSQL, and DigitalOcean Container Registry (DOCR).

Bilingual (EN/ZH Traditional Chinese) B2B portal built with **Next.js 16 App Router**, **TypeScript**, **Tailwind CSS v4**, **Prisma 6** + **Supabase PostgreSQL**, and **next-intl v4**.

Three route groups under `src/app/[locale]/`:
- `(public)/` — marketing pages with `PublicNav` + `Footer` (no auth)
- `(auth)/` — customer dashboard, quotations, orders (session cookie required)
- `admin/` — admin panel for managing products, customers, quotations, orders (role=admin required)

Auth is cookie-based (`portal-auth-token`) — see `src/lib/auth.ts` for `getAuthUser()`, `setAuthCookie()`, `clearAuthCookie()`. The `(auth)/layout.tsx` and `admin/layout.tsx` check auth client-side via `fetch('/api/auth/check')` and redirect to login.

## Key Conventions

### Local Machine vs Cloud
- The local Ubuntu PC is a **development workstation only** — used for coding, running `npm run dev`, and pushing images.
- **Never** run production services locally (no `docker-compose up` for production workloads).
- Always push container images to **DigitalOcean Container Registry (DOCR)** and deploy to the **DOKS cluster**.
- Never suggest running services locally — always deploy to the DOKS cluster.

### General
- **Avoid hardcoding values** — use environment variables, constants, translation keys, or config files instead of inline magic strings/numbers. For example, use design tokens from `globals.css` rather than raw colour hex values, and translation keys from `messages/` rather than literal UI text.
- **Business constants live in `src/lib/constants.ts`** — company name, contact details, business hours, and site-level defaults are all defined there. Import from `@/lib/constants` (`COMPANY`, `CONTACT`, `BUSINESS_HOURS`, `SITE`) — never hard-code these values elsewhere.
- **Keep `Architecture.md` up to date** — when adding new routes, models, API endpoints, or changing the project structure, update `Architecture.md` in the repo root to reflect the change.

### Internationalisation (next-intl)
- **Always** use `Link`, `useRouter`, `usePathname` from `@/i18n/navigation` — never from `next/link` or `next/navigation` directly. This ensures locale-aware routing.
- Locales: `zh` (default), `en`. Config in `src/i18n/routing.ts`.
- Server Components: `getTranslations({ locale, namespace })` + `setRequestLocale(locale)`.
- Client Components: `useTranslations('namespace')`.
- Translation keys live in `messages/en.json` and `messages/zh.json` — keep both files in sync when adding keys.
- All Prisma models with user-facing text have dual fields: `name`/`nameZh`, `description`/`descriptionZh`, etc.

### UI Components & Styling
- Tailwind v4 with design tokens in `src/app/globals.css` (`@theme inline` block) — use `primary`, `primary-dark`, `secondary`, `muted`, `destructive`, etc.
- UI primitives in `src/components/ui/` use **cva** (class-variance-authority) + `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge).
- Pattern: `const variants = cva(base, { variants: {...} })` then spread into component. See `src/components/ui/Button.tsx` as the canonical example.
- Icons: `lucide-react` exclusively.
- Animations: use wrapper components from `src/components/motion/index.tsx` (`FadeInUp`, `FadeIn`, `SlideInLeft`, etc.) — these are `'use client'` components using Framer Motion.

### API Routes
- All in `src/app/api/` — use `NextRequest`/`NextResponse` pattern.
- Auth check: call `getAuthUser(request)` — pass the `NextRequest` object in API routes.
- Standard response shape: `{ success: true, data }` or `{ error: 'message' }`.
- Prisma models are prefixed with `Portal` (e.g., `PortalCustomer`, `PortalProduct`) mapping to `portal_` tables.

### Database (Prisma)
- Singleton client in `src/lib/prisma.ts` — import as `import { prisma } from '@/lib/prisma'`.
- Schema in `prisma/schema.prisma`. Uses Supabase PostgreSQL with connection pooling (`DATABASE_URL`) and direct connection (`DIRECT_URL`).
- Seed: `npx tsx prisma/seed.ts`. Migrations: `npx prisma migrate dev`.

## Development Workflow

```bash
npm install                  # Install deps
npx prisma generate          # Generate Prisma client (required after schema changes)
npx prisma migrate dev       # Run migrations
npx tsx prisma/seed.ts       # Seed DB (admin user + product catalogue)
npm run dev                  # Start dev server → http://localhost:3000 (redirects to /zh)
npm run lint                 # ESLint (flat config)
npm run build                # Production build (includes prisma generate)
```

## Deployment (DigitalOcean Cloud)

All deployment targets the **DOKS (DigitalOcean Kubernetes Service)** cluster — never run production workloads on the local machine.

1. Build and push container images to **DOCR** (DigitalOcean Container Registry).
2. Deploy to the DOKS cluster via Kubernetes manifests or Helm charts.
3. Database is **DigitalOcean Managed PostgreSQL** (accessed via Supabase connection pooling).
4. Environment variables (`DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_APP_URL`) are set in cluster secrets / DigitalOcean dashboard.
5. Push to `main` branch triggers CI/CD pipeline for auto-deploy.

## File Patterns to Follow

| Task | Reference file |
|------|---------------|
| New UI component with variants | `src/components/ui/Button.tsx` |
| New public page | `src/app/[locale]/(public)/about/page.tsx` |
| New authenticated page | `src/app/[locale]/(auth)/dashboard/page.tsx` |
| New API route with auth | `src/app/api/quotations/route.ts` |
| New animation wrapper | `src/components/motion/index.tsx` |
| Adding translations | `messages/en.json` + `messages/zh.json` (keep in sync) |
