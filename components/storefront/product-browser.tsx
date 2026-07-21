"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import type { FilterParams, FilterResult, SortKey } from "@/lib/queries"
import { buildQuery, SORT_LABELS } from "@/lib/search-params"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Icon } from "@/components/shared/icon"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"

interface Props {
  facets: FilterResult["facets"]
  params: FilterParams
  total: number
  page: number
  pageCount: number
  basePath: string
  q?: string
  children: React.ReactNode
}

export function ProductBrowser({
  facets,
  params,
  total,
  page,
  pageCount,
  basePath,
  q,
  children,
}: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [price, setPrice] = useState<[number, number]>([
    params.minPrice ?? facets.priceBounds.min,
    params.maxPrice ?? facets.priceBounds.max,
  ])

  function apply(next: Partial<Parameters<typeof buildQuery>[0]>) {
    const merged = {
      q,
      brands: params.brands,
      conditions: params.conditions,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      minRating: params.minRating,
      inStockOnly: params.inStockOnly,
      discountOnly: params.discountOnly,
      sort: params.sort,
      ...next,
      page: undefined, // any filter change resets to page 1
    }
    startTransition(() => router.push(`${basePath}${buildQuery(merged)}`, { scroll: false }))
  }

  function toggleIn(list: string[] | undefined, value: string): string[] {
    const arr = list ?? []
    return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
  }

  const activeChips: { label: string; onRemove: () => void }[] = [
    ...(params.brands ?? []).map((b) => ({
      label: facets.brands.find((f) => f.value === b)?.label ?? b,
      onRemove: () => apply({ brands: toggleIn(params.brands, b) }),
    })),
    ...(params.conditions ?? []).map((c) => ({
      label: facets.conditions.find((f) => f.value === c)?.label ?? c,
      onRemove: () => apply({ conditions: toggleIn(params.conditions, c) }),
    })),
    ...(params.minRating ? [{ label: `${params.minRating}★ & up`, onRemove: () => apply({ minRating: undefined }) }] : []),
    ...(params.inStockOnly ? [{ label: "In stock", onRemove: () => apply({ inStockOnly: false }) }] : []),
    ...(params.discountOnly ? [{ label: "On sale", onRemove: () => apply({ discountOnly: false }) }] : []),
    ...(params.minPrice != null || params.maxPrice != null
      ? [{ label: `${formatPrice(price[0])} – ${formatPrice(price[1])}`, onRemove: () => { setPrice([facets.priceBounds.min, facets.priceBounds.max]); apply({ minPrice: undefined, maxPrice: undefined }) } }]
      : []),
  ]

  const panel = (
    <div className="space-y-7">
      {/* Brand */}
      {facets.brands.length > 0 && (
        <FilterGroup title="Brand">
          {facets.brands.map((b) => (
            <label key={b.value} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <Checkbox
                checked={params.brands?.includes(b.value)}
                onCheckedChange={() => apply({ brands: toggleIn(params.brands, b.value) })}
              />
              <span className="flex-1 capitalize">{b.label}</span>
              <span className="font-mono text-xs text-steel-500">{b.count}</span>
            </label>
          ))}
        </FilterGroup>
      )}

      {/* Price */}
      {facets.priceBounds.max > facets.priceBounds.min && (
        <FilterGroup title="Price">
          <Slider
            min={facets.priceBounds.min}
            max={facets.priceBounds.max}
            step={1000}
            value={price}
            onValueChange={(v) => setPrice([v[0], v[1]] as [number, number])}
            onValueCommit={(v) => apply({ minPrice: v[0], maxPrice: v[1] })}
          />
          <div className="flex justify-between font-mono text-xs text-steel-500">
            <span>{formatPrice(price[0])}</span>
            <span>{formatPrice(price[1])}</span>
          </div>
        </FilterGroup>
      )}

      {/* Condition */}
      {facets.conditions.length > 1 && (
        <FilterGroup title="Condition">
          {facets.conditions.map((c) => (
            <label key={c.value} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <Checkbox
                checked={params.conditions?.includes(c.value)}
                onCheckedChange={() => apply({ conditions: toggleIn(params.conditions, c.value) })}
              />
              <span className="flex-1">{c.label}</span>
              <span className="font-mono text-xs text-steel-500">{c.count}</span>
            </label>
          ))}
        </FilterGroup>
      )}

      {/* Rating */}
      <FilterGroup title="Rating">
        {[4, 3].map((r) => (
          <label key={r} className="flex cursor-pointer items-center gap-2.5 text-sm">
            <Checkbox
              checked={params.minRating === r}
              onCheckedChange={(v) => apply({ minRating: v ? r : undefined })}
            />
            <span className="flex items-center gap-1">
              {r}★ <span className="text-steel-500">& up</span>
            </span>
          </label>
        ))}
      </FilterGroup>

      {/* Availability */}
      <FilterGroup title="Availability">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm">
          <Checkbox checked={params.inStockOnly} onCheckedChange={(v) => apply({ inStockOnly: !!v })} />
          In stock only
        </label>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm">
          <Checkbox checked={params.discountOnly} onCheckedChange={(v) => apply({ discountOnly: !!v })} />
          On sale
        </label>
      </FilterGroup>
    </div>
  )

  return (
    <div className="flex gap-8">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 lg:block">
        <div className="sticky top-24">{panel}</div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Toolbar */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-sm text-steel-500">
            {total.toLocaleString()} {total === 1 ? "item" : "items"}
          </p>
          <div className="flex items-center gap-2">
            {/* Mobile filter trigger */}
            <Sheet>
              <SheetTrigger className="inline-flex h-10 items-center gap-2 rounded-full border border-steel-200 px-4 text-sm font-medium lg:hidden">
                <Icon name="filter" className="size-4" /> Filters
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-8">{panel}</div>
              </SheetContent>
            </Sheet>

            <Select
              value={params.sort ?? "popular"}
              onValueChange={(v) => apply({ sort: v as SortKey })}
            >
              <SelectTrigger className="h-10 w-48 rounded-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(SORT_LABELS) as SortKey[]).map((s) => (
                  <SelectItem key={s} value={s}>
                    {SORT_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active filter chips */}
        {activeChips.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-2">
            {activeChips.map((chip, i) => (
              <button
                key={i}
                onClick={chip.onRemove}
                className="inline-flex items-center gap-1.5 rounded-full bg-glacier px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-steel-200"
              >
                {chip.label}
                <Icon name="close" className="size-3.5" />
              </button>
            ))}
            <button
              onClick={() => startTransition(() => router.push(`${basePath}${q ? `?q=${encodeURIComponent(q)}` : ""}`, { scroll: false }))}
              className="text-xs font-medium text-cobalt hover:underline"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Results */}
        <div className={cn("transition-opacity", isPending && "pointer-events-none opacity-50")}>
          {children}
        </div>

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            {Array.from({ length: pageCount }).map((_, i) => {
              const n = i + 1
              const active = n === page
              return (
                <button
                  key={n}
                  onClick={() =>
                    startTransition(() =>
                      router.push(`${basePath}${buildQuery({ q, brands: params.brands, conditions: params.conditions, minPrice: params.minPrice, maxPrice: params.maxPrice, minRating: params.minRating, inStockOnly: params.inStockOnly, discountOnly: params.discountOnly, sort: params.sort, page: n })}`, { scroll: true })
                    )
                  }
                  className={cn(
                    "grid size-10 place-items-center rounded-full font-mono text-sm transition-colors",
                    active ? "bg-ink text-frost" : "border border-steel-200 hover:bg-secondary"
                  )}
                >
                  {n}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold tracking-[0.08em] text-steel-500 uppercase">
        {title}
      </h3>
      <div className="space-y-2.5">{children}</div>
    </div>
  )
}
