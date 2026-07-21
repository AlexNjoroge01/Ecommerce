import type { Resolver, FieldErrors } from "react-hook-form"
import type { ZodType } from "zod"

/*
  A tiny React Hook Form resolver backed by a Zod schema. Avoids the
  @hookform/resolvers ↔ zod v4 type friction while keeping Zod as the single
  source of validation truth (the same schema runs again in the server action).
*/
export function zodFormResolver<T extends Record<string, unknown>>(
  schema: ZodType<T>
): Resolver<T> {
  return async (values) => {
    const result = schema.safeParse(values)
    if (result.success) {
      return { values: result.data, errors: {} }
    }
    const errors: Record<string, { type: string; message: string }> = {}
    for (const issue of result.error.issues) {
      const key = issue.path.join(".") || "root"
      if (!errors[key]) errors[key] = { type: issue.code, message: issue.message }
    }
    return { values: {}, errors: errors as unknown as FieldErrors<T> }
  }
}
