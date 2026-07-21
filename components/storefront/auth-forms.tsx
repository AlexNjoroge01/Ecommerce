"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { useSearchParams } from "next/navigation"
import { z } from "zod"
import { toast } from "sonner"
import { requestMagicLinkAction } from "@/actions/auth.actions"
import { zodFormResolver } from "@/lib/rhf"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/shared/icon"

const schema = z.object({
  name: z.string().optional(),
  email: z.string().email("Enter a valid email"),
})
type FormValues = z.infer<typeof schema>

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs tracking-[0.06em] text-steel-500 uppercase">{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

export function MagicLinkForm({ mode }: { mode: "login" | "register" }) {
  const params = useSearchParams()
  const next = params.get("next") ?? undefined
  const [isPending, startTransition] = useTransition()
  const [sentTo, setSentTo] = useState<string | null>(null)
  const [devLink, setDevLink] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodFormResolver(schema) })

  function submit(values: FormValues) {
    startTransition(async () => {
      const res = await requestMagicLinkAction({ email: values.email, name: values.name, next })
      if (res.success) {
        setSentTo(values.email)
        setDevLink(res.data?.devLink ?? null)
        toast.success("Check your inbox for a sign-in link")
      } else {
        toast.error(res.error)
      }
    })
  }

  if (sentTo) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-mint/20 text-[#0b6b4a]">
          <Icon name="mail" className="size-7" />
        </span>
        <div>
          <h2 className="font-display text-lg font-semibold">Check your email</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            We sent a sign-in link to <span className="font-medium text-foreground">{sentTo}</span>.
            It expires in 15 minutes.
          </p>
        </div>
        {devLink && (
          <div className="w-full rounded-2xl bg-glacier/60 p-4">
            <p className="mb-2 font-mono text-[11px] tracking-[0.06em] text-steel-500 uppercase">
              Dev mode · email not delivered
            </p>
            <Button asChild size="sm" className="w-full">
              <a href={devLink}>Open sign-in link</a>
            </Button>
          </div>
        )}
        <button
          type="button"
          onClick={() => {
            setSentTo(null)
            setDevLink(null)
          }}
          className="text-sm text-cobalt hover:underline"
        >
          Use a different email
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      {mode === "register" && (
        <Field label="Name" error={errors.name?.message}>
          <Input {...register("name")} placeholder="Jane Doe" autoComplete="name" />
        </Field>
      )}
      <Field label="Email" error={errors.email?.message}>
        <Input
          type="email"
          autoComplete="email"
          {...register("email")}
          placeholder="you@email.com"
        />
      </Field>
      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Sending link…" : "Continue with email"}
      </Button>
      <p className="text-center text-xs text-steel-500">
        No password needed — we&apos;ll email you a secure sign-in link.
      </p>
    </form>
  )
}
