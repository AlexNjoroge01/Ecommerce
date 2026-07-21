"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  checkoutSchema,
  type CheckoutInput,
  KENYA_COUNTIES,
  PICKUP_STATIONS,
} from "@/lib/validations/checkout.schema"
import { placeOrderAction } from "@/actions/order.actions"
import { zodFormResolver } from "@/lib/rhf"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Icon, type IconName } from "@/components/shared/icon"
import { cn } from "@/lib/utils"

const PAYMENTS: { value: CheckoutInput["paymentMethod"]; label: string; sub: string; icon: IconName }[] = [
  { value: "mpesa", label: "M-Pesa", sub: "STK push to your phone", icon: "call" },
  { value: "card", label: "Card", sub: "Visa / Mastercard", icon: "wallet" },
  { value: "bank", label: "Bank transfer", sub: "Pay via your bank", icon: "store" },
  { value: "cod", label: "Cash on delivery", sub: "Pay when it arrives", icon: "truck" },
]

export function CheckoutForm({
  defaultName,
  defaultEmail,
}: {
  defaultName: string
  defaultEmail: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodFormResolver(checkoutSchema),
    defaultValues: {
      fullName: defaultName,
      email: defaultEmail,
      fulfillment: "delivery",
      paymentMethod: "mpesa",
      county: "",
    },
  })

  const fulfillment = watch("fulfillment")
  const paymentMethod = watch("paymentMethod")

  function onSubmit(values: CheckoutInput) {
    startTransition(async () => {
      const res = await placeOrderAction(values)
      if (!res.success) {
        toast.error(res.error)
        return
      }
      if (values.paymentMethod === "mpesa") {
        toast.success("Check your phone to complete payment…")
      } else {
        toast.success("Order placed")
      }
      router.push(`/checkout/confirmation/${res.data!.orderId}`)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Step n={1} title="Contact details">
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldWrap label="Full name" error={errors.fullName?.message}>
            <Input {...register("fullName")} placeholder="Jane Doe" />
          </FieldWrap>
          <FieldWrap label="Email" error={errors.email?.message}>
            <Input type="email" {...register("email")} placeholder="you@email.com" />
          </FieldWrap>
        </div>
      </Step>

      <Step n={2} title="Delivery method">
        <div className="grid gap-3 sm:grid-cols-2">
          <ChoiceCard
            active={fulfillment === "delivery"}
            onClick={() => setValue("fulfillment", "delivery")}
            icon="truck"
            label="Deliver to me"
            sub="Next-day in major towns"
          />
          <ChoiceCard
            active={fulfillment === "pickup"}
            onClick={() => setValue("fulfillment", "pickup")}
            icon="store"
            label="Pickup station"
            sub="Collect at your convenience"
          />
        </div>

        {fulfillment === "delivery" ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <FieldWrap label="County" error={errors.county?.message}>
              <Select onValueChange={(v) => setValue("county", v, { shouldValidate: true })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select county" />
                </SelectTrigger>
                <SelectContent>
                  {KENYA_COUNTIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldWrap>
            <FieldWrap label="Sub-county / area">
              <Input {...register("subCounty")} placeholder="e.g. Westlands" />
            </FieldWrap>
            <FieldWrap label="Estate / building">
              <Input {...register("estate")} placeholder="Estate, apartment" />
            </FieldWrap>
            <FieldWrap label="Delivery instructions">
              <Input {...register("deliveryInstructions")} placeholder="Gate code, landmark…" />
            </FieldWrap>
          </div>
        ) : (
          <div className="mt-4">
            <FieldWrap label="Pickup station" error={errors.county?.message}>
              <Select onValueChange={(v) => setValue("pickupWarehouseId", v, { shouldValidate: true })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a station" />
                </SelectTrigger>
                <SelectContent>
                  {PICKUP_STATIONS.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldWrap>
          </div>
        )}
      </Step>

      <Step n={3} title="Payment">
        <div className="grid gap-3 sm:grid-cols-2">
          {PAYMENTS.map((p) => (
            <ChoiceCard
              key={p.value}
              active={paymentMethod === p.value}
              onClick={() => setValue("paymentMethod", p.value)}
              icon={p.icon}
              label={p.label}
              sub={p.sub}
            />
          ))}
        </div>
        {paymentMethod === "mpesa" && (
          <div className="mt-4">
            <FieldWrap label="M-Pesa phone number" error={errors.phoneForStk?.message}>
              <Input {...register("phoneForStk")} placeholder="07XX XXX XXX" inputMode="tel" />
            </FieldWrap>
            <p className="mt-2 text-xs text-steel-500">
              You&apos;ll get a prompt on this number to authorize payment.
            </p>
          </div>
        )}
      </Step>

      <Button type="submit" variant="buy" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Placing order…" : "Place order"}
      </Button>
      <p className="text-center font-mono text-[11px] text-steel-500">
        BY PLACING THIS ORDER YOU AGREE TO OUR TERMS
      </p>
    </form>
  )
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-steel-200 bg-card p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid size-7 place-items-center rounded-full bg-ink font-mono text-xs text-frost">
          {n}
        </span>
        <h2 className="font-display text-lg font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function ChoiceCard({
  active,
  onClick,
  icon,
  label,
  sub,
}: {
  active: boolean
  onClick: () => void
  icon: IconName
  label: string
  sub: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors",
        active ? "border-cyan bg-cyan/5 ring-1 ring-cyan" : "border-steel-200 hover:border-steel-500"
      )}
    >
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-xl",
          active ? "bg-cyan/15 text-cyan" : "bg-glacier text-steel-500"
        )}
      >
        <Icon name={icon} className="size-5" />
      </span>
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-steel-500">{sub}</span>
      </span>
    </button>
  )
}

function FieldWrap({
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
