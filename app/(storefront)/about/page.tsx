import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Icon, type IconName } from "@/components/shared/icon"
import { SectionHeading } from "@/components/storefront/section-heading"
import { Breadcrumbs } from "@/components/storefront/breadcrumbs"
import { SITE } from "@/lib/site"

export const metadata: Metadata = {
  title: "About",
  description:
    "Atlas Market is a Kenyan marketplace for everything — fashion, home, beauty, electronics, groceries and more — with genuine brands and honest product data. Our story and our numbers.",
  alternates: { canonical: "/about" },
}

const STATS = [
  { label: "PRODUCTS", value: "42,600" },
  { label: "BRANDS", value: "320" },
  { label: "CUSTOMERS", value: "180K" },
  { label: "RETURNS", value: "30-DAY" },
]

const VALUES: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "verified",
    title: "Genuine, always",
    body: "Every unit is sourced through authorised channels and arrives sealed. If a serial doesn't check out, it never reaches the shelf.",
  },
  {
    icon: "sparkles",
    title: "Details you can trust",
    body: "Real specs and honest descriptions on every product — not marketing fluff. Compare what matters and decide for yourself.",
  },
  {
    icon: "truck",
    title: "Next-day delivery",
    body: "Six warehouses across the country mean same-day dispatch and next-morning arrival to most towns, or a pickup station near you.",
  },
  {
    icon: "shield",
    title: "30-day returns",
    body: "Changed your mind? Return eligible items within 30 days, handled locally with a refund or exchange — no drama.",
  },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-6 py-10 lg:px-12 lg:py-14">
      <Breadcrumbs crumbs={[{ name: "About", url: "/about" }]} className="mb-8" />

      {/* Hero */}
      <header className="max-w-3xl">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-glacier px-4 py-1.5 text-xs font-medium tracking-[0.1em] text-ink uppercase">
          <Icon name="store" className="size-4 text-cyan" /> Our story
        </p>
        <h1 className="font-display text-4xl leading-[1.05] font-bold tracking-tight text-ink sm:text-5xl">
          Everything you love, <span className="text-gradient-brand">kept simple.</span>
        </h1>
        <p className="mt-6 text-lg text-ink/70">
          {SITE.name} started with a simple frustration: shopping online in Kenya
          meant juggling a dozen sites, guessing whether stock was genuine, and
          hoping returns would be honoured. We built one marketplace we'd actually
          want to use — genuine brands across every category, honest product detail,
          next-day delivery, and 30-day returns that just work.
        </p>
      </header>

      {/* Stats row */}
      <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-steel-200 bg-steel-200 sm:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="bg-card px-6 py-8 text-center">
            <p className="font-mono text-3xl font-semibold tracking-tight text-ink">
              {s.value}
            </p>
            <p className="mt-2 font-mono text-[11px] tracking-[0.12em] text-steel-500">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Values grid */}
      <section className="mt-20">
        <SectionHeading eyebrow="Why Atlas" title="How we do things" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="flex flex-col rounded-3xl border border-steel-200 bg-card p-6"
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-cyan/10 text-cyan">
                <Icon name={v.icon} className="size-6" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mt-20">
        <div className="flex flex-col items-center gap-6 rounded-[32px] bg-ink px-8 py-16 text-center text-frost">
          <h2 className="max-w-xl font-display text-2xl font-semibold sm:text-3xl">
            Ready to shop a store you can actually trust?
          </h2>
          <p className="max-w-md text-frost/60">
            Browse every category, compare on the details that matter, and have it
            delivered by tomorrow morning.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild variant="buy" size="lg">
              <Link href="/fashion">
                Start shopping <Icon name="arrowRight" className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-frost/30 text-frost hover:bg-frost/10">
              <Link href="/contact">Talk to us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
