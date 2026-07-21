import type { Brand, Category, Product, Review } from "@/lib/types"
import { photo } from "@/lib/images"

/*
  Seed catalog for Atlas Market — a general marketplace (fashion, home, beauty,
  electronics, sports, groceries, toys, books). The storefront reads through
  lib/queries.ts, which uses this dataset when DATABASE_URL is unset and
  Drizzle/Neon when it's set. Product/category images are keyword-matched photos
  (lib/images.ts) so they always look on-topic, not random.
*/

export const categories: Category[] = [
  { id: "c-fashion", parentId: null, name: "Fashion", slug: "fashion", icon: "shirt", sortOrder: 1, description: "Everyday essentials and standout pieces for the whole wardrobe.", image: photo("fashion,clothing,apparel", 600, 640, "cat-fashion") },
  { id: "c-home", parentId: null, name: "Home & Living", slug: "home-living", icon: "sofa", sortOrder: 2, description: "Furniture, décor and the small things that make a house yours.", image: photo("home,interior,livingroom", 600, 640, "cat-home") },
  { id: "c-beauty", parentId: null, name: "Beauty & Care", slug: "beauty", icon: "sparkles", sortOrder: 3, description: "Skincare, makeup and self-care from brands that deliver.", image: photo("cosmetics,beauty,skincare", 600, 640, "cat-beauty") },
  { id: "c-electronics", parentId: null, name: "Electronics", slug: "electronics", icon: "phone", sortOrder: 4, description: "Gadgets and gear, verified and warrantied.", image: photo("electronics,gadgets,tech", 600, 640, "cat-elec") },
  { id: "c-sports", parentId: null, name: "Sports & Outdoors", slug: "sports", icon: "dumbbell", sortOrder: 5, description: "Kit for training, trails and everything in between.", image: photo("sports,fitness,outdoor", 600, 640, "cat-sports") },
  { id: "c-groceries", parentId: null, name: "Groceries", slug: "groceries", icon: "basket", sortOrder: 6, description: "Pantry staples and specialty picks, delivered fresh.", image: photo("groceries,food,market", 600, 640, "cat-groceries") },
  { id: "c-toys", parentId: null, name: "Toys & Games", slug: "toys", icon: "toys", sortOrder: 7, description: "Play that lasts — for kids and the young at heart.", image: photo("toys,kids,games", 600, 640, "cat-toys") },
  { id: "c-books", parentId: null, name: "Books", slug: "books", icon: "book", sortOrder: 8, description: "Fiction, non-fiction and cookbooks worth the shelf space.", image: photo("books,library,reading", 600, 640, "cat-books") },
]

export const brands: Brand[] = [
  { id: "b-maru", name: "Maru", slug: "maru", logoText: "Maru", description: "Considered everyday clothing." },
  { id: "b-everie", name: "Everie", slug: "everie", logoText: "Everie", description: "Furniture and home goods, made to last." },
  { id: "b-lumo", name: "Lumo", slug: "lumo", logoText: "Lumo", description: "Clean beauty and skincare." },
  { id: "b-kova", name: "Kova", slug: "kova", logoText: "Kova", description: "Everyday electronics that just work." },
  { id: "b-northwind", name: "Northwind", slug: "northwind", logoText: "Northwind", description: "Gear for sport and the outdoors." },
  { id: "b-pantry", name: "Pantry", slug: "pantry", logoText: "Pantry", description: "Real food, honestly sourced." },
  { id: "b-bloomkin", name: "Bloomkin", slug: "bloomkin", logoText: "Bloomkin", description: "Toys and games for curious minds." },
  { id: "b-paperbound", name: "Paperbound", slug: "paperbound", logoText: "Paperbound", description: "Books we love to recommend." },
]

let seq = 0
type Draft = {
  title: string
  brand: string
  category: string
  regular: number
  sale?: number
  condition?: Product["condition"]
  stock?: Product["stockStatus"]
  qty?: number
  rating: number
  reviews: number
  featured?: boolean
  trending?: boolean
  keywords: string
  warranty?: string
  highlights: string[]
  specs: [string, string, string, string?, boolean?][] // key,label,value,unit,headline
  colors?: [string, string][] // name,hex
  options?: string[]
  optionLabel?: string
  blurb: string
}

