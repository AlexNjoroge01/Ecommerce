import Link from "next/link"
import { getSession } from "@/lib/auth"
import { getCategories, getPopularSearches } from "@/lib/queries"
import { getCartCount } from "@/lib/cart"
import { isAdminRole } from "@/lib/rbac"
import { SearchCommand } from "@/components/storefront/search-command"
import { AccountMenu } from "@/components/storefront/account-menu"
import { MobileTabBar } from "@/components/storefront/mobile-tab-bar"
import { Icon } from "@/components/shared/icon"
import { Logo } from "@/components/storefront/logo"

export async function SiteHeader() {
  const [session, count] = await Promise.all([getSession(), getCartCount()])
  const categories = getCategories()

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-steel-200/70 bg-frost/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-4 px-6 lg:px-12">
          <Link href="/" className="shrink-0">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {categories.slice(0, 5).map((c) => (
              <Link
                key={c.id}
                href={`/${c.slug}`}
                className="rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
              >
                {c.name}
              </Link>
            ))}
            <Link
              href="/search?discount=1"
              className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-cobalt transition-colors hover:bg-secondary"
            >
              <Icon name="flash" className="size-4" /> Deals
            </Link>
          </nav>

          <div className="ml-auto hidden flex-1 justify-center px-4 md:flex">
            <SearchCommand popular={getPopularSearches()} />
          </div>

          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="hidden size-11 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary sm:grid"
            >
              <Icon name="heart" className="size-6" />
            </Link>
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative grid size-11 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary"
            >
              <Icon name="cart" className="size-6" />
              {count > 0 && (
                <span className="absolute top-1 right-1 grid min-w-4.5 place-items-center rounded-full bg-cobalt px-1 font-mono text-[10px] font-medium text-white">
                  {count}
                </span>
              )}
            </Link>
            <AccountMenu
              name={session?.name ?? null}
              isAdmin={isAdminRole(session?.role)}
            />
          </div>
        </div>
      </header>
      <MobileTabBar cartCount={count} signedIn={!!session} />
    </>
  )
}
