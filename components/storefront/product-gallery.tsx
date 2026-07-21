"use client"

import { useState } from "react"
import { ProductMedia } from "@/components/storefront/product-media"
import { Icon } from "@/components/shared/icon"
import { cn } from "@/lib/utils"

export function ProductGallery({
  images,
  categorySlug,
  tone,
}: {
  images: { url: string; alt: string }[]
  categorySlug: string
  tone: string
}) {
  const [active, setActive] = useState(0)
  const list = images.length ? images : [{ url: tone, alt: "Product" }]

  return (
    <div className="flex flex-col gap-4 lg:sticky lg:top-24">
      <div className="relative">
        <ProductMedia
          tone={list[active]?.url ?? tone}
          categorySlug={categorySlug}
          className="aspect-square w-full"
          iconClassName="size-2/5"
        />
        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-frost/90 px-3 py-1 font-mono text-[11px] text-ink backdrop-blur">
          <Icon name="refresh" className="size-3.5" /> 360°
        </span>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {list.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`View ${img.alt}`}
            className={cn(
              "overflow-hidden rounded-xl border transition-colors",
              i === active ? "border-cyan ring-1 ring-cyan" : "border-steel-200 hover:border-steel-500"
            )}
          >
            <ProductMedia
              tone={img.url}
              categorySlug={categorySlug}
              className="aspect-square w-full"
              iconClassName="size-1/2"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
