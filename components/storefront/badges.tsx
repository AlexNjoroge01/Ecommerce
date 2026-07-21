import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkBadge01Icon } from "@hugeicons/core-free-icons"
import type { Condition, StockStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

const base =
  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.04em]"

export function StockBadge({ status, className }: { status: StockStatus; className?: string }) {
  const map: Record<StockStatus, { label: string; cls: string }> = {
    in_stock: { label: "In stock", cls: "bg-mint/20 text-[#0b6b4a]" },
    low_stock: { label: "Low stock", cls: "bg-mint/15 text-[#0b6b4a]" },
    backorder: { label: "Backorder", cls: "border border-steel-200 text-steel-500" },
    out_of_stock: { label: "Sold out", cls: "border border-steel-200 text-steel-500" },
  }
  const { label, cls } = map[status]
  return <span className={cn(base, cls, className)}>{label}</span>
}

export function DiscountBadge({ percent, className }: { percent: number; className?: string }) {
  return <span className={cn(base, "bg-cobalt text-white", className)}>-{percent}%</span>
}

export function ConditionBadge({ condition, className }: { condition: Condition; className?: string }) {
  if (condition === "new") return null
  const label = condition === "refurbished" ? "Refurbished" : "Used"
  return (
    <span className={cn(base, "border border-steel-200 text-steel-500", className)}>{label}</span>
  )
}

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <span className={cn(base, "border border-steel-200 text-steel-500 normal-case", className)}>
      <HugeiconsIcon icon={CheckmarkBadge01Icon} strokeWidth={1.75} className="size-3.5 text-cyan" />
      Verified purchase
    </span>
  )
}
