import type { Metadata } from "next"
import { Icon } from "@/components/shared/icon"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const metadata: Metadata = { title: "Returns", robots: { index: false } }

type ReturnStatus = "requested" | "approved" | "refunded"

const RETURN_STATUS: Record<ReturnStatus, { label: string; cls: string }> = {
  requested: { label: "Requested", cls: "bg-cyan/15 text-[#0b6b7a]" },
  approved: { label: "Approved", cls: "bg-cobalt/15 text-cobalt" },
  refunded: { label: "Refunded", cls: "bg-mint/20 text-[#0b6b4a]" },
}

const RETURNS: {
  id: string
  returnNumber: string
  orderNumber: string
  item: string
  reason: string
  status: ReturnStatus
}[] = [
  {
    id: "r-1",
    returnNumber: "RET-2026-0041",
    orderNumber: "ATL-9K2M-77QP",
    item: "Prime USB-C Cable 240W",
    reason: "Wrong item received",
    status: "refunded",
  },
  {
    id: "r-2",
    returnNumber: "RET-2026-0052",
    orderNumber: "ATL-4T8W-12RX",
    item: "Chrono Watch S6",
    reason: "Changed my mind",
    status: "requested",
  },
]

function ReturnStatusBadge({ status }: { status: ReturnStatus }) {
  const s = RETURN_STATUS[status]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        s.cls
      )}
    >
      <Icon name="returns" className="size-3.5" /> {s.label}
    </span>
  )
}

export default function AccountReturnsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Returns</h1>
        <p className="mt-1 text-muted-foreground">
          Track return requests and refunds. Returns open within 14 days of delivery.
        </p>
      </header>

      {RETURNS.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-steel-200 py-20 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-glacier">
            <Icon name="returns" className="size-8 text-steel-500" />
          </span>
          <div>
            <p className="font-display text-xl font-medium">No returns yet</p>
            <p className="mt-1 text-muted-foreground">
              Start a return from any delivered order and it will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-steel-200 bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Return #</TableHead>
                <TableHead>Order #</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {RETURNS.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono font-medium">{r.returnNumber}</TableCell>
                  <TableCell className="font-mono text-steel-500">{r.orderNumber}</TableCell>
                  <TableCell>{r.item}</TableCell>
                  <TableCell className="text-muted-foreground">{r.reason}</TableCell>
                  <TableCell>
                    <ReturnStatusBadge status={r.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
