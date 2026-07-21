import Link from "next/link"
import type { Brand } from "@/lib/types"

export function BrandTile({ brand }: { brand: Brand }) {
  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="flex h-20 items-center justify-center rounded-2xl border border-steel-200 bg-card px-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan/50 hover:shadow-[var(--shadow-md)]"
    >
      <span className="font-display text-xl font-semibold tracking-tight text-steel-500 capitalize transition-colors hover:text-ink">
        {brand.name}
      </span>
    </Link>
  )
}