function build(d: Draft): Product {
  seq += 1
  const slug = d.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  const sku = `ATM-${d.brand.slice(0, 3).toUpperCase()}-${String(1000 + seq)}`
  const basePrice = d.sale ?? d.regular
  const colors = d.colors ?? [["Default", "#7c93a3"]]
  const options = d.options ?? [""]
  const variants = colors.flatMap((c, ci) =>
    options.map((o, oi) => ({
      id: `${slug}-v-${ci}-${oi}`,
      sku: `${sku}-${ci}${oi}`,
      color: c[0] === "Default" ? undefined : c[0],
      colorHex: c[0] === "Default" ? undefined : c[1],
      storage: o || undefined,
      price: basePrice,
      quantity: d.qty ?? 24,
      isDefault: ci === 0 && oi === 0,
    }))
  )
  return {
    id: `p-${seq}`,
    title: d.title,
    slug,
    sku,
    categorySlug: d.category,
    brandSlug: d.brand,
    description: d.blurb,
    highlights: d.highlights,
    warranty: d.warranty ?? "30-day returns · 12-month guarantee",
    condition: d.condition ?? "new",
    optionLabel: d.optionLabel,
    regularPrice: d.regular,
    salePrice: d.sale,
    stockStatus: d.stock ?? "in_stock",
    totalQuantity: d.qty ?? 24,
    rating: d.rating,
    reviewCount: d.reviews,
    isFeatured: d.featured ?? false,
    isTrending: d.trending ?? false,
    createdAt: `2026-0${(seq % 6) + 1}-1${seq % 9}T09:00:00Z`,
    images: [
      { url: photo(d.keywords, 900, 900, seq * 10 + 1), alt: `${d.title}` },
      { url: photo(d.keywords, 900, 900, seq * 10 + 2), alt: `${d.title} detail` },
      { url: photo(d.keywords, 900, 900, seq * 10 + 3), alt: `${d.title} in use` },
      { url: photo(d.keywords, 900, 900, seq * 10 + 4), alt: `${d.title} alternate` },
    ],
    specs: d.specs.map(([key, label, value, unit, headline]) => ({
      key,
      label,
      value,
      unit,
      headline: headline ?? false,
    })),
    variants,
    metaTitle: `${d.title} | Atlas Market`,
    metaDescription: d.blurb.slice(0, 155),
  }
}

