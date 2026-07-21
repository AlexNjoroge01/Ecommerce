import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { MagicLinkForm } from "@/components/storefront/auth-forms"
import { Logo } from "@/components/storefront/logo"

export const metadata: Metadata = { title: "Create account", robots: { index: false } }

export default function RegisterPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-16">
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <Logo />
        <h1 className="font-display text-2xl font-semibold">Create your account</h1>
        <p className="text-sm text-muted-foreground">
          Faster checkout, order tracking, and wishlist alerts — no password required
        </p>
      </div>

      <div className="rounded-3xl border border-steel-200 bg-card p-6 sm:p-8">
        <Suspense fallback={<div className="h-64" />}>
          <MagicLinkForm mode="register" />
        </Suspense>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-cobalt hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
