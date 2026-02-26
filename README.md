# Loading Technology Company Portal

Bilingual (EN/ZH) B2B company portal for **Loading Technology Company Limited (裝載科技有限公司)** — supplying IoT safety and monitoring systems for the Hong Kong construction industry.

## Live Site

**https://loading-company-portal-4wru2.ondigitalocean.app**

> Default language is Traditional Chinese (`/zh`). Switch to English via the language toggle or navigate to `/en`.

## Tech Stack

- **Next.js 16** (App Router, React 19, TypeScript)
- **Tailwind CSS v4** — custom blue/slate design system
- **next-intl v4** — EN / ZH Traditional Chinese i18n
- **Prisma 6** + **Supabase PostgreSQL** (Tokyo region)
- **Framer Motion** — scroll-triggered animations
- **DigitalOcean App Platform** (SGP region) — auto-deploys on push to `main`

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npx prisma generate

# 3. Seed database (admin user + sample product catalogue)
npx tsx prisma/seed.ts

# 4. Start dev server
npm run dev
# → http://localhost:3000  (auto-redirects to /zh)
```

## Default Accounts

| Role  | Email                       | Password   |
|-------|-----------------------------|------------|
| Admin | admin@loadingtechnology.com | `admin123` |

Register new customer accounts at `/register`.  
Admin panel is at `/admin` — requires `role: admin` on the account.

## Project Structure

See [Architecture.md](./Architecture.md) for the full system architecture, database schema, API routes, and design system reference.

## Pages

| URL | Description |
|-----|-------------|
| `/` | Home — redirects to `/zh` |
| `/{locale}` | Home page (hero, stats, products, FAQ, CTA) |
| `/{locale}/about` | About page (mission, services, timeline) |
| `/{locale}/products` | Product catalogue with category filters |
| `/{locale}/products/{slug}` | Product detail page |
| `/{locale}/demos` | Live demo environments |
| `/{locale}/contact` | Contact form + info |
| `/{locale}/privacy` | Privacy policy |
| `/{locale}/terms` | Terms of service |
| `/{locale}/login` | Customer login |
| `/{locale}/register` | Customer registration |
| `/{locale}/dashboard` | Customer dashboard (auth required) |
| `/{locale}/quotations` | My quotations (auth required) |
| `/{locale}/orders` | My orders (auth required) |
| `/{locale}/admin` | Admin dashboard (admin role required) |

## Deployment

Push to `main` → DigitalOcean App Platform auto-deploys using:

```bash
npm install --include=dev && npx prisma generate && npm run build
```

Environment variables (`DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_APP_URL`) are configured in the DigitalOcean App Platform dashboard.
