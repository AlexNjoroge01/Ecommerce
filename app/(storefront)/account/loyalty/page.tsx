import type { Metadata } from "next"
import { formatDate } from "@/lib/format"
import { Icon } from "@/components/shared/icon"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const metadata: Metadata = { title: "Loyalty", robots: { index: false } }

const POINTS = 1240
const NEXT_TIER_AT = 2000
const NEXT_TIER = "Gold"

const LEDGER: { id: string; date: string; description: string; points: number }[] = [
  { id: "l-1", date: "2026-07-15T08:11:00Z", description: "Order ATL-4T8W-12RX", points: 570 },
  { id: "l-2", date: "2026-06-20T10:00:00Z", description: "Redeemed — KES 500 voucher", points: -250 },
  { id: "l-3", date: "2026-06-02T12:31:00Z", description: "Order ATL-9K2M-77QP", points: 385 },
  { id: "l-4", date: "2026-05-01T09:00:00Z", description: "Welcome bonus", points: 535 },
]

export default function AccountLoyaltyPage() {
  const remaining = Math.max(0, NEXT_TIER_AT - POINTS)
  const progress = Math.min(100, Math.round((POINTS / NEXT_TIER_AT) * 100))

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Loyalty</h1>
        <p className="mt-1 text-muted-foreground">Earn points on every order and redeem for rewards.</p>
      </header>

      <section className="rounded-3xl border border-steel-200 bg-frost p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.06em] text-steel-500 uppercase">Points balance</p>
            <p className="mt-1 font-mono text-5xl font-semibold tracking-tight text-foreground">
              {POINTS.toLocaleString()}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-glacier px-3 py-1 text-xs font-medium text-cobalt">
            <Icon name="verified" className="size-3.5" /> Silver tier
          </span>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress to {NEXT_TIER}</span>
            <span className="font-mono text-steel-500">
              {POINTS.toLocaleString()} / {NEXT_TIER_AT.toLocaleString()}
            </span>
          </div>
          <Progress value={progress} />
          <p className="mt-2 text-xs text-steel-500">
            {remaining.toLocaleString()} points to reach {NEXT_TIER}.
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-display text-lg font-semibold">Points activity</h2>
        <div className="rounded-3xl border border-steel-200 bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {LEDGER.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-mono text-steel-500">
                    {formatDate(entry.date)}
                  </TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-mono font-medium",
                      entry.points >= 0 ? "text-[#0b6b4a]" : "text-destructive"
                    )}
                  >
                    {entry.points >= 0 ? "+" : "−"}
                    {Math.abs(entry.points)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  )
}
