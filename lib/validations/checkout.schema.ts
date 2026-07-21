import { z } from "zod"

export const checkoutSchema = z
  .object({
    fullName: z.string().min(2, "Enter your name"),
    email: z.string().email("Enter a valid email"),
    fulfillment: z.enum(["delivery", "pickup"]),
    county: z.string().optional(),
    subCounty: z.string().optional(),
    estate: z.string().optional(),
    deliveryInstructions: z.string().max(500).optional(),
    pickupWarehouseId: z.string().optional(),
    paymentMethod: z.enum(["mpesa", "card", "bank", "cod"]),
    phoneForStk: z.string().optional(),
    couponCode: z.string().optional(),
  })
  .refine(
    (v) => (v.fulfillment === "pickup" ? !!v.pickupWarehouseId : !!v.county),
    { message: "Select a delivery county or a pickup station", path: ["county"] }
  )
  .refine(
    (v) => (v.paymentMethod === "mpesa" ? !!v.phoneForStk && v.phoneForStk.length >= 10 : true),
    { message: "Enter a phone number to receive the M-Pesa prompt", path: ["phoneForStk"] }
  )

export type CheckoutInput = z.infer<typeof checkoutSchema>

export const KENYA_COUNTIES = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Kiambu",
  "Uasin Gishu",
  "Machakos",
  "Kajiado",
] as const

export const PICKUP_STATIONS = [
  { id: "wh-nairobi-cbd", name: "Nairobi CBD — Kimathi Street", county: "Nairobi" },
  { id: "wh-westlands", name: "Westlands Hub — Sarit Centre", county: "Nairobi" },
  { id: "wh-mombasa", name: "Mombasa — Nyali Bridge", county: "Mombasa" },
  { id: "wh-kisumu", name: "Kisumu — Oginga Odinga St", county: "Kisumu" },
] as const
