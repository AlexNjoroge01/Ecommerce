import type { Metadata } from "next"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/shared/icon"
import { getCategories, getFilteredProducts } from "@/lib/queries"
import { listOrders } from "@/lib/orders-store"
import { formatNumber, formatPrice } from "@/lib/format"

export const metadata: Metadata = { title: "Reports" }

export default function AdminReportsPage() {
  const products = getFilteredProducts({ perPage: 100 }).items
  const orders = listOrders()
  const categoryName = new Map(getCategories().map((c) => [c.slug, c.name]))

  // Top category by product count
  const counts = new Map<string, number>()
  for (const p of products) counts.set(p.categorySlug, (counts.get(p.categorySlug) ?? 0) + 1)
  const topSlug = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
  const topCategory = topSlug ? (categoryName.get(topSlug) ?? topSlug) : "—"

  // Average order value
  const aov = orders.length
    ? orders.reduce((sum, o) => sum + o.grandTotal, 0) / orders.length
    : 0

  const cards: { label: string; value: string; caption: string; icon: Parameters<typeof Icon>[0]["name"] }[] = [
    { label: "Top category", value: topCategory, caption: `${formatNumber(counts.get(topSlug ?? "") ?? 0)} products`, icon: "tag" },
    { label: "Average order value", value: formatPrice(aov), caption: `across ${formatNumber(orders.length)} orders`, icon: "wallet" },
    { label: "Returning customers", value: "42%", caption: "+5pt vs last quarter", icon: "account" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Reports</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Summary metrics across catalog and orders.
          </p>
        </div>
        <Button variant="outline">
          <Icon name="arrowRight" className="size-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.label} size="sm">
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  {c.label}
                </span>
                <span className="grid size-8 place-items-center rounded-full bg-secondary text-cyan">
                  <Icon name={c.icon} className="size-4" />
                </span>
              </div>
              <p className="font-mono text-2xl font-semibold text-foreground">{c.value}</p>
              <p className="text-xs text-muted-foreground">{c.caption}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exports</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            CSV export is available for sales, inventory, and customer reports. Scheduled email
            digests can be configured under Settings.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
