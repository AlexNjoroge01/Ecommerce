import { ProductGridSkeleton } from "@/components/storefront/product-grid"
import { Skeleton } from "@/components/ui/skeleton"

export default function CategoryLoading() {
  return (
    <div className="mx-auto max-w-[1280px] px-6 py-8 lg:px-12">
      <Skeleton className="mb-3 h-4 w-40" />
      <Skeleton className="mb-2 h-9 w-64" />
      <Skeleton className="mb-10 h-4 w-96" />
      <div className="flex gap-8">
        <div className="hidden w-60 shrink-0 space-y-4 lg:block">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
        <div className="flex-1">
          <ProductGridSkeleton count={9} />
        </div>
      </div>
    </div>
  )
}
