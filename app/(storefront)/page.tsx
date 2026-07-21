import Link from "next/link"
import {
  getCategories,
  getBrands,
  getFeaturedProducts,
  getTrendingProducts,
  getFlashSaleProducts,
} from "@/lib/queries"
import { getWishlistIds } from "@/lib/cart"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/shared/icon"
import { SectionHeading } from "@/components/storefront/section-heading"
import { CategoryCard } from "@/components/storefront/category-card"
import { BrandTile } from "@/components/storefront/brand-tile"
import { ProductCard } from "@/components/storefront/product-card"
import { FlashCountdown } from "@/components/storefront/flash-countdown"
import { NewsletterForm } from "@/components/storefront/newsletter-form"
import { RatingStars } from "@/components/storefront/rating-stars"
import { Price } from "@/components/storefront/price"
import { ProductMedia } from "@/components/storefront/product-media"
import { JsonLd } from "@/components/shared/json-ld"
import { buildOrganizationSchema, buildSearchActionSchema } from "@/lib/seo"
import Image from "next/image"
import { HERO_IMAGE, avatar } from "@/lib/images"

const TESTIMONIALS = [
  { name: "Wanjiru M.", role: "Nairobi", quote: "Ordered a sofa, a serum and coffee in one basket — all arrived next morning. Atlas Market is my default now." },
  { name: "Brian K.", role: "Nakuru", quote: "The M-Pesa checkout took ten seconds and returns were painless. Cleanest online store I've used in Kenya." },
  { name: "Aisha O.", role: "Mombasa", quote: "Compared a few options side by side, picked one, and it arrived at a pickup station near campus. Effortless." },
]

