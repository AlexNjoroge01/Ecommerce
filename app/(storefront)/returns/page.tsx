import type { Metadata } from "next"
import { PolicyPage } from "@/components/storefront/policy-page"

export const metadata: Metadata = {
  title: "Returns & Refunds",
  description:
    "Atlas Market offers a 30-day return window on eligible items. Here's how returns, exchanges, and refunds work.",
  alternates: { canonical: "/returns" },
}

export default function ReturnsPage() {
  return (
    <PolicyPage
      title="Returns & Refunds"
      updated="1 July 2026"
      sections={[
        {
          heading: "Our 30-day return window",
          body: [
            "You may return most items within 30 calendar days of delivery for a refund or exchange. The window starts the day your order is marked delivered, so an item delivered on the 1st can be returned up to and including the 31st. Some categories — groceries and opened beauty products among them — are excluded for hygiene reasons, and that's always stated on the product page.",
            "To be eligible, the item must be in its original condition — unused beyond reasonable inspection, with all accessories, manuals, and original sealed packaging intact. Items that have been physically damaged, engraved, or activated with a personal account may not qualify.",
          ],
        },
        {
          heading: "How to start a return",
          body: [
            "Open the order in your account and choose Request a return, or contact our support team with your order number. We'll issue a return authorisation and arrange collection or a drop-off at the nearest pickup station at no cost to you for eligible faults.",
            "Once we receive and inspect the item, we'll email you the outcome. Approved refunds are processed within 3–5 business days to your original payment method — M-Pesa refunds are typically instant on approval, while card refunds can take a few days to appear on your statement.",
          ],
        },
        {
          heading: "Exchanges & non-returnable items",
          body: [
            "Prefer a different model, colour, or storage size? Request an exchange during the return flow and we'll ship the replacement as soon as the original is on its way back to us.",
            "For hygiene and safety reasons, certain items cannot be returned once opened unless faulty: in-ear headphones and earbuds, screen protectors that have been applied, and software or digital licences that have been redeemed. Faulty goods are always covered — see our warranty policy.",
          ],
        },
        {
          heading: "Return shipping & restocking",
          body: [
            "Returns for a confirmed fault, a damaged-in-transit item, or an error on our part are entirely free — we cover collection and pay the refund in full.",
            "For change-of-mind returns, the item must be unopened and we may deduct the return logistics cost from your refund. We never charge a restocking fee on sealed, unopened products.",
          ],
        },
      ]}
    />
  )
}