export const products: Product[] = [
  // ── Fashion ──────────────────────────────────────────────
  build({
    title: "Everyday Cotton Crew Tee", brand: "maru", category: "fashion", regular: 1899, sale: 1499,
    rating: 4.6, reviews: 210, featured: true, trending: true, keywords: "tshirt,cotton,apparel",
    optionLabel: "Size", options: ["S", "M", "L", "XL"],
    colors: [["White", "#f2f2f2"], ["Black", "#1a1d22"], ["Navy", "#23324a"], ["Sage", "#8ea88f"]],
    blurb: "A wardrobe workhorse in heavyweight combed cotton that keeps its shape wash after wash. Ribbed collar, clean side seams, and a fit that isn't too slim or too boxy.",
    highlights: ["Heavyweight combed cotton", "Pre-shrunk, holds its shape", "Ribbed crew neck", "Ethically made"],
    specs: [["material", "Material", "100% Cotton", "", true], ["fit", "Fit", "Regular", "", true], ["care", "Care", "Machine wash", "", true], ["neck", "Neckline", "Crew", ""], ["gsm", "Weight", "220", "gsm"]],
  }),
  build({
    title: "Slim Fit Stretch Jeans", brand: "maru", category: "fashion", regular: 4499, sale: 3599,
    rating: 4.4, reviews: 96, keywords: "jeans,denim,trousers",
    optionLabel: "Waist", options: ["30", "32", "34", "36"],
    colors: [["Indigo", "#35485f"], ["Black", "#1a1d22"], ["Stone", "#9a8f7c"]],
    blurb: "A slim-but-comfortable jean cut from stretch denim that moves with you. Mid-rise, five pockets, and a finish that dresses up or down.",
    highlights: ["Stretch denim, all-day comfort", "Mid-rise, slim leg", "Reinforced stitching", "Five-pocket classic"],
    specs: [["material", "Material", "Denim + Elastane", "", true], ["fit", "Fit", "Slim", "", true], ["rise", "Rise", "Mid", "", true], ["care", "Care", "Machine wash cold", ""]],
  }),
  build({
    title: "Leather Crossbody Bag", brand: "maru", category: "fashion", regular: 6999,
    rating: 4.7, reviews: 134, featured: true, keywords: "handbag,leather,bag",
    colors: [["Tan", "#b0805a"], ["Black", "#1a1d22"], ["Burgundy", "#6d2634"]],
    blurb: "A compact everyday bag in full-grain leather that only looks better with age. Adjustable strap, secure zip, and just enough room for the essentials.",
    highlights: ["Full-grain leather", "Adjustable, removable strap", "Secure zip closure", "Interior card slots"],
    specs: [["material", "Material", "Full-grain leather", "", true], ["strap", "Strap", "Adjustable", "", true], ["closure", "Closure", "Zip", "", true], ["dim", "Size", "24 x 16 x 7", "cm"]],
  }),

  // ── Home & Living ────────────────────────────────────────
  build({
    title: "Nordic Linen 3-Seater Sofa", brand: "everie", category: "home-living", regular: 89999, sale: 79999,
    rating: 4.8, reviews: 63, featured: true, trending: true, stock: "low_stock", qty: 6, keywords: "sofa,couch,livingroom",
    colors: [["Oat", "#d9cdb8"], ["Slate", "#4a5560"], ["Forest", "#2f4436"]],
    blurb: "A clean-lined three-seater on a solid oak frame, wrapped in hard-wearing linen. Deep enough to sink into, tailored enough for a small living room.",
    highlights: ["Solid oak frame", "Hard-wearing linen weave", "High-resilience foam", "Assembles in minutes"],
    specs: [["seats", "Seats", "3", "", true], ["frame", "Frame", "Solid oak", "", true], ["fabric", "Upholstery", "Linen", "", true], ["dim", "Dimensions", "210 x 90 x 85", "cm", true], ["weight", "Weight", "42", "kg"]],
  }),
  build({
    title: "Handmade Ceramic Dinner Set", brand: "everie", category: "home-living", regular: 8999, sale: 6999,
    rating: 4.5, reviews: 88, trending: true, keywords: "dinnerware,ceramic,plates",
    colors: [["Cream", "#efe7d8"], ["Charcoal", "#33383d"], ["Terracotta", "#b05c3f"]],
    blurb: "A 16-piece stoneware set with a soft reactive glaze — no two pieces exactly alike. Service for four that's happy in the dishwasher and the microwave.",
    highlights: ["16 pieces, service for 4", "Reactive glaze finish", "Dishwasher & microwave safe", "Chip-resistant stoneware"],
    specs: [["pieces", "Pieces", "16", "", true], ["material", "Material", "Stoneware", "", true], ["dishwasher", "Dishwasher", "Safe", "", true], ["microwave", "Microwave", "Safe", ""]],
  }),
  build({
    title: "Soy Wax Aroma Candle", brand: "everie", category: "home-living", regular: 1799,
    rating: 4.6, reviews: 152, keywords: "candle,scented,home",
    optionLabel: "Scent", options: ["Sandalwood", "Vanilla", "Sea Salt"],
    blurb: "A clean-burning soy candle with a cotton wick and a scent throw that fills the room without overwhelming it. Hand-poured in small batches.",
    highlights: ["100% soy wax", "45-hour burn time", "Cotton wick, clean burn", "Reusable glass vessel"],
    specs: [["burn", "Burn time", "45", "hr", true], ["wax", "Wax", "Soy", "", true], ["net", "Net weight", "220", "g", true]],
  }),

  // ── Beauty & Care ────────────────────────────────────────
  build({
    title: "Hydrating Hyaluronic Serum", brand: "lumo", category: "beauty", regular: 3499, sale: 2799,
    rating: 4.7, reviews: 264, featured: true, trending: true, keywords: "serum,skincare,cosmetics",
    optionLabel: "Size", options: ["30ml", "50ml"],
    blurb: "A lightweight serum that layers multiple molecular weights of hyaluronic acid for hydration that reaches deeper and lasts longer. Fragrance-free and non-sticky.",
    highlights: ["Multi-weight hyaluronic acid", "Fragrance-free", "Non-sticky finish", "Cruelty-free & vegan"],
    specs: [["volume", "Volume", "30", "ml", true], ["skin", "Skin type", "All", "", true], ["active", "Key active", "Hyaluronic", "", true], ["cruelty", "Cruelty-free", "Yes", ""]],
  }),
  build({
    title: "Velvet Matte Lipstick", brand: "lumo", category: "beauty", regular: 1599,
    rating: 4.4, reviews: 118, keywords: "lipstick,makeup,beauty",
    colors: [["Rosewood", "#a15a5a"], ["Brick", "#9e4b3a"], ["Mauve", "#8a6a7d"], ["Coral", "#d1685a"]],
    blurb: "A creamy matte that goes on in one swipe and stays put for hours without drying your lips out. Buildable, transfer-resistant colour.",
    highlights: ["One-swipe payoff", "8-hour wear", "Non-drying matte", "Buildable colour"],
    specs: [["finish", "Finish", "Matte", "", true], ["net", "Net weight", "3.5", "g", true], ["wear", "Wear time", "8", "hr", true]],
  }),
  build({
    title: "Bamboo Skincare Gift Set", brand: "lumo", category: "beauty", regular: 5999, sale: 4999,
    rating: 4.6, reviews: 74, featured: true, keywords: "skincare,spa,cosmetics",
    blurb: "A five-step routine boxed in a keepsake bamboo tray: cleanser, toner, serum, moisturiser and mask. A thoughtful gift or a full reset for your own shelf.",
    highlights: ["Complete 5-step routine", "Vegan formulas", "Recyclable bamboo tray", "Gift-ready packaging"],
    specs: [["items", "Items", "5", "", true], ["type", "Formula", "Vegan", "", true], ["boxed", "Gift boxed", "Yes", "", true]],
  }),

  // ── Electronics ──────────────────────────────────────────
  build({
    title: "Wireless Noise-Cancelling Earbuds", brand: "kova", category: "electronics", regular: 12999, sale: 9999,
    rating: 4.6, reviews: 341, featured: true, trending: true, keywords: "earbuds,headphones,wireless",
    colors: [["Black", "#1a1d22"], ["White", "#eceff2"], ["Sand", "#d8cbb6"]],
    blurb: "Active noise cancellation, a secure all-day fit, and eight hours per charge. Multipoint pairing keeps your phone and laptop connected at once.",
    highlights: ["Active noise cancellation", "8h + 24h with case", "Multipoint Bluetooth 5.3", "IPX4 sweat resistant"],
    specs: [["battery", "Battery", "8+24", "hr", true], ["anc", "ANC", "Active", "", true], ["bt", "Bluetooth", "5.3", "", true], ["water", "Rating", "IPX4", ""]],
  }),
  build({
    title: "4K Streaming Media Stick", brand: "kova", category: "electronics", regular: 6499, sale: 4999,
    rating: 4.5, reviews: 156, trending: true, keywords: "streaming,tv,device",
    blurb: "Turns any TV into a smart TV with 4K HDR streaming, a voice remote, and all the apps you actually use. Plugs straight into HDMI.",
    highlights: ["4K HDR streaming", "Voice remote included", "Dual-band Wi-Fi", "All major apps"],
    specs: [["output", "Output", "4K HDR", "", true], ["wifi", "Wi-Fi", "Dual-band", "", true], ["storage", "Storage", "8", "GB", true]],
  }),
  build({
    title: "Smart LED Bulb 2-Pack", brand: "kova", category: "electronics", regular: 2499,
    rating: 4.3, reviews: 97, keywords: "lightbulb,led,smart",
    blurb: "Sixteen million colours, warm-to-cool whites, and control from your phone or voice. Set scenes, schedules, and wake-up fades without a hub.",
    highlights: ["16M colours + tunable white", "App & voice control", "No hub required", "Schedules & scenes"],
    specs: [["lumens", "Brightness", "800", "lm", true], ["colours", "Colours", "16M", "", true], ["control", "Control", "App + Voice", "", true]],
  }),

  // ── Sports & Outdoors ────────────────────────────────────
  build({
    title: "Trail Running Shoes", brand: "northwind", category: "sports", regular: 8999, sale: 6999,
    rating: 4.7, reviews: 189, featured: true, trending: true, keywords: "running,shoes,trail",
    optionLabel: "Size", options: ["40", "41", "42", "43", "44"],
    colors: [["Volt", "#b8e04a"], ["Slate", "#4a5560"], ["Black", "#1a1d22"]],
    blurb: "Aggressive lugs for grip on loose ground, a rock plate to shrug off sharp trails, and a breathable upper that drains fast when things get wet.",
    highlights: ["Lugged grip outsole", "Protective rock plate", "Breathable, quick-drain upper", "Cushioned for long miles"],
    specs: [["weight", "Weight", "280", "g", true], ["drop", "Drop", "8", "mm", true], ["use", "Use", "Trail", "", true], ["grip", "Outsole", "Lugged", ""]],
  }),
  build({
    title: "Non-Slip Yoga Mat", brand: "northwind", category: "sports", regular: 3299,
    rating: 4.5, reviews: 132, keywords: "yoga,mat,fitness",
    colors: [["Teal", "#2fa39a"], ["Coral", "#d1685a"], ["Charcoal", "#33383d"]],
    blurb: "A 6mm TPE mat with real grip, wet or dry, and enough cushion to protect your joints. Lightweight, closed-cell, and easy to wipe clean.",
    highlights: ["6mm cushioned TPE", "Grippy, non-slip surface", "Closed-cell, hygienic", "Carry strap included"],
    specs: [["thickness", "Thickness", "6", "mm", true], ["material", "Material", "TPE", "", true], ["length", "Length", "183", "cm", true]],
  }),
  build({
    title: "Insulated Steel Water Bottle 1L", brand: "northwind", category: "sports", regular: 2299, sale: 1799,
    rating: 4.6, reviews: 220, keywords: "waterbottle,flask,steel",
    colors: [["Steel", "#c9ced4"], ["Black", "#1a1d22"], ["Ocean", "#2b6b8a"]],
    blurb: "Double-walled stainless steel that keeps cold drinks cold for a full day and hot drinks hot till lunch. Leakproof lid, powder-coated grip.",
    highlights: ["Cold 24h / hot 12h", "Leakproof lid", "Powder-coated grip", "BPA-free"],
    specs: [["capacity", "Capacity", "1", "L", true], ["cold", "Keeps cold", "24", "hr", true], ["hot", "Keeps hot", "12", "hr", true]],
  }),

  // ── Groceries ────────────────────────────────────────────
  build({
    title: "Organic Arabica Coffee Beans 1kg", brand: "pantry", category: "groceries", regular: 2499, sale: 1999,
    rating: 4.8, reviews: 276, featured: true, trending: true, keywords: "coffee,beans,roast",
    optionLabel: "Grind", options: ["Whole bean", "Filter", "Espresso"],
    blurb: "Single-origin Arabica, medium-roasted for a balanced cup with notes of cocoa and citrus. Roasted to order and sealed with a freshness valve.",
    highlights: ["Single-origin Arabica", "Medium roast, balanced", "Roasted to order", "Resealable valve bag"],
    specs: [["weight", "Weight", "1", "kg", true], ["roast", "Roast", "Medium", "", true], ["origin", "Origin", "Single-origin", "", true]],
  }),
  build({
    title: "Raw Forest Honey 500g", brand: "pantry", category: "groceries", regular: 1299,
    rating: 4.7, reviews: 143, keywords: "honey,jar,organic",
    blurb: "Unheated, unfiltered honey from forest wildflowers — thick, aromatic, and exactly as the bees made it. Crystallises naturally, which is a good sign.",
    highlights: ["Raw & unfiltered", "Forest wildflower source", "No additives", "Glass jar"],
    specs: [["weight", "Weight", "500", "g", true], ["type", "Type", "Raw", "", true], ["filtered", "Unfiltered", "Yes", "", true]],
  }),
  build({
    title: "Cold-Pressed Olive Oil 750ml", brand: "pantry", category: "groceries", regular: 1899,
    rating: 4.6, reviews: 98, keywords: "oliveoil,bottle,cooking",
    blurb: "Extra-virgin oil cold-pressed within hours of harvest, with a peppery finish that tells you it's the real thing. Great for finishing and everyday cooking.",
    highlights: ["Cold-pressed extra virgin", "Low acidity", "Peppery, fresh finish", "Dark glass bottle"],
    specs: [["volume", "Volume", "750", "ml", true], ["grade", "Grade", "Extra virgin", "", true], ["acidity", "Acidity", "<0.3", "%", true]],
  }),

  // ── Toys & Games ─────────────────────────────────────────
  build({
    title: "Wooden Building Blocks 100pc", brand: "bloomkin", category: "toys", regular: 3499, sale: 2799,
    rating: 4.7, reviews: 165, featured: true, trending: true, keywords: "toys,blocks,wooden",
    blurb: "A hundred smooth beech blocks in natural and coloured finishes, sized for small hands. Open-ended play that outlasts the batteries in everything else.",
    highlights: ["100 solid beech blocks", "Non-toxic water-based paint", "Age 3+", "Cotton storage bag"],
    specs: [["pieces", "Pieces", "100", "", true], ["material", "Material", "Beech wood", "", true], ["age", "Age", "3+", "", true]],
  }),
  build({
    title: "Family Strategy Board Game", brand: "bloomkin", category: "toys", regular: 3999,
    rating: 4.5, reviews: 121, keywords: "boardgame,game,family",
    blurb: "Easy to learn, hard to master — a tile-laying game that plays in an hour and gets better every time. The kind of box that comes off the shelf on repeat.",
    highlights: ["Learn in 5 minutes", "2–6 players", "~60 minute games", "High replay value"],
    specs: [["players", "Players", "2–6", "", true], ["age", "Age", "10+", "", true], ["time", "Play time", "60", "min", true]],
  }),

  // ── Books ────────────────────────────────────────────────
  build({
    title: "The Midnight Atlas — A Novel", brand: "paperbound", category: "books", regular: 1499, sale: 1199,
    rating: 4.6, reviews: 208, featured: true, keywords: "book,novel,reading",
    optionLabel: "Format", options: ["Paperback", "Hardcover", "eBook"],
    blurb: "A sweeping, map-obsessed mystery that follows a cartographer chasing a city that shouldn't exist. The word-of-mouth novel of the season.",
    highlights: ["Bestselling literary mystery", "384 pages", "Book-club favourite", "Multiple formats"],
    specs: [["pages", "Pages", "384", "", true], ["format", "Format", "Paperback", "", true], ["lang", "Language", "English", "", true]],
  }),
  build({
    title: "Cook Simple: 100 Everyday Recipes", brand: "paperbound", category: "books", regular: 2299,
    rating: 4.7, reviews: 154, trending: true, keywords: "cookbook,recipes,food",
    blurb: "A hundred fuss-free recipes built around what's already in your kitchen, each on a single page with a photo. Weeknight dinner, solved.",
    highlights: ["100 one-page recipes", "Everyday ingredients", "A photo for every dish", "Hardcover, lay-flat binding"],
    specs: [["pages", "Pages", "256", "", true], ["format", "Format", "Hardcover", "", true], ["recipes", "Recipes", "100", "", true]],
  }),
]

