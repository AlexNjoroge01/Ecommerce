/**
 * Domain types shared across the storefront + admin. The seed catalog conforms
 * to these, and the Drizzle rows (drizzle/schema) map onto them, so swapping the
 * data source to Neon later needs no call-site changes.
 */

export type Condition = "new" | "refurbished" | "used"
export type StockStatus = "in_stock" | "low_stock" | "out_of_stock" | "backorder"

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"

export type PaymentMethod = "mpesa" | "card" | "bank" | "cod"

export type Role =
  | "customer"
  | "support"
  | "editor"
  | "manager"
  | "admin"
  | "superadmin"

export interface Category {
  id: string
  parentId: string | null
  name: string
  slug: string
  description: string
  bannerUrl?: string
  image?: string // matching category photo
  icon: string // hugeicons key handled at render
  sortOrder: number
}

export interface Brand {
  id: string
  name: string
  slug: string
  description: string
  logoText: string // used for the wordmark tile
}

export interface SpecValue {
  key: string
  label: string
  value: string
  unit?: string
  /** headline specs surface in the Spec Strip */
  headline?: boolean
}

export interface ProductVariant {
  id: string
  sku: string
  color?: string
  colorHex?: string
  storage?: string
  price: number
  quantity: number
  isDefault?: boolean
}

export interface Review {
  id: string
  productId: string
  author: string
  rating: number
  title: string
  body: string
  pros?: string
  cons?: string
  verified: boolean
  helpfulVotes: number
  createdAt: string
}

export interface Product {
  id: string
  title: string
  slug: string
  sku: string
  categorySlug: string
  brandSlug: string
  description: string
  highlights: string[]
  warranty: string
  condition: Condition
  /** Label for the second variant axis on the PDP (e.g. "Size", "Volume", "Storage"). */
  optionLabel?: string
  regularPrice: number
  salePrice?: number
  stockStatus: StockStatus
  totalQuantity: number
  rating: number
  reviewCount: number
  isFeatured: boolean
  isTrending: boolean
  createdAt: string
  images: { url: string; alt: string }[]
  specs: SpecValue[]
  variants: ProductVariant[]
  metaTitle?: string
  metaDescription?: string
}

export interface CartLine {
  productId: string
  variantId: string
  quantity: number
}

export interface CartLineDetail extends CartLine {
  product: Product
  variant: ProductVariant
  unitPrice: number
  lineTotal: number
}

export interface CartSummary {
  lines: CartLineDetail[]
  itemCount: number
  subtotal: number
  taxTotal: number
  shippingTotal: number
  discountTotal: number
  grandTotal: number
  couponCode?: string
}

export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  paymentMethod: PaymentMethod
  createdAt: string
  items: {
    title: string
    variantLabel: string
    quantity: number
    unitPrice: number
    image: string
  }[]
  subtotal: number
  taxTotal: number
  shippingTotal: number
  discountTotal: number
  grandTotal: number
  fulfillment: "delivery" | "pickup"
  destination: string
  timeline: { status: OrderStatus; note: string; at: string }[]
}
