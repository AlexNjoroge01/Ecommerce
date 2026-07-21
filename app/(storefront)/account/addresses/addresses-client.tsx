"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { zodFormResolver } from "@/lib/rhf"
import { Icon } from "@/components/shared/icon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const addressSchema = z.object({
  label: z.string().min(2, "Give this address a label"),
  county: z.string().min(2, "County is required"),
  subCounty: z.string().min(2, "Sub-county is required"),
  estate: z.string().min(2, "Estate / street is required"),
})
type AddressInput = z.infer<typeof addressSchema>

interface Address extends AddressInput {
  id: string
  isDefault?: boolean
}

const SEED: Address[] = [
  {
    id: "a-1",
    label: "Home",
    county: "Nairobi",
    subCounty: "Westlands",
    estate: "Brookside Drive, Apt 4B",
    isDefault: true,
  },
  {
    id: "a-2",
    label: "Office",
    county: "Nairobi",
    subCounty: "Kilimani",
    estate: "Wood Avenue, Tower 2, 7th Floor",
  },
]

export function AddressesClient() {
  const [addresses, setAddresses] = useState<Address[]>(SEED)
  const [showForm, setShowForm] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressInput>({
    resolver: zodFormResolver(addressSchema),
    defaultValues: { label: "", county: "", subCounty: "", estate: "" },
  })

  function onSubmit(values: AddressInput) {
    setAddresses((prev) => [...prev, { ...values, id: `a-${Date.now()}` }])
    toast.success("Address saved")
    reset({ label: "", county: "", subCounty: "", estate: "" })
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Addresses</h1>
          <p className="mt-1 text-muted-foreground">Manage your delivery destinations.</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          <Icon name="plus" className="size-4" /> Add address
        </Button>
      </header>

      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 rounded-3xl border border-steel-200 bg-frost p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Label" error={errors.label?.message}>
              <Input placeholder="Home, Office…" {...register("label")} />
            </Field>
            <Field label="County" error={errors.county?.message}>
              <Input placeholder="Nairobi" {...register("county")} />
            </Field>
            <Field label="Sub-county" error={errors.subCounty?.message}>
              <Input placeholder="Westlands" {...register("subCounty")} />
            </Field>
            <Field label="Estate / street" error={errors.estate?.message}>
              <Input placeholder="Brookside Drive, Apt 4B" {...register("estate")} />
            </Field>
          </div>
          <div className="flex gap-3">
            <Button type="submit">Save address</Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.map((a) => (
          <div key={a.id} className="rounded-3xl border border-steel-200 bg-frost p-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="grid size-9 place-items-center rounded-full bg-card text-cyan">
                  <Icon name="location" className="size-5" />
                </span>
                <p className="font-display text-base font-semibold">{a.label}</p>
              </div>
              {a.isDefault && (
                <span className="inline-flex items-center gap-1 rounded-full bg-mint/20 px-3 py-1 text-xs font-medium text-[#0b6b4a]">
                  <Icon name="check" className="size-3.5" /> Default
                </span>
              )}
            </div>
            <address className="mt-4 space-y-0.5 text-sm not-italic text-muted-foreground">
              <p>{a.estate}</p>
              <p>
                {a.subCounty}, {a.county}
              </p>
            </address>
            <div className="mt-5 flex gap-2">
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button variant="destructive" size="sm">
                <Icon name="trash" className="size-4" /> Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
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
