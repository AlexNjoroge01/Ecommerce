import type { MetadataRoute } from "next"
import { SITE } from "@/lib/site"
import { getCategories, getBrands, getFilteredProducts } from "@/lib/queries"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url
  const products = getFilteredProducts({ perPage: 1000 }).items
  const staticPages = ["", "/search", "/about", "/contact", "/blog", "/returns", "/warranty", "/privacy"]

  return [
    ...staticPages.map((p) => ({
      url: `${base}${p || "/"}`,
      changeFrequency: (p === "" ? "daily" : "weekly") as "daily" | "weekly",
      priority: p === "" ? 1 : 0.6,
    })),
    ...getCategories().map((c) => ({
      url: `${base}/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...getBrands().map((b) => ({
      url: `${base}/brands/${b.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...products.map((p) => ({
      url: `${base}/product/${p.slug}`,
      lastModified: new Date(p.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ]
}