export const reviews: Review[] = [
  { id: "r1", productId: "p-1", author: "Wanjiru M.", rating: 5, title: "My new go-to tee", body: "Bought one, then came back for four more. The cotton is thick without being heavy and it still looks new after a month of washes.", pros: "Fabric, fit, colour range", cons: "Runs slightly large", verified: true, helpfulVotes: 34, createdAt: "2026-05-11T10:00:00Z" },
  { id: "r2", productId: "p-4", author: "Brian K.", rating: 5, title: "Looks far more expensive than it is", body: "Assembly took ten minutes and the linen feels premium. Comfortable enough to fall asleep on, which I've now done several times.", pros: "Comfort, build, looks", verified: true, helpfulVotes: 21, createdAt: "2026-05-18T10:00:00Z" },
  { id: "r3", productId: "p-10", author: "Aisha O.", rating: 5, title: "The commute is finally quiet", body: "ANC is genuinely good for the price and the fit stays put on a run. Battery easily lasts my week of commuting.", pros: "ANC, fit, battery", verified: true, helpfulVotes: 27, createdAt: "2026-04-30T10:00:00Z" },
  { id: "r4", productId: "p-13", author: "Daniel W.", rating: 5, title: "Grippy and comfortable", body: "Took them straight onto a muddy trail and they held on everything. No hot spots after 15km.", pros: "Grip, comfort", verified: true, helpfulVotes: 18, createdAt: "2026-06-02T10:00:00Z" },
  { id: "r5", productId: "p-16", author: "Faith N.", rating: 5, title: "Best coffee I've ordered online", body: "Arrived days after roasting and you can tell. Balanced, not bitter — the espresso grind is dialled in perfectly.", pros: "Freshness, flavour", verified: true, helpfulVotes: 31, createdAt: "2026-06-14T10:00:00Z" },
  { id: "r6", productId: "p-7", author: "Naomi J.", rating: 4, title: "Skin drinks it up", body: "Absorbs fast with no stickiness and my skin looks plumper in the mornings. Wish the 50ml was better value.", pros: "Hydration, texture", cons: "Price per ml", verified: true, helpfulVotes: 12, createdAt: "2026-06-20T10:00:00Z" },
]
