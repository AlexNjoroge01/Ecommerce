"use client"

import { useState, useTransition } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { FavouriteIcon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import { toggleWishlistAction } from "@/actions/cart.actions"
import { cn } from "@/lib/utils"

export function WishlistButton({
  productId,
  initialSaved = false,
  variant = "icon",
  className,
}: {
  productId: string
  initialSaved?: boolean
  variant?: "icon" | "full"
  className?: string
}) {
  const [saved, setSaved] = useState(initialSaved)
  const [isPending, startTransition] = useTransition()

  function toggle() {
    startTransition(async () => {
      const res = await toggleWishlistAction(productId)
      if (res.success) {
        setSaved(res.data!.added)
        toast.success(res.data!.added ? "Saved to wishlist" : "Removed from wishlist")
      } else {
        toast.error(res.error)
      }
    })
  }

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={toggle}
        disabled={isPending}
        className={cn(
          "inline-flex h-11 items-center gap-2 rounded-full border-[1.5px] border-foreground/80 px-5 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-50",
          className
        )}
      >
        <HugeiconsIcon
          icon={FavouriteIcon}
          strokeWidth={1.75}
          className={cn("size-4", saved && "fill-cobalt text-cobalt")}
        />
        {saved ? "Saved" : "Wishlist"}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        toggle()
      }}
      disabled={isPending}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      className={cn(
        "grid size-9 place-items-center rounded-full bg-frost/90 text-ink shadow-[var(--shadow-sm)] backdrop-blur transition-all hover:scale-105 hover:shadow-[var(--shadow-md)]",
        className
      )}
    >
      <HugeiconsIcon
        icon={FavouriteIcon}
        strokeWidth={1.75}
        className={cn("size-4", saved && "fill-cobalt text-cobalt")}
      />
    </button>
  )
}
