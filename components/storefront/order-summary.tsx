import type { CartSummary } from "@/lib/types"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"

export function OrderSummary({
  summary,
  className,
  children,
}: {
  summary: CartSummary
  className?: string
  children?: React.ReactNode
}) {
  const rows: { label: string; value: string; accent?: boolean }[] = [
    { label: "Subtotal", value: formatPrice(summary.subtotal) },
  ]
  if (summary.discountTotal > 0) {
    rows.push({
      label: `Discount${summary.couponCode ? ` · ${summary.couponCode}` : ""}`,
      value: `−${formatPrice(summary.discountTotal)}`,
      accent: true,
    })
  }
  rows.push({
    label: "Shipping",
    value: summary.shippingTotal === 0 ? "Free" : formatPrice(summary.shippingTotal),
  })
  rows.push({ label: "VAT (16%, incl.)", value: formatPrice(summary.taxTotal) })

  return (
    <div className={cn("rounded-3xl border border-steel-200 bg-card p-6", className)}>
      <h2 className="font-display text-lg font-semibold">Order summary</h2>
      <dl className="mt-5 space-y-3">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between text-sm">
            <dt className="text-muted-foreground">{r.label}</dt>
            <dd className={cn("font-mono", r.accent ? "text-mint" : "text-foreground")}>
              {r.value}
            </dd>
          </div>
        ))}
        <div className="flex items-baseline justify-between border-t border-steel-200 pt-4">
          <dt className="font-medium">Total</dt>
          <dd className="font-mono text-xl font-semibold">{formatPrice(summary.grandTotal)}</dd>
        </div>
      </dl>
      {children}
    </div>
  )
}
