import type { Metadata } from "next"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Icon } from "@/components/shared/icon"
import { OrderStatusBadge } from "@/components/storefront/order-status"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { listOrders } from "@/lib/orders-store"
import { getFilteredProducts } from "@/lib/queries"
import { formatDate, formatNumber, formatPrice } from "@/lib/format"

export const metadata: Metadata = { title: "Dashboard" }

export default function AdminDashboardPage() {
  const orders = listOrders()
  const products = getFilteredProducts({ perPage: 100 }).items

  const revenueToday = orders.reduce((sum, o) => sum + o.grandTotal, 0)
  const ordersToday = orders.length
  const lowStock = products.filter(
    (p) => p.stockStatus === "low_stock" || p.stockStatus === "out_of_stock"
  ).length
  const topProducts = [...products]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 5)

  const kpis: {
    label: string
    value: string
    delta: string
    trend: "up" | "down"
    icon: Parameters<typeof Icon>[0]["name"]
  }[] = [
    {
      label: "Revenue today",
      value: formatPrice(revenueToday),
      delta: "+12% vs last week",
      trend: "up",
      icon: "wallet",
    },
    {
      label: "Orders today",
      value: formatNumber(ordersToday),
      delta: "+3 vs last week",
      trend: "up",
      icon: "package",
    },
    {
      label: "Conversion rate",
      value: "3.4%",
      delta: "+0.4pt vs last week",
      trend: "up",
      icon: "analytics",
    },
    {
      label: "Low-stock alerts",
      value: formatNumber(lowStock),
      delta: "-2 vs last week",
      trend: "down",
      icon: "tag",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Store performance at a glance for {formatDate(new Date())}.
        </p>
      </div>

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} size="sm">
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  {k.label}
                </span>
                <span className="grid size-8 place-items-center rounded-full bg-secondary text-cyan">
                  <Icon name={k.icon} className="size-4" />
                </span>
              </div>
              <p className="font-mono text-2xl font-semibold text-foreground">{k.value}</p>
              <p
                className={
                  k.trend === "up"
                    ? "text-xs font-medium text-mint"
                    : "text-xs font-medium text-cobalt"
                }
              >
                {k.delta}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue trend */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue trend</CardTitle>
          <span className="text-sm text-muted-foreground">Last 12 months (KES)</span>
        </CardHeader>
        <CardContent>
          <RevenueChart />
        </CardContent>
      </Card>

      {/* Recent orders + top products */}
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent orders</CardTitle>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-sm font-medium text-cyan hover:underline"
            >
              View all <Icon name="arrowRight" className="size-4" />
            </Link>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-sm">{o.orderNumber}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {formatDate(o.createdAt)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {formatPrice(o.grandTotal)}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={o.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top products</CardTitle>
            <span className="text-sm text-muted-foreground">By review volume</span>
          </CardHeader>
          <CardContent className="space-y-1">
            {topProducts.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-2xl px-2 py-2 hover:bg-secondary/50"
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary font-mono text-xs text-muted-foreground">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{p.title}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {formatNumber(p.reviewCount)} reviews · {p.rating.toFixed(1)}★
                  </p>
                </div>
                <span className="shrink-0 font-mono text-sm text-foreground">
                  {formatPrice(p.salePrice ?? p.regularPrice)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
