# Atlas Labs E-Store

A full-featured, SEO-first e-commerce platform for electronics retail, built to the
[Blueprint.md](./Blueprint.md) spec and [Design.md](./Design.md) design system.

**Stack:** Next.js 16 (App Router, Server Actions, RSC) · TypeScript (strict) ·
Tailwind CSS v4 · shadcn/ui (radix-maia) · Drizzle ORM + Neon Postgres ·
Zod · React Hook Form · Sonner · bcryptjs + jose sessions · hugeicons.

## Getting started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000. **No database or API keys are required to run** — the
storefront reads a typed seed catalog (`lib/catalog.ts`) and keeps cart/wishlist/
orders in cookies + in-memory stores. Set `DATABASE_URL` (see `.env.example`) to
point the data layer at Neon; the Drizzle schema in `drizzle/schema/` is
migration-ready via `pnpm exec drizzle-kit generate && ... migrate`.

## Sign in (passwordless magic links)

Enter your email on `/login` → we email a one-time sign-in link (via Resend) that
lands on `/auth/verify`, creates/looks up your user in the Neon `users` table, and
starts a session. Links are single-use, hashed in `magic_links`, and expire in 15
minutes. Users are created on first sign-in — no password, no separate registration.

- **Admin access:** set `ADMIN_EMAILS` (comma-separated) in `.env` to the emails
  that should get the dark operator panel at `/admin` (RBAC-gated in `proxy.ts`).
  Add your own email there, then sign in with it.
- **Email delivery:** the default `EMAIL_FROM` uses Resend's `onboarding@resend.dev`,
  which only delivers to your Resend account's own address. To email anyone, verify
  a domain in Resend and set `EMAIL_FROM` to an address on it.
- **Local dev:** if email can't be delivered, the sign-in link is printed to the
  server console **and** shown as an "Open sign-in link" button on the check-inbox
  screen, so you can always complete sign-in without a mailbox.
- Set a real `SESSION_SECRET` in `.env` (falls back to a dev default otherwise).

## Database

`DATABASE_URL` (Neon) is wired for auth. Apply the schema with
`pnpm exec drizzle-kit generate && pnpm exec drizzle-kit migrate`. The storefront
catalog still reads the seed data (`lib/catalog.ts`); auth (`users`, `magic_links`)
uses Neon. Without `DATABASE_URL`, auth falls back to an in-memory store.

## Demo coupons

- `ATLAS10` — 10% off any order
- `WELCOME5000` — KES 5,000 off orders over KES 50,000

## What's implemented

- **Storefront:** aurora hero homepage, category/brand listings with URL-driven
  filters + sort + facet counts, PDP (gallery, variant selector, Spec Strip,
  tabs, reviews, related), instant search (⌘K), cart, coupon, multi-step
  checkout, order confirmation, wishlist, compare table, account area, blog, CMS
  pages.
- **Payments:** M-Pesa STK push (`lib/mpesa.ts` + `/api/mpesa/*`), simulated
  without Daraja credentials; card/bank/COD paths.
- **Admin:** dark shell, KPI dashboard + revenue chart, products/orders/inventory
  tables, categories/coupons/customers/reports.
- **SEO:** per-route metadata, JSON-LD (Product, Breadcrumb, Organization,
  SearchAction, FAQ), `sitemap.ts`, `robots.ts`, `manifest.ts`, dynamic OG images.
- **Design system:** Atlas tokens (frost/glacier/ink/cyan/cobalt/mint) on Tailwind
  v4, pill buttons, IBM Plex Mono for all data, the signature Spec Strip.

## Substitutions from the blueprint

- Fonts: Clash Display / Satoshi (Fontshare) → Space Grotesk / Inter via
  `next/font/google` (offline-safe); IBM Plex Mono as specified.
- Icons: hugeicons (project default) instead of lucide.
- `bcrypt` → `bcryptjs` (pure-JS, no native build on Windows).
- Next 16 renamed `middleware` → `proxy` (`proxy.ts`).

## Scripts

```bash
pnpm dev         # start dev server
pnpm build       # production build
pnpm typecheck   # tsc --noEmit
pnpm lint        # eslint
```
