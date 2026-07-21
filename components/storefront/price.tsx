import { formatPrice, discountPercent } from "@/lib/format"
import { cn } from "@/lib/utils"

export function Price({
  regular,
  sale,
  size = "md",
  className,
}: {
  regular: number
  sale?: number | null
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const pct = discountPercent(regular, sale)
  const active = sale ?? regular
  const sizeClass =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-base"
  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      <span
        className={cn(
          "font-mono font-medium tracking-tight text-foreground",
          sizeClass
        )}
      >
        {formatPrice(active)}
      </span>
      {pct && (
        <>
          <span className="font-mono text-xs text-muted-foreground line-through">
            {formatPrice(regular)}
          </span>
          <span className="font-mono text-xs font-medium text-cobalt">-{pct}%</span>
        </>
      )}
    </div>
  )
}
