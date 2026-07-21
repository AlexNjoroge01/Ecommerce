import Link from "next/link"
import { Icon } from "@/components/shared/icon"
import { cn } from "@/lib/utils"

export function SectionHeading({
  eyebrow,
  title,
  action,
  className,
}: {
  eyebrow?: string
  title: string
  action?: { label: string; href: string }
  className?: string
}) {
  return (
    <div className={cn("mb-8 flex items-end justify-between gap-4", className)}>
      <div>
        {eyebrow && (
          <p className="mb-1.5 text-xs font-medium tracking-[0.14em] text-cyan uppercase">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
      </div>
      {action && (
        <Link
          href={action.href}
          className="hidden shrink-0 items-center gap-1 text-sm font-medium text-cobalt hover:underline sm:flex"
        >
          {action.label} <Icon name="arrowRight" className="size-4" />
        </Link>
      )}
    </div>
  )
}
