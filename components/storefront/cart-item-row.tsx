"use client"

import Link from "next/link"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { CartLineDetail } from "@/lib/types"
import { ProductMedia } from "@/components/storefront/product-media"
import { Icon } from "@/components/shared/icon"
import { formatPrice } from "@/lib/format"
import { updateCartQuantityAction, removeFromCartAction } from "@/actions/cart.actions"

export function CartItemRow({ line }: { line: CartLineDetail }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function setQty(quantity: number) {
    startTransition(async () => {
      await updateCartQuantityAction({ variantId: line.variantId, quantity })
      router.refresh()
    })
  }

  function remove() {
    startTransition(async () => {
      await removeFromCartAction(line.variantId)
      toast.success("Removed from cart")
      router.refresh()
    })
  }

  const variantLabel = [line.variant.color, line.variant.storage].filter(Boolean).join(" · ")

  return (
    <div className={`flex gap-4 py-5 ${isPending ? "opacity-60" : ""}`}>
      <Link href={`/product/${line.product.slug}`} className="shrink-0">
        <ProductMedia
          tone={line.product.images[0]?.url ?? "steel"}
          categorySlug={line.product.categorySlug}
          className="size-24"
          iconClassName="size-1/2"
        />
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              href={`/product/${line.product.slug}`}
              className="font-display font-medium hover:text-cyan"
            >
              {line.product.title}
            </Link>
            {variantLabel && (
              <p className="mt-0.5 text-xs text-steel-500">{variantLabel}</p>
            )}
          </div>
          <button
            onClick={remove}
            aria-label="Remove item"
            className="grid size-8 place-items-center rounded-full text-steel-500 hover:bg-secondary hover:text-destructive"
          >
            <Icon name="trash" className="size-4" />
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center rounded-full border border-steel-200">
            <button
              onClick={() => setQty(line.quantity - 1)}
              aria-label="Decrease"
              className="grid size-9 place-items-center rounded-full hover:bg-secondary"
            >
              <Icon name="minus" className="size-3.5" />
            </button>
            <span className="w-7 text-center font-mono text-sm">{line.quantity}</span>
            <button
              onClick={() => setQty(line.quantity + 1)}
              aria-label="Increase"
              className="grid size-9 place-items-center rounded-full hover:bg-secondary"
            >
              <Icon name="plus" className="size-3.5" />
            </button>
          </div>
          <span className="font-mono font-medium">{formatPrice(line.lineTotal)}</span>
        </div>
      </div>
    </div>
  )
}
