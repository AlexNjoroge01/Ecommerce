import type { Metadata } from "next"
import Link from "next/link"
import { getSession } from "@/lib/auth"
import { logoutAction } from "@/actions/auth.actions"
import { Logo } from "@/components/storefront/logo"
import { Icon } from "@/components/shared/icon"
import { AdminNav, AdminPageTitle } from "@/components/admin/admin-nav"

export const metadata: Metadata = {
  title: { default: "Admin", template: "Admin · %s" },
  robots: { index: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  const name = session?.name ?? "Operator"
  const role = session?.role ?? "admin"

  return (
    <div className="dark min-h-svh bg-background text-foreground">
      {/* Fixed operator sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-border bg-sidebar md:flex">
        <div className="flex h-16 items-center border-b border-border px-5">
          <Link href="/admin" aria-label="Atlas Market admin">
            <Logo tone="frost" />
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <AdminNav />
        </div>

        <div className="border-t border-border p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
          >
            <Icon name="store" className="size-5 shrink-0" />
            View store
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-destructive"
            >
              <Icon name="logout" className="size-5 shrink-0" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Content column */}
      <div className="flex min-h-svh flex-col md:pl-60">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 px-6 backdrop-blur">
          <AdminPageTitle />
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-foreground">{name}</p>
              <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                {role}
              </p>
            </div>
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-cyan">
              <Icon name="account" className="size-5" />
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
