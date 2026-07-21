"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Icon, type IconName } from "@/components/shared/icon"
import { logoutAction } from "@/actions/auth.actions"
import { cn } from "@/lib/utils"

const LINKS: { href: string; label: string; icon: IconName; exact?: boolean }[] = [
  { href: "/account", label: "Dashboard", icon: "dashboard", exact: true },
  { href: "/account/orders", label: "Orders", icon: "bag" },
  { href: "/account/returns", label: "Returns", icon: "returns" },
  { href: "/wishlist", label: "Wishlist", icon: "heart" },
  { href: "/account/addresses", label: "Addresses", icon: "location" },
  { href: "/account/loyalty", label: "Loyalty", icon: "sparkles" },
  { href: "/account/support", label: "Support", icon: "mail" },
]

export function AccountNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1">
      {LINKS.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname === link.href || pathname.startsWith(`${link.href}/`)
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-card text-foreground shadow-[var(--shadow-sm)]"
                : "text-steel-500 hover:bg-card/60 hover:text-foreground"
            )}
          >
            <Icon name={link.icon} className="size-5 shrink-0" />
            {link.label}
          </Link>
        )
      })}

      <form action={logoutAction} className="mt-1 border-t border-steel-200 pt-1">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-steel-500 transition-colors hover:bg-card/60 hover:text-destructive"
        >
          <Icon name="logout" className="size-5 shrink-0" />
          Sign out
        </button>
      </form>
    </nav>
  )
}
