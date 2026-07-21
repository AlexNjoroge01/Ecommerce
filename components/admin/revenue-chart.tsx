"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { formatPrice } from "@/lib/format"

// ~12 months of demo revenue (KES), trending up into the current month.
const DATA = [
  { month: "Aug", revenue: 1_820_000 },
  { month: "Sep", revenue: 2_010_000 },
  { month: "Oct", revenue: 1_940_000 },
  { month: "Nov", revenue: 2_480_000 },
  { month: "Dec", revenue: 3_120_000 },
  { month: "Jan", revenue: 2_650_000 },
  { month: "Feb", revenue: 2_780_000 },
  { month: "Mar", revenue: 3_010_000 },
  { month: "Apr", revenue: 3_340_000 },
  { month: "May", revenue: 3_180_000 },
  { month: "Jun", revenue: 3_720_000 },
  { month: "Jul", revenue: 4_150_000 },
]

export function RevenueChart() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={DATA} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="admin-revenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-cyan)" stopOpacity={0.55} />
              <stop offset="100%" stopColor="var(--color-mint)" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            stroke="var(--color-border)"
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
            dy={8}
          />
          <YAxis
            width={54}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
            tickFormatter={(v: number) => `${Math.round(v / 1_000_000)}M`}
          />
          <Tooltip
            cursor={{ stroke: "var(--color-cyan)", strokeWidth: 1, strokeDasharray: "4 4" }}
            contentStyle={{
              background: "var(--color-popover)",
              border: "1px solid var(--color-border)",
              borderRadius: 12,
              color: "var(--color-popover-foreground)",
              fontSize: 12,
            }}
            labelStyle={{ color: "var(--color-muted-foreground)" }}
            formatter={(value) => [formatPrice(Number(value)), "Revenue"]}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="var(--color-cyan)"
            strokeWidth={2}
            fill="url(#admin-revenue)"
            activeDot={{ r: 4, fill: "var(--color-cyan)", stroke: "var(--color-background)" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
