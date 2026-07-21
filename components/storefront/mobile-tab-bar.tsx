import Link from "next/link"
import { Icon, type IconName } from "@/components/shared/icon"

/*
  Bottom-anchored icon bar for mobile — thumb-reachable, where mobile
  conversions are won (Design.md §3 Navigation).
*/
export function MobileTabBar({
  cartCount,
  signedIn,
}: {
  cartCount: number
  signedIn: boolean
}) {
  const tabs: { href: string; label: string; icon: IconName; badge?: number }[] = [
    { href: "/", label: "Home", icon: "home" },
    { href: "/search", label: "Search", icon: "search" },
    { href: "/cart", label: "Cart", icon: "cart", badge: cartCount },
    { href: signedIn ? "/account" : "/login", label: "Account", icon: "account" },
  ]
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-steel-200 bg-frost/95 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium text-foreground/70 transition-colors hover:text-cyan"
          >
            <span className="relative">
              <Icon name={t.icon} className="size-6" />
              {t.badge ? (
                <span className="absolute -top-1.5 -right-2 grid min-w-4 place-items-center rounded-full bg-cobalt px-1 font-mono text-[9px] text-white">
                  {t.badge}
                </span>
              ) : null}
            </span>
            {t.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
