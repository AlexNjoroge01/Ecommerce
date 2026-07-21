import { Breadcrumbs } from "@/components/storefront/breadcrumbs"

export interface PolicySection {
  heading: string
  body: string[]
}

/*
  Shared prose layout for the legal / policy pages (privacy, returns, warranty).
  Narrow measure, font-display headings, a mono "Last updated" line, and steel
  dividers between sections to match the glacial storefront aesthetic.
*/
export function PolicyPage({
  title,
  updated,
  sections,
}: {
  title: string
  updated: string
  sections: PolicySection[]
}) {
  return (
    <div className="mx-auto max-w-[760px] px-6 py-10 lg:px-12 lg:py-14">
      <Breadcrumbs crumbs={[{ name: title, url: "#" }]} className="mb-8" />

      <header className="mb-10">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 font-mono text-xs tracking-[0.06em] text-steel-500 uppercase">
          Last updated · {updated}
        </p>
      </header>

      <div className="space-y-10">
        {sections.map((section, i) => (
          <section
            key={section.heading}
            className={i > 0 ? "border-t border-steel-200 pt-10" : undefined}
          >
            <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
              {section.heading}
            </h2>
            <div className="mt-3 space-y-4">
              {section.body.map((para, j) => (
                <p key={j} className="text-[15px] leading-relaxed text-foreground/80">
                  {para}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
