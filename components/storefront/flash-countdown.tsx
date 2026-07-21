"use client"

import { useEffect, useState } from "react"

/** Countdown in Plex Mono to the flash-sale end (Design.md §5.1). */
export function FlashCountdown() {
  const [target] = useState(() => {
    const t = new Date()
    t.setHours(23, 59, 59, 0)
    return t.getTime()
  })
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, target - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])

  const parts = split(remaining ?? 0)
  return (
    <div className="flex items-center gap-1.5 font-mono">
      {[
        { v: parts.h, l: "HRS" },
        { v: parts.m, l: "MIN" },
        { v: parts.s, l: "SEC" },
      ].map((p, i) => (
        <span key={p.l} className="flex items-center gap-1.5">
          <span className="flex flex-col items-center">
            <span className="min-w-11 rounded-lg bg-ink px-2 py-1.5 text-center text-lg font-medium text-frost tabular-nums">
              {remaining === null ? "--" : pad(p.v)}
            </span>
            <span className="mt-1 text-[10px] tracking-[0.1em] text-steel-500">{p.l}</span>
          </span>
          {i < 2 && <span className="pb-4 text-lg text-steel-500">:</span>}
        </span>
      ))}
    </div>
  )
}

function split(ms: number) {
  const s = Math.floor(ms / 1000)
  return { h: Math.floor(s / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 }
}
function pad(n: number) {
  return String(n).padStart(2, "0")
}
