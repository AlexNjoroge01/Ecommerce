import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { MagicLinkForm } from "@/components/storefront/auth-forms"
import { Logo } from "@/components/storefront/logo"
import { Icon } from "@/components/shared/icon"

export const metadata: Metadata = { title: "Sign in", robots: { index: false } }

type Props = { searchParams: Promise<{ error?: string }> }

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams

  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-16">
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <Logo />
        <h1 className="font-display text-2xl font-semibold">Welcome to Atlas Market</h1>
        <p className="text-sm text-muted-foreground">Sign in or create an account with just your email</p>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">
          <Icon name="close" className="mt-0.5 size-4 shrink-0" />
          <span>
            {error === "expired"
              ? "That sign-in link has expired or was already used. Request a new one below."
              : "That sign-in link wasn't valid. Request a new one below."}
          </span>
        </div>
      )}

      <div className="rounded-3xl border border-steel-200 bg-card p-6 sm:p-8">
        <Suspense fallback={<div className="h-52" />}>
          <MagicLinkForm mode="login" />
        </Suspense>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-glacier/60 p-4 text-center font-mono text-xs text-steel-500">
        <Icon name="secure" className="size-3.5" />
        <span>Passwordless · admin@atlaslabs.store gets the operator panel</span>
      </div>
    </div>
  )
}
