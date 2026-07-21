"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { HugeiconsIcon } from "@hugeicons/react"
import { StarIcon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import { reviewSchema, type ReviewInput } from "@/lib/validations/review.schema"
import { submitReviewAction } from "@/actions/review.actions"
import { zodFormResolver } from "@/lib/rhf"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function ReviewForm({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition()
  const [hover, setHover] = useState(0)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewInput>({
    resolver: zodFormResolver(reviewSchema),
    defaultValues: { productId, rating: 0, title: "", body: "", pros: "", cons: "" },
  })
  const rating = watch("rating")

  function onSubmit(values: ReviewInput) {
    startTransition(async () => {
      const res = await submitReviewAction(values)
      if (res.success) {
        toast.success("Thanks — your review is in the queue for approval")
        reset({ productId, rating: 0, title: "", body: "", pros: "", cons: "" })
      } else {
        toast.error(res.error)
      }
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-3xl border border-steel-200 bg-card p-6"
    >
      <input type="hidden" {...register("productId")} />
      <div>
        <Label className="mb-2 block text-xs tracking-[0.06em] text-steel-500 uppercase">
          Your rating
        </Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setValue("rating", n, { shouldValidate: true })}
              aria-label={`${n} star`}
            >
              <HugeiconsIcon
                icon={StarIcon}
                strokeWidth={1.75}
                className={cn(
                  "size-7 transition-colors",
                  (hover || rating) >= n ? "fill-mint text-mint" : "text-steel-200"
                )}
              />
            </button>
          ))}
        </div>
        {errors.rating && <FieldError>{errors.rating.message}</FieldError>}
      </div>

      <Field label="Headline" error={errors.title?.message}>
        <Input placeholder="Sum it up in a line" {...register("title")} />
      </Field>

      <Field label="Your review" error={errors.body?.message}>
        <Textarea rows={4} placeholder="What did you like or dislike?" {...register("body")} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Pros" error={errors.pros?.message}>
          <Input placeholder="Battery, screen…" {...register("pros")} />
        </Field>
        <Field label="Cons" error={errors.cons?.message}>
          <Input placeholder="Anything to flag?" {...register("cons")} />
        </Field>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Submitting…" : "Submit review"}
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
      {error && <FieldError>{error}</FieldError>}
    </div>
  )
}

function FieldError({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-destructive">{children}</p>
}
