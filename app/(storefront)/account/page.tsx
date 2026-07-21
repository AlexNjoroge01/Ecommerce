import type { Metadata } from "next"
import Link from "next/link"
import { getSession } from "@/lib/auth"
import { listOrders } from "@/lib/orders-store"
import { getWishlistIds } from "@/lib/cart"
import { getTrendingProducts } from "@/lib/queries"
import { formatPrice, formatDate } from "@/lib/format"
import { Icon, type IconName } from "@/components/shared/icon"
import { OrderStatusBadge } from "@/components/storefront/order-status"
import { ProductCard } from "@/components/storefront/product-card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = { title: "Dashboard", robots: { index: false } }

export default async function AccountDashboardPage() {
  const session = await getSession()
  const orders = listOrders()
  const wishlistIds = await getWishlistIds()
  const recommended = getTrendingProducts(4)
  const firstName = (session?.name ?? "there").split(" ")[0]

  const kpis: { label: string; value: string; icon: IconName }[] = [
    { label: "Loyalty points", value: "1240", icon: "sparkles" },
    { label: "Orders", value: String(orders.length), icon: "bag" },
    { label: "Wishlist", value: String(wishlistIds.length), icon: "heart" },
    { label: "Member tier", value: "Silver", icon: "verified" },
  ]

  const recentOrders = orders.slice(0, 3)

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s a snapshot of your Atlas Market account.
        </p>
      </header>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-3xl border border-steel-200 bg-frost p-5">
            <span className="grid size-9 place-items-center rounded-full bg-card text-cyan">
              <Icon name={k.icon} className="size-5" />
            </span>
            <p className="mt-4 font-mono text-2xl font-semibold tracking-tight text-foreground">
              {k.value}
            </p>
            <p className="mt-0.5 text-xs tracking-[0.04em] text-steel-500 uppercase">
              {k.label}
            </p>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Recent orders</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/account/orders">View all</Link>
          </Button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-steel-200 py-12 text-center">
            <p className="text-muted-foreground">You haven&apos;t placed any orders yet.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {recentOrders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/account/orders/${order.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-steel-200 bg-frost p-4 transition-colors hover:border-cyan/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-full bg-card text-cyan">
                      <Icon name="package" className="size-5" />
                    </span>
                    <div>
                      <p className="font-mono text-sm font-medium">{order.orderNumber}</p>
                      <p className="font-mono text-xs text-steel-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <OrderStatusBadge status={order.status} />
                    <span className="font-mono text-sm font-medium">
                      {formatPrice(order.grandTotal)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {recommended.length > 0 && (
        <section>
          <h2 className="mb-4 font-display text-lg font-semibold">Recommended for you</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {recommended.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
