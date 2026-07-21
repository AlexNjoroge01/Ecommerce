import type { FilterParams, SortKey } from "@/lib/queries"

export type RawParams = Record<string, string | string[] | undefined>

const SORTS: SortKey[] = [
  "popular",
  "latest",
  "price-asc",
  "price-desc",
  "rating",
  "discount",
]

export const SORT_LABELS: Record<SortKey, string> = {
  popular: "Most popular",
  latest: "Newest",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  rating: "Top rated",
  discount: "Biggest discount",
}

function toArray(v: string | string[] | undefined): string[] {
  if (!v) return []
  return Array.isArray(v) ? v : v.split(",").filter(Boolean)
}

export function parseFilterParams(raw: RawParams): FilterParams {
  const num = (v: string | string[] | undefined) => {
    const s = Array.isArray(v) ? v[0] : v
    const n = s != null ? Number(s) : NaN
    return Number.isFinite(n) ? n : undefined
  }
  const sortRaw = Array.isArray(raw.sort) ? raw.sort[0] : raw.sort
  return {
    brands: toArray(raw.brand),
    conditions: toArray(raw.condition),
    minPrice: num(raw.min),
    maxPrice: num(raw.max),
    minRating: num(raw.rating),
    inStockOnly: raw.stock === "1",
    discountOnly: raw.discount === "1",
    sort: SORTS.includes(sortRaw as SortKey) ? (sortRaw as SortKey) : "popular",
    page: num(raw.page) ?? 1,
  }
}

/** Serialize filter UI state to a query string (stable key order). */
export function buildQuery(state: {
  brands?: string[]
  conditions?: string[]
  minPrice?: number
  maxPrice?: number
  minRating?: number
  inStockOnly?: boolean
  discountOnly?: boolean
  sort?: SortKey
  page?: number
  q?: string
}): string {
  const p = new URLSearchParams()
  if (state.q) p.set("q", state.q)
  state.brands?.forEach((b) => p.append("brand", b))
  state.conditions?.forEach((c) => p.append("condition", c))
  if (state.minPrice != null) p.set("min", String(state.minPrice))
  if (state.maxPrice != null) p.set("max", String(state.maxPrice))
  if (state.minRating != null) p.set("rating", String(state.minRating))
  if (state.inStockOnly) p.set("stock", "1")
  if (state.discountOnly) p.set("discount", "1")
  if (state.sort && state.sort !== "popular") p.set("sort", state.sort)
  if (state.page && state.page > 1) p.set("page", String(state.page))
  const s = p.toString()
  return s ? `?${s}` : ""
}

/** True when query params beyond page/q are present — used to noindex facets (§19.3). */
export function hasActiveFacets(raw: RawParams): boolean {
  const keys = Object.keys(raw).filter((k) => raw[k] != null && raw[k] !== "")
  return keys.some((k) => !["page", "q"].includes(k))
}
