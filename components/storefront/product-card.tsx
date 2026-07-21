import Link from "next/link"
import type { Product } from "@/lib/types"
import { ProductMedia } from "@/components/storefront/product-media"
import { Price } from "@/components/storefront/price"
import { RatingStars } from "@/components/storefront/rating-stars"
import { SpecStrip } from "@/components/storefront/spec-strip"
import { DiscountBadge, ConditionBadge, StockBadge } from "@/components/storefront/badges"
import { WishlistButton } from "@/components/storefront/wishlist-button"
import { discountPercent } from "@/lib/format"
import { cn } from "@/lib/utils"

export function ProductCard({
  product,
  saved = false,
  showSpecs = false,
  className,
}: {
  product: Product
  saved?: boolean
  showSpecs?: boolean
  className?: string
}) {
  const pct = discountPercent(product.regularPrice, product.salePrice)
  const headlineSpecs = product.specs.filter((s) => s.headline).slice(0, 3)

  return (
    <div
      className={cn(
        "group/card relative flex flex-col overflow-hidden rounded-[20px] border border-steel-200 bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)]",
        className
      )}
    >
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {pct && <DiscountBadge percent={pct} />}
        <ConditionBadge condition={product.condition} />
      </div>
      <div className="absolute top-3 right-3 z-10">
        <WishlistButton productId={product.id} initialSaved={saved} />
      </div>

      <Link href={`/product/${product.slug}`} className="block p-3">
        <ProductMedia
          tone={product.images[0]?.url ?? "steel"}
          categorySlug={product.categorySlug}
          className="aspect-square w-full"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2.5 px-4 pb-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-medium tracking-[0.04em] text-steel-500 uppercase">
            {product.brandSlug}
          </span>
          {product.stockStatus !== "in_stock" && <StockBadge status={product.stockStatus} />}
        </div>

        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 font-display text-[15px] leading-snug font-medium text-foreground hover:text-cyan"
        >
          {product.title}
        </Link>

        <RatingStars rating={product.rating} count={product.reviewCount} />

        {showSpecs && headlineSpecs.length > 0 && (
          <SpecStrip specs={headlineSpecs} variant="condensed" className="mt-0.5" />
        )}

        <div className="mt-auto pt-1">
          <Price regular={product.regularPrice} sale={product.salePrice} />
        </div>
      </div>
    </div>
  )
}
