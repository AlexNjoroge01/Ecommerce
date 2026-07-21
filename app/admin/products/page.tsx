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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/shared/icon"
import { StockBadge } from "@/components/storefront/badges"
import { ProductMedia } from "@/components/storefront/product-media"
import { getBrands, getCategories, getFilteredProducts } from "@/lib/queries"
import { formatNumber, formatPrice } from "@/lib/format"

export const metadata: Metadata = { title: "Products" }

export default function AdminProductsPage() {
  const products = getFilteredProducts({ perPage: 100 }).items
  const categoryName = new Map(getCategories().map((c) => [c.slug, c.name]))
  const brandName = new Map(getBrands().map((b) => [b.slug, b.name]))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatNumber(products.length)} products in catalog. Filter by title or SKU (coming soon).
          </p>
        </div>
        <Button>
          <Icon name="plus" className="size-4" />
          Add product
        </Button>
      </div>

      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="max-w-[300px]">
                  <div className="flex items-center gap-3">
                    <ProductMedia
                      tone={p.images[0]?.url ?? "steel"}
                      categorySlug={p.categorySlug}
                      alt={p.title}
                      sizes="40px"
                      className="size-10 shrink-0"
                      iconClassName="size-1/2"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{p.title}</p>
                      <p className="font-mono text-[11px] text-muted-foreground">{p.sku}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {categoryName.get(p.categorySlug) ?? p.categorySlug}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {brandName.get(p.brandSlug) ?? p.brandSlug}
                </TableCell>
                <TableCell className="text-right">
                  {p.salePrice ? (
                    <span className="flex flex-col items-end">
                      <span className="font-mono text-sm text-foreground">
                        {formatPrice(p.salePrice)}
                      </span>
                      <span className="font-mono text-[11px] text-muted-foreground line-through">
                        {formatPrice(p.regularPrice)}
                      </span>
                    </span>
                  ) : (
                    <span className="font-mono text-sm text-foreground">
                      {formatPrice(p.regularPrice)}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <StockBadge status={p.stockStatus} />
                    <span className="font-mono text-xs text-muted-foreground">
                      {formatNumber(p.totalQuantity)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {p.isFeatured ? (
                    <Badge className="bg-cyan/15 text-cyan">Featured</Badge>
                  ) : (
                    <Badge variant="outline">Active</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
