import type { Metadata } from "next"
import { PolicyPage } from "@/components/storefront/policy-page"
import { SITE, SUPPORT } from "@/lib/site"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Atlas Market collects, uses, and protects your personal data, and the rights you have over it.",
  alternates: { canonical: "/privacy" },
}

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      updated="1 July 2026"
      sections={[
        {
          heading: "Who we are",
          body: [
            `This policy explains how ${SITE.legalName} ("${SITE.name}", "we", "us") handles your personal data when you browse, create an account, or place an order with us. It applies to our website and our customer support channels.`,
            "We process personal data in line with Kenya's Data Protection Act, 2019. If you have any questions, you can reach our team at any time using the contact details at the end of this policy.",
          ],
        },
        {
          heading: "What we collect",
          body: [
            "Information you give us: your name, email address, phone number, and delivery address when you register or check out; order and payment confirmation details; and the content of any messages you send our support team.",
            "Information we collect automatically: basic device and browser information, pages viewed, and items saved or added to your cart. This helps us keep the store secure, fix problems, and remember your session. We do not store full card numbers — payments are handled by our regulated M-Pesa and card processors.",
          ],
        },
        {
          heading: "How we use your data",
          body: [
            "We use your data to process and deliver orders, provide customer support, handle returns and warranty claims, prevent fraud, and meet our legal and tax obligations. We'll only send you marketing messages if you've opted in, and you can unsubscribe from any of them at any time.",
            "We never sell your personal data. We share it only with the service providers we need to run the store — delivery partners, payment processors, and infrastructure providers — and only the minimum they need to do their job on our behalf.",
          ],
        },
        {
          heading: "Data retention & security",
          body: [
            "We keep order and account records for as long as your account is active and for any period required by law afterwards, such as for tax and accounting. When data is no longer needed, we delete or anonymise it.",
            "We protect your data with encryption in transit, access controls, and regular security reviews. No system is perfectly secure, but we work to keep the risk of unauthorised access as low as practicable.",
          ],
        },
        {
          heading: "Your rights & contact",
          body: [
            "You have the right to access the personal data we hold about you, to correct inaccuracies, to request deletion, and to object to or withdraw consent for certain processing. You can exercise most of these directly from your account settings, or by contacting us.",
            `To make a request or raise a concern, email ${SUPPORT.email} or call ${SUPPORT.phone}. We'll respond within the timeframes set out under applicable law.`,
          ],
        },
      ]}
    />
  )
}
