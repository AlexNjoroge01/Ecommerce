"use client"

import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { UserCircleIcon } from "@hugeicons/core-free-icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icon } from "@/components/shared/icon"
import { logoutAction } from "@/actions/auth.actions"

export function AccountMenu({
  name,
  isAdmin,
}: {
  name: string | null
  isAdmin: boolean
}) {
  if (!name) {
    return (
      <Link
        href="/login"
        aria-label="Sign in"
        className="grid size-11 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary"
      >
        <HugeiconsIcon icon={UserCircleIcon} strokeWidth={1.75} className="size-6" />
      </Link>
    )
  }

  const first = name.split(" ")[0]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-11 items-center gap-2 rounded-full px-3 text-sm font-medium transition-colors outline-none hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring">
        <HugeiconsIcon icon={UserCircleIcon} strokeWidth={1.75} className="size-6" />
        <span className="hidden max-w-24 truncate sm:inline">{first}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="font-normal">
          <span className="text-xs text-muted-foreground">Signed in as</span>
          <div className="truncate font-medium">{name}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account"><Icon name="dashboard" className="size-4" /> Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account/orders"><Icon name="package" className="size-4" /> Orders</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/wishlist"><Icon name="heart" className="size-4" /> Wishlist</Link>
        </DropdownMenuItem>
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin"><Icon name="store" className="size-4" /> Admin panel</Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <form action={logoutAction}>
          <button type="submit" className="w-full">
            <DropdownMenuItem asChild>
              <span><Icon name="logout" className="size-4" /> Sign out</span>
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
