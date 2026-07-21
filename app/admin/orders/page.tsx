import type { Metadata } from "next"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { OrderStatusBadge } from "@/components/storefront/order-status"
import { listOrders } from "@/lib/orders-store"
import { formatDate, formatNumber, formatPrice } from "@/lib/format"
import type { PaymentMethod } from "@/lib/types"
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Orders" }

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  mpesa: "M-Pesa",
  card: "Card",
  bank: "Bank transfer",
  cod: "Cash on delivery",
}

const FILTERS = ["All", "Pending", "Shipped", "Delivered"] as const

export default function AdminOrdersPage() {
  const orders = listOrders()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatNumber(orders.length)} orders placed.
        </p>
      </div>

      {/* Filter chips (static) */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f, i) => (
          <button
            key={f}
            type="button"
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              i === 0
                ? "bg-cyan text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-mono text-sm">{o.orderNumber}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {o.destination || "Guest"}
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {formatDate(o.createdAt)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {PAYMENT_LABEL[o.paymentMethod]}
                </TableCell>
                <TableCell className="text-right font-mono text-sm text-foreground">
                  {formatPrice(o.grandTotal)}
                </TableCell>
                <TableCell>
                  <OrderStatusBadge status={o.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
