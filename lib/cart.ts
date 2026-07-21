import "server-only"
import { cookies } from "next/headers"
import { getProductById, VAT_RATE } from "@/lib/queries"
import type { CartLine, CartLineDetail, CartSummary } from "@/lib/types"

export const CART_COOKIE = "atlas_cart"
export const COUPON_COOKIE = "atlas_coupon"
export const WISHLIST_COOKIE = "atlas_wishlist"
export const COMPARE_COOKIE = "atlas_compare"
export const COMPARE_MAX = 4

const FREE_SHIP_THRESHOLD = 50_000
const FLAT_SHIP = 500

interface Coupon {
  code: string
  kind: "percent" | "fixed"
  value: number
  minOrder?: number
  label: string
}

export const COUPONS: Record<string, Coupon> = {
  ATLAS10: { code: "ATLAS10", kind: "percent", value: 10, label: "10% off your order" },
  WELCOME5000: {
    code: "WELCOME5000",
    kind: "fixed",
    value: 5000,
    minOrder: 50_000,
    label: "KES 5,000 off orders over KES 50,000",
  },
}

async function readJson<T>(name: string, fallback: T): Promise<T> {
  const raw = (await cookies()).get(name)?.value
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export async function getCartLines(): Promise<CartLine[]> {
  return readJson<CartLine[]>(CART_COOKIE, [])
}

export async function getCartCount(): Promise<number> {
  const lines = await getCartLines()
  return lines.reduce((n, l) => n + l.quantity, 0)
}

export function shippingFor(subtotal: number): number {
  if (subtotal <= 0 || subtotal >= FREE_SHIP_THRESHOLD) return 0
  return FLAT_SHIP
}

export function validateCoupon(code: string | undefined, subtotal: number): Coupon | null {
  if (!code) return null
  const c = COUPONS[code.toUpperCase()]
  if (!c) return null
  if (c.minOrder && subtotal < c.minOrder) return null
  return c
}

export async function getCartSummary(): Promise<CartSummary> {
  const lines = await getCartLines()
  const details: CartLineDetail[] = []

  for (const line of lines) {
    const product = getProductById(line.productId)
    if (!product) continue
    const variant =
      product.variants.find((v) => v.id === line.variantId) ??
      product.variants.find((v) => v.isDefault) ??
      product.variants[0]
    if (!variant) continue
    const unitPrice = variant.price
    details.push({
      ...line,
      variantId: variant.id,
      product,
      variant,
      unitPrice,
      lineTotal: unitPrice * line.quantity,
    })
  }

  const subtotal = details.reduce((s, l) => s + l.lineTotal, 0)
  const couponCode = (await cookies()).get(COUPON_COOKIE)?.value
  const coupon = validateCoupon(couponCode, subtotal)
  const discountTotal = coupon
    ? coupon.kind === "percent"
      ? Math.round((subtotal * coupon.value) / 100)
      : Math.min(coupon.value, subtotal)
    : 0

  const taxable = Math.max(0, subtotal - discountTotal)
  // Prices are VAT-inclusive in KE; surface the VAT component for the summary.
  const taxTotal = Math.round(taxable - taxable / (1 + VAT_RATE))
  const shippingTotal = shippingFor(taxable)
  const grandTotal = taxable + shippingTotal

  return {
    lines: details,
    itemCount: details.reduce((n, l) => n + l.quantity, 0),
    subtotal,
    taxTotal,
    shippingTotal,
    discountTotal,
    grandTotal,
    couponCode: coupon?.code,
  }
}

export async function getWishlistIds(): Promise<string[]> {
  return readJson<string[]>(WISHLIST_COOKIE, [])
}

export async function getCompareIds(): Promise<string[]> {
  return readJson<string[]>(COMPARE_COOKIE, [])
}
