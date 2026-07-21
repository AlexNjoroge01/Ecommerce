/*
  Dummy image helpers. LoremFlickr serves real, keyword-matched photos (not
  random), and the `lock` param keeps a given item's photo stable across loads.
  So a coffee product always shows coffee, a sofa shows a sofa, etc. Swap these
  for CDN/object-storage URLs when real photography exists (Blueprint §22).
*/

function seededLock(seed: string): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0
  return (Math.abs(h) % 900) + 1
}

/**
 * A keyword-matched photo. `keywords` are comma-separated tags (e.g.
 * "trail,running,shoes"). `lock` (a stable seed string or number) keeps the same
 * photo for the same item across renders.
 */
export function photo(
  keywords: string,
  w: number,
  h: number = w,
  lock?: string | number
): string {
  const tags = keywords.trim().replace(/\s+/g, ",")
  const n = typeof lock === "number" ? lock : seededLock(lock ?? tags)
  return `https://loremflickr.com/${w}/${h}/${encodeURIComponent(tags)}?lock=${n}`
}

/** Avatar face for reviews/testimonials. */
export function avatar(seed: string, size = 96): string {
  return `https://i.pravatar.cc/${size}?u=${encodeURIComponent(seed)}`
}

export function isImageUrl(value: string | undefined | null): boolean {
  return typeof value === "string" && /^https?:\/\//.test(value)
}

export const HERO_IMAGE = photo("shopping,retail,lifestyle", 1200, 1000, "atlas-hero")
