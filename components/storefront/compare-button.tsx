"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Icon } from "@/components/shared/icon"
import { toggleCompareAction } from "@/actions/cart.actions"
import { cn } from "@/lib/utils"

export function CompareButton({
  productId,
  initialActive = false,
  className,
}: {
  productId: string
  initialActive?: boolean
  className?: string
}) {
  const [active, setActive] = useState(initialActive)
  const [isPending, startTransition] = useTransition()

  function toggle() {
    startTransition(async () => {
      const res = await toggleCompareAction(productId)
      if (res.success) {
        setActive(res.data!.added)
        toast.success(res.data!.added ? "Added to compare" : "Removed from compare")
      } else {
        toast.error(res.error)
      }
    })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-full border-[1.5px] px-5 text-sm font-medium transition-colors disabled:opacity-50",
        active
          ? "border-cyan bg-cyan/10 text-foreground"
          : "border-foreground/80 hover:bg-secondary",
        className
      )}
    >
      <Icon name="compare" className="size-4" />
      {active ? "Comparing" : "Compare"}
    </button>
  )
}
