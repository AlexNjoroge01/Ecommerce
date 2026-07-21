export type BlogCategory =
  | "buying-guide"
  | "review"
  | "how-to"
  | "comparison"
  | "news"

export interface BlogPost {
  slug: string
  title: string
  category: BlogCategory
  excerpt: string
  content: string[]
  imageKeywords: string
  author: string
  date: string // ISO yyyy-mm-dd
  readMins: number
}

export const BLOG_CATEGORY_LABELS: Record<BlogCategory, string> = {
  "buying-guide": "Buying guide",
  review: "Review",
  "how-to": "How-to",
  comparison: "Comparison",
  news: "News",
}

const POSTS: BlogPost[] = [
  {
    slug: "build-a-capsule-wardrobe",
    title: "How to build a capsule wardrobe that actually works",
    category: "buying-guide",
    excerpt:
      "A capsule wardrobe isn't about owning less — it's about owning pieces that all work together. Here's how to build one from a neutral base up, and where to spend versus save.",
    imageKeywords: "wardrobe,fashion,clothing",
    author: "Wanjiru Mwangi",
    date: "2026-06-28",
    readMins: 6,
    content: [
      "A capsule wardrobe isn't about owning less for its own sake — it's about owning pieces that all work together, so getting dressed takes ten seconds and you never stare at a full closet with nothing to wear. The goal is a small set of well-made basics in a coherent palette, plus a few pieces with personality.",
      "Start with a neutral base: two or three tees, a pair of well-fitting jeans, a versatile jacket, and shoes that go with everything. Buy the best quality you can here, because these are the pieces you'll wear twice a week. A heavyweight cotton tee that keeps its shape is worth three cheap ones that sag after a month.",
      "Then add colour and texture deliberately, not impulsively. One statement bag, one bold knit, one pair of shoes that make an outfit. Filter the Fashion category by your palette, sort by rating, and check the material on each spec strip — fabric and fit are what separate a piece you keep for years from one you donate in six months.",
    ],
  },
  {
    slug: "small-space-living-furniture",
    title: "Small-space living: furniture that pulls double duty",
    category: "how-to",
    excerpt:
      "In a compact apartment every piece has to earn its footprint. The trick isn't smaller furniture — it's furniture that does two jobs. Here's what to look for.",
    imageKeywords: "interior,furniture,livingroom",
    author: "Brian Kiptoo",
    date: "2026-06-14",
    readMins: 7,
    content: [
      "In a compact apartment every piece of furniture has to earn its footprint. The trick isn't buying smaller things — it's buying things that do two jobs, so one purchase clears two needs and the floor stays open.",
      "Look for storage hidden in plain sight: a sofa with under-seat storage, a bed frame with drawers, a coffee table that lifts to become a desk. Sofas earn special attention because they anchor the room — measure your doorway before you fall in love with a three-seater, and favour tight, tailored proportions over deep, sprawling ones in a small space.",
      "Light and material do the rest. Lighter upholstery and slim legs make a room feel bigger; a few warm textures — linen, ceramic, wood — keep it from feeling clinical. Browse Home & Living, check the dimensions on each spec strip against your actual room, and build around one or two hero pieces rather than filling every corner.",
    ],
  },
  {
    slug: "no-nonsense-skincare-routine",
    title: "Your no-nonsense skincare routine, in five steps",
    category: "how-to",
    excerpt:
      "Skincare marketing wants you to own twelve products. Your skin wants about five, used consistently. Here's the shortest routine that actually covers the essentials.",
    imageKeywords: "skincare,beauty,cosmetics",
    author: "Aisha Omar",
    date: "2026-05-30",
    readMins: 5,
    content: [
      "Skincare marketing wants you to own twelve products. Your skin wants about five, used consistently. A routine you'll actually keep up beats an elaborate one you abandon after a week, so the aim here is the shortest routine that covers the essentials.",
      "Morning: a gentle cleanser, a hydrating serum, a moisturiser, and — the non-negotiable — sunscreen. Evening: cleanse again, then the same serum and moisturiser. That's it. A multi-weight hyaluronic serum is the highest-leverage single product for most people, because hydration plumps fine lines and helps everything else absorb.",
      "Introduce actives slowly and one at a time — a retinol or a vitamin C — so you can tell what your skin likes and dial back if it complains. Filter the Beauty category by skin type, read the key active on each spec strip, and resist the urge to buy the whole shelf at once.",
    ],
  },
  {
    slug: "wireless-earbuds-under-15k-ranked",
    title: "Wireless earbuds under KES 15,000, ranked",
    category: "review",
    excerpt:
      "This bracket has quietly caught up to what cost twice as much two years ago. ANC, multipoint and all-day battery are now the baseline — so how do you choose?",
    imageKeywords: "earbuds,headphones,audio",
    author: "Wanjiru Mwangi",
    date: "2026-05-12",
    readMins: 6,
    content: [
      "The sub-KES-15,000 earbud bracket has quietly caught up to what cost twice as much two years ago: active noise cancellation, multipoint pairing, and all-day battery are now the baseline rather than the premium. That makes this the sweet spot for most buyers, and it makes choosing harder because the specs look identical on paper.",
      "The differences show up in fit and software. A secure, comfortable fit is what makes ANC work at all — a poor seal leaks in exactly the noise you paid to remove — so favour pairs with multiple tip sizes and a stable shape. In software, look for a companion app that lets you tune the sound and switch cleanly between your phone and laptop.",
      "For the Nairobi commute we'd prioritise, in order: fit, ANC quality, then battery. Check the headline spec strip on each card for battery, Bluetooth version, and water rating — IPX4 or better if they'll ever see a workout or the rain.",
    ],
  },
  {
    slug: "better-coffee-at-home",
    title: "Better coffee at home, without the barista budget",
    category: "how-to",
    excerpt:
      "The biggest upgrade to your home coffee isn't a machine — it's fresh, well-sourced beans, ground just before you brew. Here's how to get a café cup at home.",
    imageKeywords: "coffee,beans,brewing",
    author: "Brian Kiptoo",
    date: "2026-04-22",
    readMins: 5,
    content: [
      "The single biggest upgrade to your home coffee isn't a machine — it's fresh, well-sourced beans and grinding them just before you brew. Coffee starts losing its aromatics within minutes of grinding, which is why a modest setup with fresh beans beats an expensive one running stale pre-ground.",
      "Buy whole beans in quantities you'll finish in two to three weeks, store them airtight and away from light, and match the grind to your method: coarse for a French press, medium for a pour-over or filter, fine for espresso. A single-origin medium roast is the most forgiving place to start — balanced, hard to make bitter, and pleasant across methods.",
      "From there it's ratios and water. Aim for roughly 60 grams of coffee per litre of water, use water just off the boil, and adjust to taste. Browse the Groceries category, pick a fresh-roasted bag in your preferred grind, and you're most of the way to a café cup at home.",
    ],
  },
]

export function getPosts(): BlogPost[] {
  return [...POSTS].sort((a, b) => b.date.localeCompare(a.date))
}

export function getPostBySlug(slug: string): BlogPost | null {
  return POSTS.find((p) => p.slug === slug) ?? null
}
