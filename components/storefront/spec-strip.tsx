import type { SpecValue } from "@/lib/types"
import { cn } from "@/lib/utils"

/*
  The Spec Strip — signature element (Design.md §2). A monospaced ribbon with
  tick-mark dividers (--steel-200). Uppercase caption labels above each value at
  wider breakpoints. Used on the PDP (full), cards (condensed), and footer (stats).
*/

export function SpecStrip({
  specs,
  variant = "panel",
  className,
}: {
  specs: SpecValue[]
  variant?: "panel" | "condensed"
  className?: string
}) {
  if (specs.length === 0) return null

  if (variant === "condensed") {
    return (
      <div
        className={cn(
          "spec-strip rounded-full border border-steel-200 bg-glacier/60 px-1 text-[11px]",
          className
        )}
      >
        {specs.map((s) => (
          <span key={s.key} className="px-2.5 py-1 whitespace-nowrap text-ink/80">
            <span className="text-steel-500">{s.label} </span>
            {s.value}
            {s.unit}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "spec-strip rounded-2xl border border-steel-200 bg-glacier/50",
        className
      )}
    >
      {specs.map((s) => (
        <div key={s.key} className="flex flex-1 flex-col gap-0.5 px-4 py-3 sm:px-5">
          <span className="text-[10px] font-medium tracking-[0.06em] text-steel-500 uppercase">
            {s.label}
          </span>
          <span className="text-sm text-foreground">
            {s.value}
            {s.unit ? <span className="text-steel-500"> {s.unit}</span> : null}
          </span>
        </div>
      ))}
    </div>
  )
}

export function StatStrip({
  stats,
  className,
}: {
  stats: readonly { label: string; value: string }[]
  className?: string
}) {
  return (
    <div className={cn("spec-strip font-mono text-xs", className)}>
      {stats.map((s) => (
        <div key={s.label} className="flex items-center gap-2 px-4 py-2">
          <span className="text-steel-500">{s.label}</span>
          <span className="text-frost">{s.value}</span>
        </div>
      ))}
    </div>
  )
}
