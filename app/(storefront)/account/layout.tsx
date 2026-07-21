import type { Metadata } from "next"
import { getSession } from "@/lib/auth"
import { Icon } from "@/components/shared/icon"
import { AccountNav } from "./account-nav"

export const metadata: Metadata = {
  title: { default: "Account", template: "%s · Account" },
  robots: { index: false },
}

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  const name = session?.name ?? "Guest"
  const email = session ? `${name.toLowerCase().replace(/\s+/g, ".")}@atlaslabs.co.ke` : "—"

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-8 lg:px-12">
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-3xl bg-glacier p-4 lg:sticky lg:top-24">
          <div className="mb-4 flex items-center gap-3 px-1">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-card text-cyan">
              <Icon name="account" className="size-6" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-semibold text-foreground">
                {name}
              </p>
              <p className="truncate text-xs text-steel-500">{email}</p>
            </div>
          </div>
          <AccountNav />
        </aside>

        <div className="min-w-0 rounded-3xl border border-steel-200 bg-card p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
