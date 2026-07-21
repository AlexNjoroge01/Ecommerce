import type { Metadata } from "next"
import { getFilteredProducts, getPopularSearches } from "@/lib/queries"
import { getWishlistIds } from "@/lib/cart"
import { parseFilterParams, type RawParams } from "@/lib/search-params"
import { ProductBrowser } from "@/components/storefront/product-browser"
import { ProductGrid } from "@/components/storefront/product-grid"
import { Icon } from "@/components/shared/icon"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
}

type Props = { searchParams: Promise<RawParams> }

export default async function SearchPage({ searchParams }: Props) {
  const raw = await searchParams
  const q = (Array.isArray(raw.q) ? raw.q[0] : raw.q)?.trim() ?? ""
  const parsed = parseFilterParams(raw)
  const result = getFilteredProducts({ ...parsed, query: q || undefined })
  const saved = new Set(await getWishlistIds())

  const basePath = "/search"

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-8 lg:px-12">
      <header className="mb-10">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {q ? (
            <>
              Results for <span className="text-gradient-brand">“{q}”</span>
            </>
          ) : (
            "Search the catalog"
          )}
        </h1>
        {q && (
          <p className="mt-3 font-mono text-sm text-steel-500">
            {result.total} {result.total === 1 ? "match" : "matches"}
          </p>
        )}
      </header>

      {q && result.total === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-steel-200 py-20 text-center">
          <Icon name="search" className="size-10 text-steel-200" />
          <div>
            <p className="font-display text-lg font-medium">No results for “{q}”</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Check the spelling, or try a broader term. Popular right now:
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {getPopularSearches().map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="rounded-full border border-steel-200 px-4 py-1.5 text-sm hover:border-cyan"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <ProductBrowser
          facets={result.facets}
          params={parsed}
          total={result.total}
          page={result.page}
          pageCount={result.pageCount}
          basePath={basePath}
          q={q || undefined}
        >
          <ProductGrid products={result.items} savedIds={saved} />
        </ProductBrowser>
      )}
    </div>
  )
}
