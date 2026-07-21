import type { Metadata } from "next"
import { SupportClient } from "./support-client"

export const metadata: Metadata = { title: "Support", robots: { index: false } }

export default function AccountSupportPage() {
  return <SupportClient />
}
