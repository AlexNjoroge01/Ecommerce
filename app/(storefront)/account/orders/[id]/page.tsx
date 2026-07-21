import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getOrderById } from "@/lib/orders-store"
import { formatPrice, formatDate } from "@/lib/format"
import { Icon } from "@/components/shared/icon"
import { OrderStatusBadge, OrderTimeline } from "@/components/storefront/order-status"
import { ProductMedia } from "@/components/storefront/product-media"
import { Breadcrumbs } from "@/components/storefront/breadcrumbs"
import { Button } from "@/components/ui/button"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const order = getOrderById(id)
  return {
    title: order ? `Order ${order.orderNumber}` : "Order",
    robots: { index: false },
  }
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params
  const order = getOrderById(id)
  if (!order) notFound()

  const canCancel = order.status === "pending" || order.status === "paid" || order.status === "processing"
  const canReturn = order.status === "delivered"

  return (
    <div className="space-y-8">
      <Breadcrumbs
        crumbs={[
          { name: "Account", url: "/account" },
          { name: "Orders", url: "/account/orders" },
          { name: order.orderNumber },
        ]}
      />

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-mono text-2xl font-semibold tracking-tight">{order.orderNumber}</h1>
          <p className="mt-1 font-mono text-sm text-steel-500">{formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </header>

      <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-steel-200 bg-frost p-6">
            <h2 className="font-display text-lg font-semibold">Items</h2>
            <ul className="mt-4 divide-y divide-steel-200">
              {order.items.map((it, i) => (
                <li key={i} className="flex items-center gap-3 py-3">
                  <ProductMedia
                    tone={it.image}
                    categorySlug=""
                    className="size-12 shrink-0"
                    iconClassName="size-1/2"
                  />
                  <div className="flex-1 text-sm">
                    <p className="font-medium">{it.title}</p>
                    <p className="font-mono text-xs text-steel-500">
                      {it.variantLabel} · ×{it.quantity}
                    </p>
                  </div>
                  <span className="font-mono text-sm">
                    {formatPrice(it.unitPrice * it.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-steel-200 pt-4 text-sm">
              <Row label="Subtotal" value={formatPrice(order.subtotal)} />
              {order.discountTotal > 0 && (
                <Row label="Discount" value={`−${formatPrice(order.discountTotal)}`} />
              )}
              <Row
                label="Shipping"
                value={order.shippingTotal === 0 ? "Free" : formatPrice(order.shippingTotal)}
              />
              <Row label="VAT (incl.)" value={formatPrice(order.taxTotal)} />
              <div className="flex justify-between border-t border-steel-200 pt-3 font-medium">
                <span>Total</span>
                <span className="font-mono text-lg">{formatPrice(order.grandTotal)}</span>
              </div>
            </dl>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" disabled={!canReturn} title="Returns open once an order is delivered">
              <Icon name="returns" className="size-4" /> Request return
            </Button>
            <Button variant="outline" disabled={!canCancel} title="Only unfulfilled orders can be cancelled">
              <Icon name="close" className="size-4" /> Cancel order
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-steel-200 bg-frost p-6">
            <h2 className="mb-2 font-display text-lg font-semibold">
              {order.fulfillment === "pickup" ? "Pickup" : "Delivery"}
            </h2>
            <p className="text-sm text-muted-foreground">{order.destination}</p>
            <p className="mt-3 font-mono text-xs text-steel-500 uppercase">
              Est. delivery · 24–48 hrs
            </p>
          </div>
          <div className="rounded-3xl border border-steel-200 bg-frost p-6">
            <h2 className="mb-4 font-display text-lg font-semibold">Progress</h2>
            <OrderTimeline timeline={order.timeline} />
          </div>
        </div>
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
