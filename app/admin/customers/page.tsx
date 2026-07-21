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
import { formatNumber, formatPrice } from "@/lib/format"

export const metadata: Metadata = { title: "Customers" }

const CUSTOMERS = [
  { name: "Aisha Otieno", location: "Nairobi · Westlands", orders: 7, spend: 284500, vip: true },
  { name: "Brian Kimani", location: "Nairobi · Kilimani", orders: 3, spend: 96999, vip: false },
  { name: "Cynthia Wanjiru", location: "Mombasa · Nyali", orders: 5, spend: 173200, vip: true },
  { name: "David Mwangi", location: "Kisumu · Milimani", orders: 2, spend: 41800, vip: false },
]

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Customers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatNumber(CUSTOMERS.length)} registered shoppers.
        </p>
      </div>

      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Orders</TableHead>
              <TableHead className="text-right">Lifetime spend</TableHead>
              <TableHead>Segment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CUSTOMERS.map((c) => (
              <TableRow key={c.name}>
                <TableCell className="font-medium text-foreground">{c.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{c.location}</TableCell>
                <TableCell className="text-right font-mono text-sm text-foreground">
                  {formatNumber(c.orders)}
                </TableCell>
                <TableCell className="text-right font-mono text-sm text-foreground">
                  {formatPrice(c.spend)}
                </TableCell>
                <TableCell>
                  {c.vip ? (
                    <Badge className="bg-cyan/15 text-cyan">VIP</Badge>
                  ) : (
                    <Badge variant="outline">Standard</Badge>
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