export default async function HomePage() {
  const categories = getCategories()
  const brands = getBrands()
  const featured = getFeaturedProducts(4)
  const trending = getTrendingProducts(8)
  const flash = getFlashSaleProducts(4)
  const saved = new Set(await getWishlistIds())

  return (
    <>
      <JsonLd data={[buildOrganizationSchema(), buildSearchActionSchema()]} />

      {/* Aurora hero — the one moment of maximalism (Design.md §5.1) */}
      <section className="relative overflow-hidden">
        <div className="aurora absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-frost/80" />
        <div className="relative mx-auto grid max-w-[1280px] items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-12 lg:py-28">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-frost/70 px-4 py-1.5 text-xs font-medium tracking-[0.1em] text-ink uppercase backdrop-blur">
              <Icon name="sparkles" className="size-4 text-cyan" /> Thousands of brands, one checkout
            </p>
            <h1 className="font-display text-4xl leading-[1.05] font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Everything you love, <span className="text-gradient-brand">in one place.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-ink/70">
              Fashion, home, beauty, electronics, groceries and more — genuine
              brands at fair prices, with next-day delivery and 30-day returns on
              everything.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="buy" size="lg">
                <Link href="/fashion">
                  Shop new arrivals <Icon name="arrowRight" className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/search?discount=1">View this week&apos;s deals</Link>
              </Button>
            </div>
          </div>

          {/* Framed hero image with a floating stat card */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-[5/4] overflow-hidden rounded-[32px] border border-white/40 shadow-[var(--shadow-lg)]">
              <Image
                src={HERO_IMAGE}
                alt="Atlas Market — shop everything"
                fill
                priority
                sizes="(max-width: 1024px) 0px, 40vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 flex items-center gap-3 rounded-2xl border border-steel-200 bg-frost/95 px-4 py-3 shadow-[var(--shadow-md)] backdrop-blur">
              <span className="grid size-10 place-items-center rounded-xl bg-mint/20 text-[#0b6b4a]">
                <Icon name="truck" className="size-5" />
              </span>
              <div className="font-mono text-xs leading-tight">
                <p className="text-steel-500">DELIVERY</p>
                <p className="text-sm text-ink">Next-day · 6 warehouses</p>
              </div>
            </div>
            <div className="absolute -top-5 -right-4 flex items-center gap-2 rounded-2xl border border-steel-200 bg-frost/95 px-4 py-3 shadow-[var(--shadow-md)] backdrop-blur">
              <Icon name="verified" className="size-5 text-cyan" />
              <span className="font-mono text-xs text-ink">100% GENUINE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Flash sale strip */}
      <section className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <div className="-mt-8 flex flex-col items-center gap-6 rounded-3xl border border-steel-200 bg-card p-6 shadow-[var(--shadow-md)] lg:flex-row lg:justify-between lg:p-8">
          <div className="flex items-center gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-cobalt/10 text-cobalt">
              <Icon name="flash" className="size-6" />
            </span>
            <div>
              <p className="text-xs font-medium tracking-[0.12em] text-cobalt uppercase">
                Flash sale
              </p>
              <h2 className="font-display text-xl font-semibold">Ends at midnight</h2>
            </div>
          </div>
          <FlashCountdown />
          <div className="flex -space-x-3">
            {flash.map((p) => (
              <Link key={p.id} href={`/product/${p.slug}`} className="rounded-2xl ring-2 ring-card">
                <ProductMedia
                  tone={p.images[0]?.url ?? "steel"}
                  categorySlug={p.categorySlug}
                  className="size-14"
                  iconClassName="size-1/2"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by category */}
      <section className="mx-auto max-w-[1280px] px-6 py-16 lg:px-12 lg:py-24">
        <SectionHeading eyebrow="Browse" title="Shop by category" action={{ label: "All categories", href: "/fashion" }} />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((c, i) => (
            <CategoryCard key={c.id} category={c} index={i} />
          ))}
        </div>
      </section>

      {/* Trending products */}
      <section className="mx-auto max-w-[1280px] px-6 py-4 lg:px-12">
        <SectionHeading eyebrow="Hot right now" title="Trending products" action={{ label: "See all", href: "/search" }} />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {trending.map((p) => (
            <ProductCard key={p.id} product={p} saved={saved.has(p.id)} showSpecs />
          ))}
        </div>
      </section>

      {/* Shop by brand */}
      <section className="mx-auto max-w-[1280px] px-6 py-16 lg:px-12 lg:py-24">
        <SectionHeading eyebrow="Trusted names" title="Shop by brand" />
        <div className="grid grid-cols-2 gap-4 rounded-3xl bg-glacier p-6 sm:grid-cols-4 lg:grid-cols-8">
          {brands.map((b) => (
            <BrandTile key={b.id} brand={b} />
          ))}
        </div>
      </section>

      {/* Featured strip */}
      <section className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <SectionHeading eyebrow="Editor's picks" title="Featured this month" action={{ label: "See all", href: "/search" }} />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} saved={saved.has(p.id)} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-[1280px] px-6 py-16 lg:px-12 lg:py-24">
        <SectionHeading eyebrow="Why Atlas" title="Trusted across Kenya" />
        <div className="grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="flex flex-col rounded-3xl border border-steel-200 bg-card p-6">
              <div className="mb-3 flex items-center gap-2">
                <Icon name="verified" className="size-5 text-mint" />
                <RatingStars rating={5} />
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-foreground/80">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <Image
                  src={avatar(t.name, 96)}
                  alt={t.name}
                  width={40}
                  height={40}
                  className="size-10 rounded-full object-cover"
                />
                <span className="text-sm">
                  <span className="font-medium text-foreground">{t.name}</span>
                  <span className="block text-xs text-steel-500">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <div className="flex flex-col items-center gap-6 rounded-[32px] bg-ink px-8 py-16 text-center text-frost">
          <div>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              Get first access to drops
            </h2>
            <p className="mt-2 text-frost/60">
              New arrivals, restocks and members-only pricing. No noise.
            </p>
          </div>
          <NewsletterForm />
          <p className="font-mono text-xs text-frost/40">
            JOIN 48,000+ SUBSCRIBERS · UNSUBSCRIBE ANYTIME
          </p>
        </div>
      </section>
    </>
  )
}
