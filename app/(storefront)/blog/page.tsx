import type { Metadata } from "next"
import Link from "next/link"
import { getPosts, BLOG_CATEGORY_LABELS } from "@/lib/blog-data"
import { SectionHeading } from "@/components/storefront/section-heading"
import { Breadcrumbs } from "@/components/storefront/breadcrumbs"
import { ProductMedia } from "@/components/storefront/product-media"
import { photo } from "@/lib/images"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Buying guides, reviews, and plain-English explainers from the Atlas Market team — so you buy the right thing the first time.",
  alternates: { canonical: "/blog" },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export default function BlogIndexPage() {
  const posts = getPosts()

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-10 lg:px-12 lg:py-14">
      <Breadcrumbs crumbs={[{ name: "Blog", url: "/blog" }]} className="mb-8" />

      <SectionHeading
        eyebrow="The Atlas journal"
        title="Guides, reviews & explainers"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group/post flex flex-col overflow-hidden rounded-3xl border border-steel-200 bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)]"
          >
            <ProductMedia
              tone={photo(post.imageKeywords, 640, 400, `blog-${post.slug}`)}
              categorySlug=""
              alt={post.title}
              sizes="(max-width: 768px) 100vw, 33vw"
              className="aspect-[16/10] w-full rounded-none"
              iconClassName="size-1/4"
            />
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="w-fit rounded-full bg-glacier px-3 py-1 text-[11px] font-medium tracking-[0.06em] text-cobalt uppercase">
                {BLOG_CATEGORY_LABELS[post.category]}
              </span>
              <h2 className="font-display text-lg leading-snug font-semibold text-foreground group-hover/post:text-cyan">
                {post.title}
              </h2>
              <p className="line-clamp-3 text-sm leading-relaxed text-foreground/70">
                {post.excerpt}
              </p>
              <div className="mt-auto flex items-center justify-between pt-2 font-mono text-xs text-steel-500">
                <span>{post.author}</span>
                <span>
                  {formatDate(post.date)} · {post.readMins} min
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
