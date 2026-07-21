import Link from "next/link"
import Image from "next/image"
import type { Category } from "@/lib/types"
import { Icon, type IconName } from "@/components/shared/icon"
import { photo } from "@/lib/images"

const CATEGORY_ICON: Record<string, IconName> = {
  fashion: "shirt",
  "home-living": "sofa",
  beauty: "sparkles",
  electronics: "phone",
  sports: "dumbbell",
  groceries: "basket",
  toys: "toys",
  books: "book",
}

export function CategoryCard({ category }: { category: Category; index?: number }) {
  const src = category.image ?? photo(`category,${category.slug}`, 500, 640, category.slug)
  return (
    <Link
      href={`/${category.slug}`}
      className="group/cat relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-3xl border border-steel-200 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)]"
    >
      <Image
        src={src}
        alt={category.name}
        fill
        sizes="(max-width: 768px) 50vw, 16vw"
        className="object-cover transition-transform duration-300 group-hover/cat:scale-105"
      />
      {/* ink scrim bottom → transparent top (Design.md §3 category card) */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
      <Icon
        name={CATEGORY_ICON[category.slug] ?? "package"}
        strokeWidth={1.5}
        className="absolute top-5 right-5 size-8 text-frost/80"
      />
      <div className="relative">
        <h3 className="font-display text-lg font-semibold text-frost">{category.name}</h3>
        <span className="mt-1 flex items-center gap-1 text-sm font-medium text-cyan">
          Shop now <Icon name="arrowRight" className="size-4" />
        </span>
      </div>
    </Link>
  )
}
