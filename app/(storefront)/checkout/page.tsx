import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getCartSummary } from "@/lib/cart"
import { getSession } from "@/lib/auth"
import { CheckoutForm } from "@/components/storefront/checkout-form"
import { OrderSummary } from "@/components/storefront/order-summary"
import { ProductMedia } from "@/components/storefront/product-media"
import { Logo } from "@/components/storefront/logo"
import { formatPrice } from "@/lib/format"

export const metadata: Metadata = { title: "Checkout", robots: { index: false } }

export default async function CheckoutPage() {
  const summary = await getCartSummary()
  if (summary.lines.length === 0) redirect("/cart")

  const session = await getSession()
  const defaultName = session?.name ?? ""
  const defaultEmail = session?.email ?? ""

  return (
    <div className="mx-auto max-w-[1080px] px-6 py-8 lg:px-12">
      <Link href="/cart" className="mb-6 inline-flex items-center gap-1.5 text-sm text-steel-500 hover:text-cyan">
        ← Back to cart
      </Link>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Checkout</h1>
        <Logo />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <CheckoutForm defaultName={defaultName} defaultEmail={defaultEmail} />

        <div className="lg:sticky lg:top-24 lg:self-start">
          <OrderSummary summary={summary}>
            <ul className="mt-5 space-y-3 border-t border-steel-200 pt-5">
              {summary.lines.map((l) => (
                <li key={l.variantId} className="flex items-center gap-3">
                  <ProductMedia
                    tone={l.product.images[0]?.url ?? "steel"}
                    categorySlug={l.product.categorySlug}
                    className="size-12 shrink-0"
                    iconClassName="size-1/2"
                  />
                  <div className="flex-1 text-sm">
                    <p className="line-clamp-1 font-medium">{l.product.title}</p>
                    <p className="font-mono text-xs text-steel-500">×{l.quantity}</p>
                  </div>
                  <span className="font-mono text-sm">{formatPrice(l.lineTotal)}</span>
                </li>
              ))}
            </ul>
          </OrderSummary>
        </div>
      </div>
    </div>
  )
}
