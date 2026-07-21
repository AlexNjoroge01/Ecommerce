import type { Metadata } from "next"
import { Icon, type IconName } from "@/components/shared/icon"
import { Breadcrumbs } from "@/components/storefront/breadcrumbs"
import { ContactForm } from "@/components/storefront/contact-form"
import { SUPPORT } from "@/lib/site"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach the Atlas Market team — call, email, or send us a message. We reply within 24 hours, Monday to Saturday.",
  alternates: { canonical: "/contact" },
}

const CHANNELS: { icon: IconName; label: string; value: string; href?: string }[] = [
  { icon: "call", label: "Call us", value: SUPPORT.phone, href: `tel:${SUPPORT.phone.replace(/\s/g, "")}` },
  { icon: "mail", label: "Email", value: SUPPORT.email, href: `mailto:${SUPPORT.email}` },
  { icon: "store", label: "Hours", value: SUPPORT.hours },
  { icon: "location", label: "Showroom", value: "Westlands Business Park, Waiyaki Way, Nairobi" },
]

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-6 py-10 lg:px-12 lg:py-14">
      <Breadcrumbs crumbs={[{ name: "Contact", url: "/contact" }]} className="mb-8" />

      <header className="mb-10 max-w-2xl">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Get in touch
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Questions about an order, a product, or a warranty claim? Reach us on any
          channel below, or drop a message and we&apos;ll get back to you within a day.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left: contact info */}
        <div>
          <div className="space-y-4">
            {CHANNELS.map((c) => (
              <div key={c.label} className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-glacier text-cyan">
                  <Icon name={c.icon} className="size-5" />
                </span>
                <div>
                  <p className="text-xs font-medium tracking-[0.08em] text-steel-500 uppercase">
                    {c.label}
                  </p>
                  {c.href ? (
                    <a href={c.href} className="text-[15px] font-medium text-foreground hover:text-cyan">
                      {c.value}
                    </a>
                  ) : (
                    <p className="text-[15px] font-medium text-foreground">{c.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-steel-200 bg-glacier p-6">
            <div className="mb-2 flex items-center gap-2">
              <Icon name="secure" className="size-5 text-mint" />
              <p className="font-display text-sm font-semibold">We keep it human</p>
            </div>
            <p className="text-sm leading-relaxed text-foreground/70">
              Every message reaches a real person on the Nairobi support team — no
              bots, no ticket limbo. Urgent order issue? Calling is fastest during
              showroom hours.
            </p>
          </div>
        </div>

        {/* Right: form */}
        <ContactForm />
      </div>
    </div>
  )
}
