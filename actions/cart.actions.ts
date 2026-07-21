"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import {
  CART_COOKIE,
  COUPON_COOKIE,
  WISHLIST_COOKIE,
  COMPARE_COOKIE,
  COMPARE_MAX,
  getCartLines,
  getCartSummary,
  getWishlistIds,
  getCompareIds,
  validateCoupon,
  COUPONS,
} from "@/lib/cart"
import { getProductById } from "@/lib/queries"
import type { CartLine } from "@/lib/types"
import type { ActionResult } from "@/actions/auth.actions"

const YEAR = 60 * 60 * 24 * 365

async function writeCart(lines: CartLine[]) {
  ;(await cookies()).set(CART_COOKIE, JSON.stringify(lines), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
  })
}

export async function addToCartAction(input: {
  productId: string
  variantId: string
  quantity?: number
}): Promise<ActionResult<{ count: number }>> {
  const product = getProductById(input.productId)
  if (!product) return { success: false, error: "That product is no longer available" }
  if (product.stockStatus === "out_of_stock") {
    return { success: false, error: "This item just sold out" }
  }

  const qty = Math.max(1, input.quantity ?? 1)
  const lines = await getCartLines()
  const existing = lines.find(
    (l) => l.productId === input.productId && l.variantId === input.variantId
  )
  if (existing) existing.quantity += qty
  else lines.push({ productId: input.productId, variantId: input.variantId, quantity: qty })

  await writeCart(lines)
  revalidatePath("/cart")
  return { success: true, data: { count: lines.reduce((n, l) => n + l.quantity, 0) } }
}

export async function updateCartQuantityAction(input: {
  variantId: string
  quantity: number
}): Promise<ActionResult> {
  let lines = await getCartLines()
  if (input.quantity <= 0) {
    lines = lines.filter((l) => l.variantId !== input.variantId)
  } else {
    const line = lines.find((l) => l.variantId === input.variantId)
    if (line) line.quantity = input.quantity
  }
  await writeCart(lines)
  revalidatePath("/cart")
  return { success: true }
}

export async function removeFromCartAction(variantId: string): Promise<ActionResult> {
  const lines = (await getCartLines()).filter((l) => l.variantId !== variantId)
  await writeCart(lines)
  revalidatePath("/cart")
  return { success: true }
}

export async function applyCouponAction(code: string): Promise<ActionResult<{ label: string }>> {
  const { subtotal } = await getCartSummary()
  const coupon = validateCoupon(code, subtotal)
  if (!coupon) {
    const known = COUPONS[code.toUpperCase()]
    if (known?.minOrder) {
      return {
        success: false,
        error: `Add more to reach the KES ${known.minOrder.toLocaleString()} minimum for this code`,
      }
    }
    return { success: false, error: "That code isn't valid" }
  }
  ;(await cookies()).set(COUPON_COOKIE, coupon.code, { path: "/", maxAge: YEAR })
  revalidatePath("/cart")
  return { success: true, data: { label: coupon.label } }
}

export async function removeCouponAction(): Promise<ActionResult> {
  ;(await cookies()).delete(COUPON_COOKIE)
  revalidatePath("/cart")
  return { success: true }
}

export async function toggleWishlistAction(
  productId: string
): Promise<ActionResult<{ added: boolean }>> {
  const ids = await getWishlistIds()
  const has = ids.includes(productId)
  const next = has ? ids.filter((id) => id !== productId) : [...ids, productId]
  ;(await cookies()).set(WISHLIST_COOKIE, JSON.stringify(next), { path: "/", maxAge: YEAR })
  revalidatePath("/wishlist")
  return { success: true, data: { added: !has } }
}

export async function toggleCompareAction(
  productId: string
): Promise<ActionResult<{ added: boolean }>> {
  const ids = await getCompareIds()
  const has = ids.includes(productId)
  if (!has && ids.length >= COMPARE_MAX) {
    return { success: false, error: `Compare holds up to ${COMPARE_MAX} products` }
  }
  const next = has ? ids.filter((id) => id !== productId) : [...ids, productId]
  ;(await cookies()).set(COMPARE_COOKIE, JSON.stringify(next), { path: "/", maxAge: YEAR })
  revalidatePath("/compare")
  return { success: true, data: { added: !has } }
}
