import type { Metadata } from "next"
import Link from "next/link"
import { getCompareIds } from "@/lib/cart"
import { getProductById } from "@/lib/queries"
import { ProductMedia } from "@/components/storefront/product-media"
import { Price } from "@/components/storefront/price"
import { RatingStars } from "@/components/storefront/rating-stars"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/shared/icon"
import type { Product } from "@/lib/types"

export const metadata: Metadata = { title: "Compare", robots: { index: false } }

export default async function ComparePage() {
  const ids = await getCompareIds()
  const products = ids.map(getProductById).filter(Boolean) as Product[]

  if (products.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-6 py-24 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-glacier">
          <Icon name="compare" className="size-8 text-steel-500" />
        </span>
        <h1 className="font-display text-2xl font-semibold">Nothing to compare yet</h1>
        <p className="text-muted-foreground">
          Add up to four products with the Compare button to see them side by side.
        </p>
        <Button asChild size="lg">
          <Link href="/fashion">Browse products</Link>
        </Button>
      </div>
    )
  }

  // Union of spec keys across compared products (Design.md §2 — tick divider = column rule)
  const specKeys: { key: string; label: string }[] = []
  const seen = new Set<string>()
  for (const p of products) {
    for (const s of p.specs) {
      if (!seen.has(s.key)) {
        seen.add(s.key)
        specKeys.push({ key: s.key, label: s.label })
      }
    }
  }

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-8 lg:px-12">
      <h1 className="mb-8 font-display text-3xl font-semibold tracking-tight">Compare</h1>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr>
              <th className="w-40" />
              {products.map((p) => (
                <th key={p.id} className="border-l border-steel-200 p-4 text-left align-top">
                  <Link href={`/product/${p.slug}`}>
                    <ProductMedia
                      tone={p.images[0]?.url ?? "steel"}
                      categorySlug={p.categorySlug}
                      className="mb-3 aspect-square w-full max-w-[160px]"
                      iconClassName="size-1/2"
                    />
                    <span className="font-display text-sm font-medium hover:text-cyan">
                      {p.title}
                    </span>
                  </Link>
                  <div className="mt-2">
                    <Price regular={p.regularPrice} sale={p.salePrice} size="sm" />
                  </div>
                  <div className="mt-1">
                    <RatingStars rating={p.rating} count={p.reviewCount} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="font-mono text-sm">
            {specKeys.map(({ key, label }, i) => (
              <tr key={key} className={i % 2 ? "bg-glacier/40" : ""}>
                <td className="p-3 text-xs tracking-[0.06em] text-steel-500 uppercase">
                  {label}
                </td>
                {products.map((p) => {
                  const spec = p.specs.find((s) => s.key === key)
                  return (
                    <td key={p.id} className="border-l border-steel-200 p-3">
                      {spec ? `${spec.value}${spec.unit ? ` ${spec.unit}` : ""}` : "—"}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
