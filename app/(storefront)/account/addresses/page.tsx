import type { Metadata } from "next"
import { AddressesClient } from "./addresses-client"

export const metadata: Metadata = { title: "Addresses", robots: { index: false } }

export default function AccountAddressesPage() {
  return <AddressesClient />
}
