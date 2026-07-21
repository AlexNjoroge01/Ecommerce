import { ImageResponse } from "next/og"
import { getProductBySlug } from "@/lib/queries"
import { SITE } from "@/lib/site"
import { formatPrice } from "@/lib/format"

export const runtime = "nodejs"

// Dynamic OG images for product/blog/category shares (Blueprint §19.4).
// e.g. /api/og/product/aurora-x1-pro
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params
  const [kind, ...rest] = slug
  const key = rest.join("/")

  let title: string = SITE.name
  let subtitle: string = "Everything you love, delivered"
  let price: string | null = null

  if (kind === "product") {
    const product = getProductBySlug(key)
    if (product) {
      title = product.title
      subtitle = product.brandSlug.toUpperCase()
      price = formatPrice(product.salePrice ?? product.regularPrice)
    }
  } else if (key) {
    title = decodeURIComponent(key).replace(/-/g, " ")
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "radial-gradient(60% 80% at 20% 20%, rgba(20,198,222,0.6), transparent 60%), radial-gradient(60% 80% at 85% 15%, rgba(52,87,255,0.55), transparent 55%), linear-gradient(120deg, #EAF4F7, #F7FAFC)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: "linear-gradient(135deg, #14C6DE, #3457FF)",
            }}
          />
          <div style={{ fontSize: 30, fontWeight: 700, color: "#0B1B2E" }}>
            Atlas Market
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 26, letterSpacing: 4, color: "#7C93A3" }}>
            {subtitle.toUpperCase()}
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#0B1B2E",
              lineHeight: 1.05,
              maxWidth: 980,
            }}
          >
            {title}
          </div>
          {price && (
            <div style={{ fontSize: 44, fontWeight: 700, color: "#3457FF" }}>{price}</div>
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
