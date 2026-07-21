import type { Order, OrderStatus } from "@/lib/types"
import { Icon, type IconName } from "@/components/shared/icon"
import { formatDate } from "@/lib/format"
import { cn } from "@/lib/utils"

const STATUS: Record<OrderStatus, { label: string; cls: string; icon: IconName }> = {
  pending: { label: "Pending", cls: "bg-glacier text-steel-500", icon: "wallet" },
  paid: { label: "Paid", cls: "bg-cyan/15 text-[#0b6b7a]", icon: "check" },
  processing: { label: "Processing", cls: "bg-cyan/15 text-[#0b6b7a]", icon: "package" },
  shipped: { label: "Shipped", cls: "bg-cobalt/15 text-cobalt", icon: "truck" },
  delivered: { label: "Delivered", cls: "bg-mint/20 text-[#0b6b4a]", icon: "delivered" },
  cancelled: { label: "Cancelled", cls: "border border-steel-200 text-steel-500", icon: "close" },
  refunded: { label: "Refunded", cls: "border border-steel-200 text-steel-500", icon: "refresh" },
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const s = STATUS[status]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        s.cls
      )}
    >
      <Icon name={s.icon} className="size-3.5" /> {s.label}
    </span>
  )
}

export function OrderTimeline({ timeline }: { timeline: Order["timeline"] }) {
  return (
    <ol className="relative space-y-6 pl-6">
      <span className="absolute top-1 bottom-1 left-[7px] w-px bg-steel-200" />
      {timeline.map((t, i) => {
        const last = i === timeline.length - 1
        return (
          <li key={i} className="relative">
            <span
              className={cn(
                "absolute -left-6 top-0.5 grid size-4 place-items-center rounded-full",
                last ? "bg-cyan" : "bg-steel-200"
              )}
            >
              {last && <span className="size-1.5 rounded-full bg-white" />}
            </span>
            <p className="text-sm font-medium capitalize">{t.status}</p>
            <p className="text-xs text-steel-500">{t.note}</p>
            <p className="font-mono text-[11px] text-steel-500">{formatDate(t.at)}</p>
          </li>
        )
      })}
    </ol>
  )
}
