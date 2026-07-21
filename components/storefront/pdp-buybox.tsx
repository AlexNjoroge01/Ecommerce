"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/shared/icon"
import { Price } from "@/components/storefront/price"
import { addToCartAction } from "@/actions/cart.actions"
import { cn } from "@/lib/utils"

export function PdpBuyBox({ product }: { product: Product }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [buying, setBuying] = useState(false)

  const colors = useMemo(
    () => uniqueBy(product.variants.map((v) => ({ color: v.color, hex: v.colorHex })), (c) => c.color),
    [product.variants]
  )
  const storages = useMemo(
    () => Array.from(new Set(product.variants.map((v) => v.storage).filter(Boolean))) as string[],
    [product.variants]
  )

  const [color, setColor] = useState(colors[0]?.color)
  const [storage, setStorage] = useState(storages[0])
  const [qty, setQty] = useState(1)

  const selected = useMemo(() => {
    return (
      product.variants.find(
        (v) => (!color || v.color === color) && (!storage || v.storage === storage)
      ) ??
      product.variants.find((v) => v.isDefault) ??
      product.variants[0]
    )
  }, [product.variants, color, storage])

  const soldOut = product.stockStatus === "out_of_stock"

  function add(buyNow: boolean) {
    if (!selected) return
    if (buyNow) setBuying(true)
    startTransition(async () => {
      const res = await addToCartAction({
        productId: product.id,
        variantId: selected.id,
        quantity: qty,
      })
      if (res.success) {
        if (buyNow) {
          router.push("/checkout")
        } else {
          toast.success(`Added to cart — ${product.title}`)
          router.refresh()
        }
      } else {
        setBuying(false)
        toast.error(res.error)
      }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <Price regular={selected?.price ?? product.regularPrice} sale={null} size="lg" />
        <p className="mt-1 font-mono text-xs text-steel-500">
          Inc. VAT · SKU {selected?.sku ?? product.sku}
        </p>
      </div>

      {colors.length > 1 && (
        <div>
          <p className="mb-2 text-xs font-semibold tracking-[0.06em] text-steel-500 uppercase">
            Color: <span className="text-foreground normal-case">{color}</span>
          </p>
          <div className="flex gap-2">
            {colors.map((c) => (
              <button
                key={c.color}
                onClick={() => setColor(c.color)}
                aria-label={c.color}
                className={cn(
                  "size-9 rounded-full border-2 transition-transform hover:scale-110",
                  color === c.color ? "border-cyan" : "border-steel-200"
                )}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      )}

      {storages.length > 1 && (
        <div>
          <p className="mb-2 text-xs font-semibold tracking-[0.06em] text-steel-500 uppercase">
            {product.optionLabel ?? "Option"}
          </p>
          <div className="flex flex-wrap gap-2">
            {storages.map((s) => (
              <button
                key={s}
                onClick={() => setStorage(s)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  storage === s
                    ? "border-cyan bg-cyan/10 text-foreground"
                    : "border-steel-200 hover:border-steel-500"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity + actions */}
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-full border border-steel-200">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="grid size-10 place-items-center rounded-full hover:bg-secondary"
          >
            <Icon name="minus" className="size-4" />
          </button>
          <span className="w-8 text-center font-mono text-sm">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            aria-label="Increase quantity"
            className="grid size-10 place-items-center rounded-full hover:bg-secondary"
          >
            <Icon name="plus" className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          className="flex-1"
          disabled={soldOut || isPending}
          onClick={() => add(false)}
        >
          <Icon name="cart" className="size-4" />
          {soldOut ? "Sold out" : "Add to cart"}
        </Button>
        <Button
          size="lg"
          variant="buy"
          className="flex-1"
          disabled={soldOut || isPending}
          onClick={() => add(true)}
        >
          {buying ? "Taking you to checkout…" : "Buy now"}
        </Button>
      </div>
    </div>
  )
}

function uniqueBy<T>(arr: T[], key: (t: T) => unknown): T[] {
  const seen = new Set<unknown>()
  const out: T[] = []
  for (const item of arr) {
    const k = key(item)
    if (!seen.has(k)) {
      seen.add(k)
      out.push(item)
    }
  }
  return out
}
