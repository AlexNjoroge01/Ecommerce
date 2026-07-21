import Link from "next/link"
import { Icon } from "@/components/shared/icon"
import { cn } from "@/lib/utils"

export function Breadcrumbs({
  crumbs,
  className,
}: {
  crumbs: { name: string; url?: string }[]
  className?: string
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex flex-wrap items-center gap-1.5 text-sm", className)}>
      <Link href="/" className="text-steel-500 hover:text-cyan">
        Home
      </Link>
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <Icon name="arrowRight" className="size-3.5 text-steel-200" />
          {c.url && i < crumbs.length - 1 ? (
            <Link href={c.url} className="text-steel-500 capitalize hover:text-cyan">
              {c.name}
            </Link>
          ) : (
            <span className="font-medium text-foreground capitalize">{c.name}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
