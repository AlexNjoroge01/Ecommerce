import type { Role } from "@/lib/types"

/*
  Role → permission matrix (Blueprint §6.3, §15). Higher roles inherit lower
  capabilities. Checked in server actions and the admin layout.
*/

export const ADMIN_ROLES: Role[] = ["editor", "manager", "admin", "superadmin"]

const PERMISSIONS: Record<Role, string[]> = {
  customer: ["orders.own.read", "reviews.write"],
  support: ["orders.read", "tickets.write", "customers.read"],
  editor: ["orders.read", "products.write", "blog.write", "cms.write"],
  manager: [
    "orders.read",
    "orders.write",
    "products.write",
    "inventory.write",
    "coupons.write",
    "reports.read",
  ],
  admin: ["*"],
  superadmin: ["*"],
}

export function can(role: Role | string | undefined, permission: string): boolean {
  if (!role) return false
  const perms = PERMISSIONS[role as Role]
  if (!perms) return false
  return perms.includes("*") || perms.includes(permission)
}

export function isAdminRole(role: string | undefined): boolean {
  return !!role && ADMIN_ROLES.includes(role as Role)
}
