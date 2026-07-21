export const SITE = {
  name: "Atlas Market",
  legalName: "Atlas Market",
  description:
    "Everything you love, in one place. Fashion, home, beauty, electronics, groceries and more — genuine brands, fair prices, and next-day delivery.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://atlasmarket.store",
  currency: "KES",
  locale: "en-KE",
  // Footer Spec-Strip stats (Design.md §2)
  stats: [
    { label: "PRODUCTS", value: "42,600" },
    { label: "BRANDS", value: "320" },
    { label: "DELIVERY", value: "<24H" },
    { label: "RETURNS", value: "30-DAY" },
  ],
} as const

export const SUPPORT = {
  phone: "+254 700 000 000",
  email: "care@atlasmarket.store",
  hours: "Mon–Sat, 8:00–20:00 EAT",
} as const
