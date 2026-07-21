"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [pending, setPending] = useState(false)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast.error("Enter a valid email to subscribe")
      return
    }
    setPending(true)
    setTimeout(() => {
      setPending(false)
      setEmail("")
      toast.success("You're on the list — welcome to Atlas Market")
    }, 600)
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full max-w-md items-center gap-2 rounded-full border border-steel-200 bg-frost p-1.5 shadow-[var(--shadow-sm)]"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        aria-label="Email address"
        className="flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-steel-500"
      />
      <Button type="submit" disabled={pending}>
        {pending ? "Joining…" : "Subscribe"}
      </Button>
    </form>
  )
}
