import type { Product } from "@/lib/types"
import { ProductCard } from "@/components/storefront/product-card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProductGrid({
  products,
  savedIds,
  showSpecs = true,
}: {
  products: Product[]
  savedIds?: Set<string>
  showSpecs?: boolean
}) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          saved={savedIds?.has(p.id)}
          showSpecs={showSpecs}
        />
      ))}
    </div>
  )
}

export function ProductGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-[20px] border border-steel-200 bg-card p-3">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="space-y-2 px-1 pt-3 pb-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}
