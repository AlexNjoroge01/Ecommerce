import { cn } from "@/lib/utils"

/** Atlas Market wordmark — geometric mark + display type. */
export function Logo({ className, tone = "ink" }: { className?: string; tone?: "ink" | "frost" }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span className="relative grid size-8 place-items-center rounded-[10px] bg-gradient-to-br from-cyan to-cobalt">
        <span className="size-3 rounded-[3px] bg-frost/95" />
      </span>
      <span
        className={cn(
          "font-display text-lg font-semibold tracking-tight",
          tone === "frost" ? "text-frost" : "text-ink"
        )}
      >
        Atlas<span className="text-cyan">Market</span>
      </span>
    </span>
  )
}
