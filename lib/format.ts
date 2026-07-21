import { SITE } from "@/lib/site"

/** Format a KES amount. Prices render in mono (Design.md §1.2) at the call site. */
export function formatPrice(value: number | string): string {
  const n = typeof value === "string" ? Number(value) : value
  return new Intl.NumberFormat(SITE.locale, {
    style: "currency",
    currency: SITE.currency,
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat(SITE.locale).format(value)
}

export function formatDate(value: Date | string): string {
  const d = typeof value === "string" ? new Date(value) : value
  return new Intl.DateTimeFormat(SITE.locale, {
    dateStyle: "medium",
  }).format(d)
}

export function discountPercent(regular: number, sale?: number | null): number | null {
  if (!sale || sale >= regular) return null
  return Math.round(((regular - sale) / regular) * 100)
}

/** ATL-2026-8F3K style order numbers, deterministic from a seed. */
export function formatOrderNumber(seed: string): string {
  const clean = seed.replace(/[^a-z0-9]/gi, "").toUpperCase()
  return `ATL-${clean.slice(0, 4)}-${clean.slice(4, 8)}`
}
