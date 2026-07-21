import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
  getProductBySlug,
  getFeaturedProducts,
  getRelatedProducts,
  getReviewsForProduct,
  getBrandBySlug,
  getCategoryBySlug,
} from "@/lib/queries"
import { getWishlistIds, getCompareIds } from "@/lib/cart"
import { getSession } from "@/lib/auth"
import { Breadcrumbs } from "@/components/storefront/breadcrumbs"
import { ProductGallery } from "@/components/storefront/product-gallery"
import { PdpBuyBox } from "@/components/storefront/pdp-buybox"
import { SpecStrip } from "@/components/storefront/spec-strip"
import { RatingStars } from "@/components/storefront/rating-stars"
import { ProductCard } from "@/components/storefront/product-card"
import { WishlistButton } from "@/components/storefront/wishlist-button"
import { CompareButton } from "@/components/storefront/compare-button"
import { ReviewForm } from "@/components/storefront/review-form"
import { StockBadge, ConditionBadge, VerifiedBadge } from "@/components/storefront/badges"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icon, type IconName } from "@/components/shared/icon"
import { JsonLd } from "@/components/shared/json-ld"
import { buildProductSchema, buildBreadcrumbSchema } from "@/lib/seo"
import { formatDate } from "@/lib/format"
import Image from "next/image"
import { avatar } from "@/lib/images"

