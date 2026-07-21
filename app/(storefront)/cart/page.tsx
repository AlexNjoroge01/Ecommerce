import type { Metadata } from "next"
import Link from "next/link"
import { getCartSummary } from "@/lib/cart"
import { getTrendingProducts } from "@/lib/queries"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/shared/icon"
import { CartItemRow } from "@/components/storefront/cart-item-row"
import { CartCoupon } from "@/components/storefront/cart-coupon"
import { OrderSummary } from "@/components/storefront/order-summary"
import { ProductCard } from "@/components/storefront/product-card"
import { COUPONS } from "@/lib/cart"

export const metadata: Metadata = { title: "Cart", robots: { index: false } }

export default async function CartPage() {
  const summary = await getCartSummary()

  if (summary.lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-6 py-24 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-glacier">
          <Icon name="cart" className="size-8 text-steel-500" />
        </span>
        <h1 className="font-display text-2xl font-semibold">Your cart is empty</h1>
        <p className="text-muted-foreground">
          Browse the catalog and add something you love — it&apos;ll show up here.
        </p>
        <Button asChild size="lg">
          <Link href="/fashion">Start shopping</Link>
        </Button>
      </div>
    )
  }

  const crossSell = getTrendingProducts(4).filter(
    (p) => !summary.lines.some((l) => l.product.id === p.id)
  )
  const sampleCoupon = Object.values(COUPONS)[0]

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-8 lg:px-12">
      <h1 className="mb-8 font-display text-3xl font-semibold tracking-tight">
        Your cart{" "}
        <span className="font-mono text-lg text-steel-500">({summary.itemCount})</span>
      </h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="divide-y divide-steel-200 rounded-3xl border border-steel-200 bg-card px-6">
            {summary.lines.map((line) => (
              <CartItemRow key={line.variantId} line={line} />
            ))}
          </div>
          <p className="mt-4 flex items-center gap-2 px-1 font-mono text-xs text-steel-500">
            <Icon name="tag" className="size-4" /> Try code{" "}
            <span className="text-cobalt">{sampleCoupon.code}</span> — {sampleCoupon.label}
          </p>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <OrderSummary summary={summary}>
            <CartCoupon applied={summary.couponCode} />
            <Button asChild variant="buy" size="lg" className="mt-5 w-full">
              <Link href="/checkout">
                Checkout <Icon name="arrowRight" className="size-4" />
              </Link>
            </Button>
            <p className="mt-3 text-center font-mono text-[11px] text-steel-500">
              SECURE CHECKOUT · M-PESA & CARD
            </p>
          </OrderSummary>
        </div>
      </div>

      {crossSell.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-xl font-semibold">Frequently bought together</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {crossSell.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
