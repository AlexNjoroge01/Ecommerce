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
import { formatPrice } from "@/lib/format"

export const metadata: Metadata = { title: "Coupons" }

const COUPONS = [
  {
    code: "ATLAS10",
    type: "Percentage",
    value: "10% off",
    minSpend: 0,
    status: "Active" as const,
  },
  {
    code: "WELCOME5000",
    type: "Fixed amount",
    value: `${formatPrice(5000)} off`,
    minSpend: 50000,
    status: "Active" as const,
  },
]

export default function AdminCouponsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Coupons</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Discount codes applied at checkout.
          </p>
        </div>
        <Button>
          <Icon name="plus" className="size-4" />
          New coupon
        </Button>
      </div>

      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="text-right">Min. spend</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {COUPONS.map((c) => (
              <TableRow key={c.code}>
                <TableCell className="font-mono text-sm font-medium text-foreground">
                  {c.code}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{c.type}</TableCell>
                <TableCell className="font-mono text-sm text-foreground">{c.value}</TableCell>
                <TableCell className="text-right font-mono text-sm text-muted-foreground">
                  {c.minSpend ? formatPrice(c.minSpend) : "—"}
                </TableCell>
                <TableCell>
                  <Badge className="bg-mint/20 text-mint">{c.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
