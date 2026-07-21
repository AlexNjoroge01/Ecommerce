import { SITE } from "@/lib/site"
import type { Product } from "@/lib/types"

/*
  JSON-LD builders (Blueprint §19.2). Each returns a plain object injected via a
  <script type="application/ld+json"> tag (see components/shared/json-ld.tsx).
*/

export function buildProductSchema(
  product: Product,
  opts: { avgRating: number; reviewCount: number }
) {
  const price = product.salePrice ?? product.regularPrice
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    sku: product.sku,
    brand: { "@type": "Brand", name: product.brandSlug },
    offers: {
      "@type": "Offer",
      priceCurrency: SITE.currency,
      price: String(price),
      availability:
        product.stockStatus === "out_of_stock"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      url: `${SITE.url}/product/${product.slug}`,
      itemCondition:
        product.condition === "new"
          ? "https://schema.org/NewCondition"
          : product.condition === "refurbished"
            ? "https://schema.org/RefurbishedCondition"
            : "https://schema.org/UsedCondition",
    },
    aggregateRating:
      opts.reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: opts.avgRating,
            reviewCount: opts.reviewCount,
          }
        : undefined,
  }
}

export function buildBreadcrumbSchema(crumbs: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE.url}${c.url}`,
    })),
  }
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.legalName,
    url: SITE.url,
    description: SITE.description,
  }
}

export function buildSearchActionSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: SITE.url,
    name: SITE.name,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }
}

export function buildFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  }
}
