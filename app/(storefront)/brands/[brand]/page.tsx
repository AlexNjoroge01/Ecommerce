import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getBrandBySlug, getBrands, getFilteredProducts } from "@/lib/queries"
import { getWishlistIds } from "@/lib/cart"
import { parseFilterParams, hasActiveFacets, type RawParams } from "@/lib/search-params"
import { Breadcrumbs } from "@/components/storefront/breadcrumbs"
import { ProductBrowser } from "@/components/storefront/product-browser"
import { ProductGrid } from "@/components/storefront/product-grid"
import { JsonLd } from "@/components/shared/json-ld"
import { buildBreadcrumbSchema } from "@/lib/seo"
import { Icon } from "@/components/shared/icon"

export function generateStaticParams() {
  return getBrands().map((b) => ({ brand: b.slug }))
}

type Props = {
  params: Promise<{ brand: string }>
  searchParams: Promise<RawParams>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand: slug } = await params
  const brand = getBrandBySlug(slug)
  if (!brand) return {}
  return {
    title: `${brand.name} — shop online in Kenya`,
    description: brand.description,
    alternates: { canonical: `/brands/${brand.slug}` },
  }
}

export default async function BrandPage({ params, searchParams }: Props) {
  const { brand: slug } = await params
  const raw = await searchParams
  const brand = getBrandBySlug(slug)
  if (!brand) notFound()

  const parsed = parseFilterParams(raw)
  const result = getFilteredProducts({ ...parsed, brandSlug: slug })
  const saved = new Set(await getWishlistIds())

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-8 lg:px-12">
      {hasActiveFacets(raw) && <meta name="robots" content="noindex,follow" />}
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Brands", url: "/brands" },
          { name: brand.name, url: `/brands/${brand.slug}` },
        ])}
      />

      <Breadcrumbs
        crumbs={[
          { name: "Brands", url: "/brands" },
          { name: brand.name, url: `/brands/${brand.slug}` },
        ]}
        className="mb-6"
      />

      <header className="mb-10 max-w-2xl">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {brand.name}
        </h1>
        <p className="mt-3 text-base text-muted-foreground">{brand.description}</p>
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
          basePath={`/brands/${slug}`}
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
