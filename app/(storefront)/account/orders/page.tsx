import type { Metadata } from "next"
import Link from "next/link"
import { listOrders } from "@/lib/orders-store"
import { formatPrice, formatDate } from "@/lib/format"
import { Icon } from "@/components/shared/icon"
import { OrderStatusBadge } from "@/components/storefront/order-status"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const metadata: Metadata = { title: "Orders", robots: { index: false } }

export default function AccountOrdersPage() {
  const orders = listOrders()

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="mt-1 text-muted-foreground">Track and revisit everything you&apos;ve ordered.</p>
      </header>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-steel-200 py-20 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-glacier">
            <Icon name="bag" className="size-8 text-steel-500" />
          </span>
          <div>
            <p className="font-display text-xl font-medium">No orders yet</p>
            <p className="mt-1 text-muted-foreground">
              When you place an order it will show up here.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/">Start shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-3xl border border-steel-200 bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const itemCount = order.items.reduce((n, it) => n + it.quantity, 0)
                return (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="font-mono font-medium text-cyan hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </TableCell>
                    <TableCell className="font-mono text-steel-500">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{itemCount}</TableCell>
                    <TableCell className="font-mono font-medium">
                      {formatPrice(order.grandTotal)}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
