"use server"

import { searchProducts } from "@/lib/queries"

export interface SearchHit {
  title: string
  slug: string
  brand: string
  price: number
  tone: string
}

export async function instantSearchAction(query: string): Promise<SearchHit[]> {
  const results = searchProducts(query, 6)
  return results.map((p) => ({
    title: p.title,
    slug: p.slug,
    brand: p.brandSlug,
    price: p.salePrice ?? p.regularPrice,
    tone: p.images[0]?.url ?? "steel",
  }))
}
