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
import { Icon } from "@/components/shared/icon"
import { getCategories, getFilteredProducts } from "@/lib/queries"
import { formatNumber } from "@/lib/format"

export const metadata: Metadata = { title: "Categories" }

export default function AdminCategoriesPage() {
  const categories = getCategories()
  const products = getFilteredProducts({ perPage: 100 }).items
  const counts = new Map<string, number>()
  for (const p of products) {
    counts.set(p.categorySlug, (counts.get(p.categorySlug) ?? 0) + 1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Categories</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatNumber(categories.length)} categories organizing the catalog.
        </p>
      </div>

      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Products</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-cyan">
                      <Icon name="tag" className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{c.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{c.description}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{c.slug}</TableCell>
                <TableCell className="text-right font-mono text-sm text-foreground">
                  {formatNumber(counts.get(c.slug) ?? 0)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
