import type { Metadata } from "next"
import Link from "next/link"
import { getWishlistIds } from "@/lib/cart"
import { getProductById } from "@/lib/queries"
import { ProductCard } from "@/components/storefront/product-card"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/shared/icon"
import type { Product } from "@/lib/types"

export const metadata: Metadata = { title: "Wishlist", robots: { index: false } }

export default async function WishlistPage() {
  const ids = await getWishlistIds()
  const products = ids.map(getProductById).filter(Boolean) as Product[]

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-8 lg:px-12">
      <h1 className="mb-8 font-display text-3xl font-semibold tracking-tight">Wishlist</h1>

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-steel-200 py-24 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-glacier">
            <Icon name="heart" className="size-8 text-steel-500" />
          </span>
          <div>
            <p className="font-display text-xl font-medium">Nothing saved yet</p>
            <p className="mt-1 text-muted-foreground">
              Tap the heart on any product to keep it here.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/fashion">Browse products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} saved showSpecs />
          ))}
        </div>
      )}
    </div>
  )
}
