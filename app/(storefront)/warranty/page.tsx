import type { Metadata } from "next"
import { PolicyPage } from "@/components/storefront/policy-page"

export const metadata: Metadata = {
  title: "Warranty",
  description:
    "Most Atlas Market products carry a 12-month local guarantee. Here's what's covered, what isn't, and how to make a claim.",
  alternates: { canonical: "/warranty" },
}

export default function WarrantyPage() {
  return (
    <PolicyPage
      title="Warranty"
      updated="1 July 2026"
      sections={[
        {
          heading: "12 months of local coverage",
          body: [
            "The large majority of products we sell carry a 12-month guarantee against manufacturing defects, handled locally so you never have to ship anything abroad to make a claim. The exact term is printed on each product page — some categories carry longer manufacturer warranties, and it is always stated up front.",
            "Coverage begins on the date of delivery. Your order record is your proof of purchase, so there's nothing to register manually — the warranty is linked to your account automatically the moment payment clears.",
          ],
        },
        {
          heading: "What's covered",
          body: [
            "The warranty covers defects in materials and workmanship under normal use: components that fail without external cause, batteries that degrade beyond the manufacturer's stated threshold within the term, and functional faults present from the factory.",
            "If a covered fault is confirmed, we'll repair the item, replace it with an equivalent unit, or refund it — the remedy is at our discretion and follows the manufacturer's authorised process to keep your coverage valid.",
          ],
        },
        {
          heading: "What's not covered",
          body: [
            "Accidental or physical damage — drops, cracks, crushing, tears, or misuse — is not covered, nor is normal wear and tear, nor liquid damage unless the product is rated and marketed as water-resistant and used within that rating.",
            "Also excluded: normal cosmetic wear, damage from unauthorised repairs or third-party parts, use of non-approved chargers or accessories, and consumable wear such as expected battery capacity loss over long-term use. Software issues caused by user modification fall outside the warranty.",
          ],
        },
        {
          heading: "Making a claim",
          body: [
            "Start a claim from the order in your account, or contact support with your order number and a short description of the fault — photos or a short video help us diagnose faster. We'll issue a claim reference and arrange free collection or a pickup-station drop-off.",
            "Most claims are assessed within 3–5 business days of the unit reaching our service centre. We'll keep you updated at each step through your account, and where a repair is needed we'll confirm the expected turnaround before proceeding.",
          ],
        },
      ]}
    />
  )
}
