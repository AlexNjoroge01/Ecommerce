"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon } from "@hugeicons/core-free-icons"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { ProductMedia } from "@/components/storefront/product-media"
import { formatPrice } from "@/lib/format"
import { instantSearchAction, type SearchHit } from "@/actions/search.actions"
import { cn } from "@/lib/utils"

export function SearchCommand({ popular }: { popular: string[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [hits, setHits] = useState<SearchHit[]>([])
  const [, startTransition] = useTransition()
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    if (!query.trim()) {
      setHits([])
      return
    }
    timer.current = setTimeout(() => {
      startTransition(async () => setHits(await instantSearchAction(query)))
    }, 250)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [query])

  function go(path: string) {
    setOpen(false)
    setQuery("")
    router.push(path)
  }

  function submit(term: string) {
    if (!term.trim()) return
    go(`/search?q=${encodeURIComponent(term)}`)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group/search flex h-11 w-full max-w-md items-center gap-2.5 rounded-full border border-steel-200 bg-frost px-4 text-left text-sm text-steel-500 transition-colors hover:border-cyan/60"
      >
        <HugeiconsIcon icon={Search01Icon} strokeWidth={1.75} className="size-4" />
        <span className="flex-1">Search phones, laptops, audio…</span>
        <kbd className="hidden rounded-md border border-steel-200 bg-glacier px-1.5 py-0.5 font-mono text-[10px] sm:inline">
          ⌘K
        </kbd>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search"
        description="Search the Atlas Market catalog"
      >
        <Command shouldFilter={false}>
        <CommandInput
          autoFocus
          value={query}
          onValueChange={setQuery}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit(query)
          }}
          placeholder="Search phones, laptops, audio…"
        />
        <CommandList className="max-h-[60vh]">
          {query.trim() && hits.length === 0 && (
            <CommandEmpty>
              No matches for “{query}”. Try a brand or category.
            </CommandEmpty>
          )}

          {!query.trim() && (
            <CommandGroup heading="Popular searches">
              {popular.map((term) => (
                <CommandItem key={term} onSelect={() => submit(term)} value={term}>
                  <HugeiconsIcon icon={Search01Icon} strokeWidth={1.75} className="size-4 text-steel-500" />
                  {term}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {hits.length > 0 && (
            <CommandGroup heading="Products">
              {hits.map((hit) => (
                <CommandItem
                  key={hit.slug}
                  value={hit.slug}
                  onSelect={() => go(`/product/${hit.slug}`)}
                  className="gap-3"
                >
                  <ProductMedia
                    tone={hit.tone}
                    categorySlug=""
                    className="size-10 shrink-0"
                    iconClassName="size-1/2"
                  />
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-medium">{hit.title}</span>
                    <span className="text-xs text-steel-500 capitalize">{hit.brand}</span>
                  </div>
                  <span className="font-mono text-sm">{formatPrice(hit.price)}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
