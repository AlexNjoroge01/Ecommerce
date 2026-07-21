"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Icon, type IconName } from "@/components/shared/icon"
import { cn } from "@/lib/utils"

const LINKS: { href: string; label: string; icon: IconName; exact?: boolean }[] = [
  { href: "/admin", label: "Dashboard", icon: "dashboard", exact: true },
  { href: "/admin/products", label: "Products", icon: "package" },
  { href: "/admin/orders", label: "Orders", icon: "truck" },
  { href: "/admin/inventory", label: "Inventory", icon: "package" },
  { href: "/admin/categories", label: "Categories", icon: "tag" },
  { href: "/admin/coupons", label: "Coupons", icon: "discount" },
  { href: "/admin/customers", label: "Customers", icon: "account" },
  { href: "/admin/reports", label: "Reports", icon: "analytics" },
]

function isActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)
}

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1">
      {LINKS.map((link) => {
        const active = isActive(pathname, link.href, link.exact)
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-secondary text-foreground shadow-[var(--shadow-sm)]"
                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
            )}
          >
            <Icon name={link.icon} className="size-5 shrink-0" />
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}

/** Derives the current section name for the top bar. */
export function AdminPageTitle() {
  const pathname = usePathname()
  const match = [...LINKS]
    .sort((a, b) => b.href.length - a.href.length)
    .find((l) => isActive(pathname, l.href, l.exact))
  return (
    <div className="flex flex-col">
      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        Operator console
      </span>
      <span className="font-display text-base font-semibold text-foreground">
        {match?.label ?? "Admin"}
      </span>
    </div>
  )
}
