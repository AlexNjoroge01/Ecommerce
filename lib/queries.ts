import "server-only"
import { brands, categories, products, reviews } from "@/lib/catalog"
import type { Product, Review } from "@/lib/types"

/*
  Read-side data access. Today this reads the seed catalog (lib/catalog.ts) so
  the storefront runs with zero external setup. Each function is the seam where
  a Drizzle/Neon query drops in when DATABASE_URL is configured — signatures stay
  identical, so no page changes are needed (Blueprint §8 upgrade path).
*/

const VAT_RATE = 0.16

export function getCategories() {
  return [...categories].sort((a, b) => a.sortOrder - b.sortOrder)
}

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug) ?? null
}

export function getBrands() {
  return brands
}

export function getBrandBySlug(slug: string) {
  return brands.find((b) => b.slug === slug) ?? null
}

export function getProductBySlug(slug: string): Product | null {
  return products.find((p) => p.slug === slug) ?? null
}

export function getProductById(id: string): Product | null {
  return products.find((p) => p.id === id) ?? null
}

export function getFeaturedProducts(limit = 8) {
  return products.filter((p) => p.isFeatured).slice(0, limit)
}

export function getTrendingProducts(limit = 8) {
  return products.filter((p) => p.isTrending).slice(0, limit)
}

export function getFlashSaleProducts(limit = 6) {
  return products.filter((p) => p.salePrice).slice(0, limit)
}

export function getReviewsForProduct(productId: string): Review[] {
  return reviews.filter((r) => r.productId === productId)
}

export function getRelatedProducts(product: Product, limit = 4) {
  return products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.categorySlug === product.categorySlug || p.brandSlug === product.brandSlug)
    )
    .slice(0, limit)
}

export type SortKey =
  | "popular"
  | "latest"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "discount"

export interface FilterParams {
  categorySlug?: string
  brandSlug?: string
  query?: string
  brands?: string[]
  minPrice?: number
  maxPrice?: number
  conditions?: string[]
  minRating?: number
  inStockOnly?: boolean
  discountOnly?: boolean
  specs?: Record<string, string[]>
  sort?: SortKey
  page?: number
  perPage?: number
}

function effectivePrice(p: Product) {
  return p.salePrice ?? p.regularPrice
}

export interface FacetCount {
  value: string
  label: string
  count: number
}

export interface FilterResult {
  items: Product[]
  total: number
  page: number
  perPage: number
  pageCount: number
  facets: {
    brands: FacetCount[]
    conditions: FacetCount[]
    priceBounds: { min: number; max: number }
  }
}

export function getFilteredProducts(params: FilterParams): FilterResult {
  const perPage = params.perPage ?? 12
  const page = Math.max(1, params.page ?? 1)

  const queryIds = params.query
    ? new Set(searchProducts(params.query, 100).map((p) => p.id))
    : null

  let pool = products.filter((p) => {
    if (params.categorySlug && p.categorySlug !== params.categorySlug) return false
    if (params.brandSlug && p.brandSlug !== params.brandSlug) return false
    if (queryIds && !queryIds.has(p.id)) return false
    return true
  })

  // Facets computed on the category-scoped pool (before user filters narrow it)
  const brandFacets: FacetCount[] = getBrands()
    .map((b) => ({
      value: b.slug,
      label: b.name,
      count: pool.filter((p) => p.brandSlug === b.slug).length,
    }))
    .filter((f) => f.count > 0)

  const conditionLabels: Record<string, string> = {
    new: "New",
    refurbished: "Refurbished",
    used: "Used",
  }
  const conditionFacets: FacetCount[] = (["new", "refurbished", "used"] as const)
    .map((c) => ({
      value: c,
      label: conditionLabels[c],
      count: pool.filter((p) => p.condition === c).length,
    }))
    .filter((f) => f.count > 0)

  const prices = pool.map(effectivePrice)
  const priceBounds = {
    min: prices.length ? Math.min(...prices) : 0,
    max: prices.length ? Math.max(...prices) : 0,
  }

  // Apply user filters
  let items = pool.filter((p) => {
    if (params.brands?.length && !params.brands.includes(p.brandSlug)) return false
    if (params.conditions?.length && !params.conditions.includes(p.condition)) return false
    if (params.minPrice != null && effectivePrice(p) < params.minPrice) return false
    if (params.maxPrice != null && effectivePrice(p) > params.maxPrice) return false
    if (params.minRating != null && p.rating < params.minRating) return false
    if (params.inStockOnly && p.stockStatus === "out_of_stock") return false
    if (params.discountOnly && !p.salePrice) return false
    if (params.specs) {
      for (const [key, values] of Object.entries(params.specs)) {
        if (!values.length) continue
        const spec = p.specs.find((s) => s.key === key)
        if (!spec || !values.includes(spec.value)) return false
      }
    }
    return true
  })

  // Sort
  const sort = params.sort ?? "popular"
  items = [...items].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return effectivePrice(a) - effectivePrice(b)
      case "price-desc":
        return effectivePrice(b) - effectivePrice(a)
      case "rating":
        return b.rating - a.rating
      case "latest":
        return b.createdAt.localeCompare(a.createdAt)
      case "discount": {
        const da = a.salePrice ? (a.regularPrice - a.salePrice) / a.regularPrice : 0
        const db = b.salePrice ? (b.regularPrice - b.salePrice) / b.regularPrice : 0
        return db - da
      }
      default:
        return b.reviewCount - a.reviewCount
    }
  })

  const total = items.length
  const pageCount = Math.max(1, Math.ceil(total / perPage))
  const start = (page - 1) * perPage
  const paged = items.slice(start, start + perPage)

  return {
    items: paged,
    total,
    page,
    perPage,
    pageCount,
    facets: { brands: brandFacets, conditions: conditionFacets, priceBounds },
  }
}

export function searchProducts(query: string, limit = 20): Product[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const terms = q.split(/\s+/)
  const scored = products
    .map((p) => {
      const haystack = `${p.title} ${p.brandSlug} ${p.categorySlug} ${p.description}`.toLowerCase()
      let score = 0
      for (const t of terms) {
        if (p.title.toLowerCase().includes(t)) score += 5
        else if (haystack.includes(t)) score += 2
      }
      return { p, score }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
  return scored.slice(0, limit).map((x) => x.p)
}

export function getPopularSearches() {
  return ["cotton tee", "sofa", "coffee beans", "earbuds", "yoga mat", "serum"]
}

export { VAT_RATE }