export function generateStaticParams() {
  return getFeaturedProducts(20).map((p) => ({ slug: p.slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return {}
  return {
    title: product.metaTitle ?? product.title,
    description: product.metaDescription ?? product.description.slice(0, 160),
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.title,
      description: product.metaDescription,
      type: "website",
      images: [{ url: `/api/og/product/${product.slug}`, width: 1200, height: 630 }],
    },
  }
}

const TRUST: { icon: IconName; label: string; sub: string }[] = [
  { icon: "secure", label: "Secure payment", sub: "M-Pesa & card" },
  { icon: "verified", label: "Genuine product", sub: "Sealed & sourced" },
  { icon: "shield", label: "Warranty", sub: "Manufacturer-backed" },
  { icon: "returns", label: "7-day returns", sub: "Change of mind" },
]

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) notFound()

  const brand = getBrandBySlug(product.brandSlug)
  const category = getCategoryBySlug(product.categorySlug)
  const reviews = getReviewsForProduct(product.id)
  const related = getRelatedProducts(product, 4)
  const [savedIds, compareIds, session] = await Promise.all([
    getWishlistIds(),
    getCompareIds(),
    getSession(),
  ])
  const headlineSpecs = product.specs.filter((s) => s.headline)

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-8 lg:px-12">
      <JsonLd
        data={[
          buildProductSchema(product, { avgRating: product.rating, reviewCount: product.reviewCount }),
          buildBreadcrumbSchema([
            { name: category?.name ?? "Shop", url: `/${product.categorySlug}` },
            { name: product.title, url: `/product/${product.slug}` },
          ]),
        ]}
      />

      <Breadcrumbs
        crumbs={[
          { name: category?.name ?? "Shop", url: `/${product.categorySlug}` },
          { name: product.title, url: `/product/${product.slug}` },
        ]}
        className="mb-6"
      />

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery
          images={product.images}
          categorySlug={product.categorySlug}
          tone={product.images[0]?.url ?? "steel"}
        />

        <div>
          <div className="flex items-center gap-3">
            <Link
              href={`/brands/${product.brandSlug}`}
              className="text-sm font-medium tracking-[0.04em] text-steel-500 uppercase hover:text-cyan"
            >
              {brand?.name ?? product.brandSlug}
            </Link>
            <ConditionBadge condition={product.condition} />
          </div>

          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {product.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-4">
            <RatingStars rating={product.rating} size="md" />
            <a href="#reviews" className="text-sm text-cobalt hover:underline">
              {product.reviewCount} reviews
            </a>
            <StockBadge status={product.stockStatus} />
          </div>

          <p className="mt-4 text-base leading-relaxed text-foreground/80">
            {product.description}
          </p>

          <div className="mt-6 border-t border-steel-200 pt-6">
            <PdpBuyBox product={product} />
          </div>

          <div className="mt-4 flex gap-3">
            <WishlistButton
              productId={product.id}
              initialSaved={savedIds.includes(product.id)}
              variant="full"
            />
            <CompareButton
              productId={product.id}
              initialActive={compareIds.includes(product.id)}
            />
          </div>

          {/* Trust row (Design.md §5.3 — highest-scrutiny zone) */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TRUST.map((t) => (
              <div key={t.label} className="flex flex-col gap-1 rounded-2xl bg-glacier/60 p-3">
                <Icon name={t.icon} className="size-5 text-cyan" />
                <span className="text-xs font-medium">{t.label}</span>
                <span className="font-mono text-[10px] text-steel-500">{t.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spec Strip — signature element */}
      {headlineSpecs.length > 0 && (
        <div className="mt-12">
          <SpecStrip specs={headlineSpecs} />
        </div>
      )}

      {/* Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="highlights">Highlights</TabsTrigger>
            <TabsTrigger value="specs">Full specs</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="max-w-3xl pt-6 text-base leading-relaxed text-foreground/80">
            <p>{product.description}</p>
            <p className="mt-4 font-mono text-sm text-steel-500">
              Warranty · {product.warranty}
            </p>
          </TabsContent>
          <TabsContent value="highlights" className="pt-6">
            <ul className="grid max-w-3xl gap-3 sm:grid-cols-2">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-sm">
                  <Icon name="check" className="mt-0.5 size-4 shrink-0 text-mint" />
                  {h}
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="specs" className="pt-6">
            <dl className="max-w-2xl divide-y divide-steel-200 rounded-2xl border border-steel-200">
              {product.specs.map((s) => (
                <div key={s.key} className="flex items-center justify-between px-5 py-3">
                  <dt className="text-sm text-steel-500">{s.label}</dt>
                  <dd className="font-mono text-sm">
                    {s.value}
                    {s.unit ? ` ${s.unit}` : ""}
                  </dd>
                </div>
              ))}
            </dl>
          </TabsContent>
        </Tabs>
      </div>

      {/* Reviews */}
      <section id="reviews" className="mt-16 scroll-mt-24">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="font-display text-2xl font-semibold">Customer reviews</h2>
            <div className="mt-4 flex items-center gap-4">
              <span className="font-display text-5xl font-bold">{product.rating.toFixed(1)}</span>
              <div>
                <RatingStars rating={product.rating} />
                <p className="mt-1 text-sm text-steel-500">{product.reviewCount} verified reviews</p>
              </div>
            </div>
            <div className="mt-8">
              {session ? (
                <ReviewForm productId={product.id} />
              ) : (
                <div className="rounded-3xl border border-dashed border-steel-200 p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    <Link href="/login" className="font-medium text-cobalt hover:underline">
                      Sign in
                    </Link>{" "}
                    to write a review.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {reviews.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No reviews yet — be the first to share your experience.
              </p>
            )}
            {reviews.map((r) => (
              <article key={r.id} className="rounded-3xl border border-steel-200 bg-card p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Image
                      src={avatar(r.author, 96)}
                      alt={r.author}
                      width={36}
                      height={36}
                      className="size-9 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium">{r.author}</p>
                      <p className="text-xs text-steel-500">{formatDate(r.createdAt)}</p>
                    </div>
                  </div>
                  {r.verified && <VerifiedBadge />}
                </div>
                <div className="mt-3">
                  <RatingStars rating={r.rating} />
                  <h3 className="mt-2 font-display font-semibold">{r.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-foreground/80">{r.body}</p>
                  {(r.pros || r.cons) && (
                    <div className="mt-3 flex flex-wrap gap-4 text-xs">
                      {r.pros && (
                        <span className="text-[#0b6b4a]">
                          <span className="font-semibold">+ </span>{r.pros}
                        </span>
                      )}
                      {r.cons && (
                        <span className="text-steel-500">
                          <span className="font-semibold">− </span>{r.cons}
                        </span>
                      )}
                    </div>
                  )}
                  <button className="mt-3 text-xs font-medium text-steel-500 hover:text-cobalt">
                    Helpful ({r.helpfulVotes})
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-semibold">You might also like</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} saved={savedIds.includes(p.id)} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
