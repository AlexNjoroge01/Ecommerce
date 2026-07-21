import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    // Dummy/placeholder image providers: LoremFlickr (keyword-matched photos)
    // and pravatar (avatar faces). Seeded so each item stays stable.
    remotePatterns: [
      { protocol: "https", hostname: "loremflickr.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
  },
}

export default nextConfig
