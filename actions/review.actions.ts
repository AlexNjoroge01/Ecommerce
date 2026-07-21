"use server"

import { revalidatePath } from "next/cache"
import { reviewSchema, type ReviewInput } from "@/lib/validations/review.schema"
import { getSession } from "@/lib/auth"
import { getProductById } from "@/lib/queries"
import type { ActionResult } from "@/actions/auth.actions"

export async function submitReviewAction(input: ReviewInput): Promise<ActionResult> {
  const parsed = reviewSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Please check the form" }
  }

  const session = await getSession()
  if (!session) return { success: false, error: "Sign in to write a review" }

  const product = getProductById(parsed.data.productId)
  if (!product) return { success: false, error: "Product not found" }

  // Verified-purchase auto-approval + moderation queue live here (Blueprint §14).
  // In demo mode we accept and confirm; a real build inserts into `reviews`.
  revalidatePath(`/product/${product.slug}`)
  return { success: true }
}

export async function voteHelpfulAction(_reviewId: string): Promise<ActionResult> {
  const session = await getSession()
  if (!session) return { success: false, error: "Sign in to vote" }
  return { success: true }
}
