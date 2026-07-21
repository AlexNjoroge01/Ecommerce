import { z } from "zod"

export const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.coerce.number().int().min(1, "Pick a rating").max(5),
  title: z.string().min(3, "Add a short headline").max(120),
  body: z.string().min(10, "Tell us a little more").max(2000),
  pros: z.string().max(500).optional(),
  cons: z.string().max(500).optional(),
})
export type ReviewInput = z.infer<typeof reviewSchema>
