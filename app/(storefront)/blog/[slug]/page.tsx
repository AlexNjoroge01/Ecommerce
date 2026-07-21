import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPosts, getPostBySlug, BLOG_CATEGORY_LABELS } from "@/lib/blog-data"
import { getTrendingProducts } from "@/lib/queries"
import { getWishlistIds } from "@/lib/cart"
import { Breadcrumbs } from "@/components/storefront/breadcrumbs"
import { ProductMedia } from "@/components/storefront/product-media"
import { photo } from "@/lib/images"
import { ProductCard } from "@/components/storefront/product-card"
import { SectionHeading } from "@/components/storefront/section-heading"
import { JsonLd } from "@/components/shared/json-ld"
import { buildBreadcrumbSchema } from "@/lib/seo"

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      authors: [post.author],
      publishedTime: post.date,
    },
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const related = getTrendingProducts(3)
  const saved = new Set(await getWishlistIds())

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-10 lg:px-12 lg:py-14">
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ])}
      />

      <Breadcrumbs
        crumbs={[
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
        className="mb-8"
      />

      <article className="mx-auto max-w-[720px]">
        <header>
          <span className="w-fit rounded-full bg-glacier px-3 py-1 text-[11px] font-medium tracking-[0.06em] text-cobalt uppercase">
            {BLOG_CATEGORY_LABELS[post.category]}
          </span>
          <h1 className="mt-4 font-display text-3xl leading-[1.1] font-bold tracking-tight text-ink sm:text-4xl">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-steel-500">
            <span className="text-foreground/80">{post.author}</span>
            <span aria-hidden>·</span>
            <span>{formatDate(post.date)}</span>
            <span aria-hidden>·</span>
            <span>{post.readMins} min read</span>
          </div>
        </header>

        <ProductMedia
          tone={photo(post.imageKeywords, 1200, 675, `blog-${post.slug}`)}
          categorySlug=""
          alt={post.title}
          priority
          sizes="(max-width: 768px) 100vw, 720px"
          className="mt-8 aspect-[16/9] w-full"
          iconClassName="size-1/5"
        />

        <div className="mt-8 space-y-4">
          {post.content.map((para, i) => (
            <p key={i} className="text-[17px] leading-relaxed text-foreground/80">
              {para}
            </p>
          ))}
        </div>
      </article>

      {/* Related products */}
      <section className="mt-20">
        <SectionHeading
          eyebrow="Shop the story"
          title="Related products"
          action={{ label: "See all", href: "/search" }}
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} saved={saved.has(p.id)} showSpecs />
          ))}
        </div>
      </section>
    </div>
  )
}
