"use client"

import { useEffect, useRef } from "react"
import { toast } from "sonner"

export function ConfirmationToast({ orderNumber }: { orderNumber: string }) {
  const fired = useRef(false)
  useEffect(() => {
    if (fired.current) return
    fired.current = true
    toast.success(`Order placed! ${orderNumber}`)
  }, [orderNumber])
  return null
}
