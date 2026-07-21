"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { zodFormResolver } from "@/lib/rhf"
import { formatDate } from "@/lib/format"
import { Icon } from "@/components/shared/icon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const ticketSchema = z.object({
  subject: z.string().min(4, "Add a short subject").max(120),
  message: z.string().min(10, "Tell us a little more").max(2000),
})
type TicketInput = z.infer<typeof ticketSchema>

type TicketStatus = "open" | "resolved"

const TICKET_STATUS: Record<TicketStatus, { label: string; cls: string }> = {
  open: { label: "Open", cls: "bg-cyan/15 text-[#0b6b7a]" },
  resolved: { label: "Resolved", cls: "bg-mint/20 text-[#0b6b4a]" },
}

const PAST_TICKETS: {
  id: string
  ticketNumber: string
  subject: string
  date: string
  status: TicketStatus
}[] = [
  {
    id: "t-1",
    ticketNumber: "SUP-2026-3391",
    subject: "Where is my order ATL-4T8W-12RX?",
    date: "2026-07-16T11:20:00Z",
    status: "open",
  },
  {
    id: "t-2",
    ticketNumber: "SUP-2026-3010",
    subject: "Invoice request for June order",
    date: "2026-06-05T09:45:00Z",
    status: "resolved",
  },
]

export function SupportClient() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TicketInput>({
    resolver: zodFormResolver(ticketSchema),
    defaultValues: { subject: "", message: "" },
  })

  function onSubmit() {
    toast.success("Ticket submitted — we'll reply within 24h")
    reset({ subject: "", message: "" })
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Support</h1>
        <p className="mt-1 text-muted-foreground">
          Open a ticket and our team will get back to you within 24 hours.
        </p>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 rounded-3xl border border-steel-200 bg-frost p-6"
      >
        <div className="space-y-1.5">
          <Label className="text-xs tracking-[0.06em] text-steel-500 uppercase">Subject</Label>
          <Input placeholder="What do you need help with?" {...register("subject")} />
          {errors.subject && <p className="text-sm text-destructive">{errors.subject.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs tracking-[0.06em] text-steel-500 uppercase">Message</Label>
          <Textarea rows={5} placeholder="Share the details…" {...register("message")} />
          {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
        </div>
        <Button type="submit">
          <Icon name="mail" className="size-4" /> Submit ticket
        </Button>
      </form>

      <section>
        <h2 className="mb-4 font-display text-lg font-semibold">Your tickets</h2>
        <ul className="space-y-3">
          {PAST_TICKETS.map((t) => {
            const s = TICKET_STATUS[t.status]
            return (
              <li
                key={t.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-steel-200 bg-frost p-4"
              >
                <div>
                  <p className="text-sm font-medium">{t.subject}</p>
                  <p className="mt-0.5 font-mono text-xs text-steel-500">
                    {t.ticketNumber} · {formatDate(t.date)}
                  </p>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                    s.cls
                  )}
                >
                  {s.label}
                </span>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
