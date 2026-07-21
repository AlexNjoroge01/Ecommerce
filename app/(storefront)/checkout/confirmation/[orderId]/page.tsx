import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getOrderById } from "@/lib/orders-store"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/shared/icon"
import { OrderStatusBadge, OrderTimeline } from "@/components/storefront/order-status"
import { ConfirmationToast } from "@/components/storefront/confirmation-toast"
import { ProductMedia } from "@/components/storefront/product-media"
import { formatPrice, formatDate } from "@/lib/format"

export const metadata: Metadata = { title: "Order confirmed", robots: { index: false } }

type Props = { params: Promise<{ orderId: string }> }

export default async function ConfirmationPage({ params }: Props) {
  const { orderId } = await params
  const order = getOrderById(orderId)
  if (!order) notFound()

  return (
    <div className="mx-auto max-w-[860px] px-6 py-12 lg:px-12">
      <ConfirmationToast orderNumber={order.orderNumber} />

      <div className="flex flex-col items-center text-center">
        <span className="grid size-16 place-items-center rounded-full bg-mint/20 text-[#0b6b4a]">
          <Icon name="check" className="size-8" />
        </span>
        <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight">
          Thank you — your order is in
        </h1>
        <p className="mt-2 text-muted-foreground">
          Order <span className="font-mono text-foreground">{order.orderNumber}</span> ·{" "}
          {formatDate(order.createdAt)}
        </p>
        <div className="mt-3">
          <OrderStatusBadge status={order.status} />
        </div>
        {order.paymentMethod === "mpesa" && order.status === "pending" && (
          <p className="mt-4 max-w-md rounded-2xl bg-cyan/10 px-4 py-3 text-sm text-[#0b6b7a]">
            Check your phone to complete the M-Pesa payment. This page updates once
            we receive confirmation.
          </p>
        )}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl border border-steel-200 bg-card p-6">
          <h2 className="font-display text-lg font-semibold">Items</h2>
          <ul className="mt-4 divide-y divide-steel-200">
            {order.items.map((it, i) => (
              <li key={i} className="flex items-center gap-3 py-3">
                <ProductMedia tone={it.image} categorySlug="" className="size-12 shrink-0" iconClassName="size-1/2" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">{it.title}</p>
                  <p className="font-mono text-xs text-steel-500">
                    {it.variantLabel} · ×{it.quantity}
                  </p>
                </div>
                <span className="font-mono text-sm">{formatPrice(it.unitPrice * it.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-steel-200 pt-4 text-sm">
            <Row label="Subtotal" value={formatPrice(order.subtotal)} />
            {order.discountTotal > 0 && <Row label="Discount" value={`−${formatPrice(order.discountTotal)}`} />}
            <Row label="Shipping" value={order.shippingTotal === 0 ? "Free" : formatPrice(order.shippingTotal)} />
            <Row label="VAT (incl.)" value={formatPrice(order.taxTotal)} />
            <div className="flex justify-between border-t border-steel-200 pt-3 font-medium">
              <span>Total</span>
              <span className="font-mono text-lg">{formatPrice(order.grandTotal)}</span>
            </div>
          </dl>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-steel-200 bg-card p-6">
            <h2 className="mb-2 font-display text-lg font-semibold">
              {order.fulfillment === "pickup" ? "Pickup" : "Delivery"}
            </h2>
            <p className="text-sm text-muted-foreground">{order.destination}</p>
            <p className="mt-3 font-mono text-xs text-steel-500 uppercase">
              Est. delivery · 24–48 hrs
            </p>
          </div>
          <div className="rounded-3xl border border-steel-200 bg-card p-6">
            <h2 className="mb-4 font-display text-lg font-semibold">Progress</h2>
            <OrderTimeline timeline={order.timeline} />
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/account/orders">Track this order</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">Continue shopping</Link>
        </Button>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-mono">{value}</dd>
    </div>
  )
}
