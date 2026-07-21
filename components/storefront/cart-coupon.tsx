"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/shared/icon"
import { applyCouponAction, removeCouponAction } from "@/actions/cart.actions"

export function CartCoupon({ applied }: { applied?: string }) {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [isPending, startTransition] = useTransition()

  function apply() {
    if (!code.trim()) return
    startTransition(async () => {
      const res = await applyCouponAction(code.trim())
      if (res.success) {
        toast.success(res.data!.label)
        setCode("")
        router.refresh()
      } else {
        toast.error(res.error)
      }
    })
  }

  function remove() {
    startTransition(async () => {
      await removeCouponAction()
      toast.info("Coupon removed")
      router.refresh()
    })
  }

  if (applied) {
    return (
      <div className="mt-5 flex items-center justify-between rounded-2xl bg-mint/15 px-4 py-3">
        <span className="flex items-center gap-2 text-sm font-medium text-[#0b6b4a]">
          <Icon name="discount" className="size-4" /> {applied} applied
        </span>
        <button onClick={remove} disabled={isPending} className="text-xs text-steel-500 hover:underline">
          Remove
        </button>
      </div>
    )
  }

  return (
    <div className="mt-5 flex gap-2">
      <Input
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), apply())}
        placeholder="Coupon code"
        className="flex-1 uppercase"
      />
      <Button type="button" variant="outline" onClick={apply} disabled={isPending}>
        Apply
      </Button>
    </div>
  )
}
