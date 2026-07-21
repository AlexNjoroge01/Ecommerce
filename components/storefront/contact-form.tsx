"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { zodFormResolver } from "@/lib/rhf"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const contactSchema = z.object({
  name: z.string().min(2, "Tell us your name"),
  email: z.string().email("Enter a valid email"),
  subject: z.string().min(3, "Add a short subject"),
  message: z.string().min(10, "A little more detail, please").max(2000),
})
type ContactInput = z.infer<typeof contactSchema>

const DEFAULTS: ContactInput = { name: "", email: "", subject: "", message: "" }

export function ContactForm() {
  const [isPending, startTransition] = useTransition()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodFormResolver(contactSchema),
    defaultValues: DEFAULTS,
  })

  function onSubmit(_values: ContactInput) {
    startTransition(async () => {
      // Simulate the round-trip to the support inbox.
      await new Promise((r) => setTimeout(r, 400))
      toast.success("Thanks — we'll reply within 24h")
      reset(DEFAULTS)
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-3xl border border-steel-200 bg-card p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" error={errors.name?.message}>
          <Input placeholder="Your name" {...register("name")} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <Input type="email" placeholder="you@example.com" {...register("email")} />
        </Field>
      </div>

      <Field label="Subject" error={errors.subject?.message}>
        <Input placeholder="What's this about?" {...register("subject")} />
      </Field>

      <Field label="Message" error={errors.message?.message}>
        <Textarea rows={5} placeholder="How can we help?" {...register("message")} />
      </Field>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Sending…" : "Send message"}
      </Button>
    </form>
  )
}

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
