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
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { StockBadge } from "@/components/storefront/badges"
import { getFilteredProducts } from "@/lib/queries"
import { formatNumber } from "@/lib/format"
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Inventory" }

const THRESHOLD = 5

export default function AdminInventoryPage() {
  const products = getFilteredProducts({ perPage: 100 }).items
  const lowCount = products.filter(
    (p) => p.stockStatus === "low_stock" || p.stockStatus === "out_of_stock"
  ).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Inventory</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatNumber(products.length)} SKUs tracked · {formatNumber(lowCount)} need attention.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Switch id="low-stock-only" />
          <Label htmlFor="low-stock-only" className="text-sm text-muted-foreground">
            Low stock only
          </Label>
        </div>
      </div>

      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">In stock</TableHead>
              <TableHead className="text-right">Threshold</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => {
              const critical =
                p.stockStatus === "low_stock" || p.stockStatus === "out_of_stock"
              return (
                <TableRow
                  key={p.id}
                  className={cn(critical && "bg-destructive/10 hover:bg-destructive/15")}
                >
                  <TableCell className="max-w-[280px] truncate font-medium text-foreground">
                    {p.title}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {p.sku}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-mono text-sm",
                      critical ? "text-destructive" : "text-foreground"
                    )}
                  >
                    {formatNumber(p.totalQuantity)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-muted-foreground">
                    {THRESHOLD}
                  </TableCell>
                  <TableCell>
                    <StockBadge status={p.stockStatus} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
