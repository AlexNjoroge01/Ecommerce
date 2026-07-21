import Link from "next/link"
import { SITE, SUPPORT } from "@/lib/site"
import { getCategories } from "@/lib/queries"
import { StatStrip } from "@/components/storefront/spec-strip"
import { Logo } from "@/components/storefront/logo"
import { Icon } from "@/components/shared/icon"

export function SiteFooter() {
  const categories = getCategories()
  const cols: { title: string; links: { label: string; href: string }[] }[] = [
    {
      title: "Shop",
      links: categories.map((c) => ({ label: c.name, href: `/${c.slug}` })),
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" },
        { label: "Careers", href: "/about#careers" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Track order", href: "/account/orders" },
        { label: "Returns", href: "/returns" },
        { label: "Warranty", href: "/warranty" },
        { label: "Privacy", href: "/privacy" },
      ],
    },
  ]

  return (
    <footer className="mt-24 bg-ink text-frost">
      <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-12">
        {/* Spec-Strip-style stats ribbon (Design.md §2, §5.1) */}
        <div className="mb-12 flex justify-center">
          <div className="rounded-2xl border border-white/10 bg-white/5">
            <StatStrip stats={SITE.stats} />
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo tone="frost" />
            <p className="mt-4 max-w-xs text-sm text-frost/60">
              {SITE.description}
            </p>
            <div className="mt-6 space-y-1.5 text-sm text-frost/70">
              <p className="flex items-center gap-2">
                <Icon name="call" className="size-4 text-cyan" /> {SUPPORT.phone}
              </p>
              <p className="flex items-center gap-2">
                <Icon name="mail" className="size-4 text-cyan" /> {SUPPORT.email}
              </p>
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h3 className="font-display text-sm font-semibold text-frost">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-frost/60 transition-colors hover:text-cyan"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-frost/50 sm:flex-row">
          <p>© 2026 {SITE.legalName}. All rights reserved.</p>
          <p className="font-mono">Precision, kept clean.</p>
        </div>
      </div>
    </footer>
  )
}
