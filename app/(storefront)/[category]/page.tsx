import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCategoryBySlug, getCategories, getFilteredProducts } from "@/lib/queries"
import { getWishlistIds } from "@/lib/cart"
import { parseFilterParams, hasActiveFacets, type RawParams } from "@/lib/search-params"
import { Breadcrumbs } from "@/components/storefront/breadcrumbs"
import { ProductBrowser } from "@/components/storefront/product-browser"
import { ProductGrid } from "@/components/storefront/product-grid"
import { JsonLd } from "@/components/shared/json-ld"
import { buildBreadcrumbSchema } from "@/lib/seo"
import { Icon } from "@/components/shared/icon"

export function generateStaticParams() {
  return getCategories().map((c) => ({ category: c.slug }))
}

type Props = {
  params: Promise<{ category: string }>
  searchParams: Promise<RawParams>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) return {}
  return {
    title: `${category.name} — buy online in Kenya`,
    description: category.description,
    alternates: { canonical: `/${category.slug}` },
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category: slug } = await params
  const raw = await searchParams
  const category = getCategoryBySlug(slug)
  if (!category) notFound()

  const parsed = parseFilterParams(raw)
  const result = getFilteredProducts({ ...parsed, categorySlug: slug })
  const saved = new Set(await getWishlistIds())

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-8 lg:px-12">
      {hasActiveFacets(raw) && <meta name="robots" content="noindex,follow" />}
      <JsonLd data={buildBreadcrumbSchema([{ name: category.name, url: `/${category.slug}` }])} />

      <Breadcrumbs crumbs={[{ name: category.name, url: `/${category.slug}` }]} className="mb-6" />

      <header className="mb-10 max-w-2xl">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {category.name}
        </h1>
        <p className="mt-3 text-base text-muted-foreground">{category.description}</p>
      </header>

      {result.total === 0 ? (
        <EmptyState />
      ) : (
        <ProductBrowser
          facets={result.facets}
          params={parsed}
          total={result.total}
          page={result.page}
          pageCount={result.pageCount}
          basePath={`/${category.slug}`}
        >
          <ProductGrid products={result.items} savedIds={saved} />
        </ProductBrowser>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-steel-200 py-20 text-center">
      <Icon name="package" className="size-10 text-steel-200" />
      <p className="font-display text-lg font-medium">Nothing matches those filters</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        Try widening your price range or clearing a filter to see more.
      </p>
    </div>
  )
}
