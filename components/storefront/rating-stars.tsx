import { HugeiconsIcon } from "@hugeicons/react"
import { StarIcon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

export function RatingStars({
  rating,
  count,
  size = "sm",
  className,
}: {
  rating: number
  count?: number
  size?: "sm" | "md"
  className?: string
}) {
  const px = size === "md" ? "size-5" : "size-4"
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center">
        {[0, 1, 2, 3, 4].map((i) => {
          const filled = rating >= i + 1
          const half = !filled && rating > i + 0.25
          return (
            <span key={i} className="relative">
              <HugeiconsIcon
                icon={StarIcon}
                strokeWidth={1.75}
                className={cn(px, "text-steel-200")}
              />
              {(filled || half) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: filled ? "100%" : "50%" }}
                >
                  <HugeiconsIcon
                    icon={StarIcon}
                    strokeWidth={1.75}
                    className={cn(px, "fill-mint text-mint")}
                  />
                </span>
              )}
            </span>
          )
        })}
      </div>
      {count != null && (
        <span className="font-mono text-xs text-muted-foreground">
          {rating.toFixed(1)} ({count})
        </span>
      )}
    </div>
  )
}
