import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function CalendarWidget() {
  const [date] = useState(new Date(2028, 6, 12))
  const y = date.getFullYear()
  const m = date.getMonth()
  const first = new Date(y, m, 1).getDay()
  const dim = new Date(y, m + 1, 0).getDate()
  const prevDim = new Date(y, m, 0).getDate()
  const monthStr = date.toLocaleString("default", { month: "long" })
  const today = 12
  const blue = [3, 12, 13, 17, 18, 19]

  type DayItem = { d: number; cur: boolean; today: boolean; hl: boolean }
  const cells: DayItem[] = []
  for (let i = first - 1; i >= 0; i--)
    cells.push({ d: prevDim - i, cur: false, today: false, hl: false })
  for (let i = 1; i <= dim; i++)
    cells.push({ d: i, cur: true, today: i === today, hl: blue.includes(i) })
  const rem = 42 - cells.length
  for (let i = 1; i <= rem; i++)
    cells.push({ d: i, cur: false, today: false, hl: false })

  return (
    <div className="rounded-[14px] border border-border bg-card p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[13px] font-semibold text-foreground">
          {monthStr} {y}{" "}
          <ChevronRight className="inline h-3 w-3 text-muted-foreground" />
        </span>
        <div className="flex gap-0.5">
          <button className="flex h-[22px] w-[22px] items-center justify-center rounded-[6px] hover:bg-accent">
            <ChevronLeft className="h-3 w-3 text-muted-foreground" />
          </button>
          <button className="flex h-[22px] w-[22px] items-center justify-center rounded-[6px] hover:bg-accent">
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7">
        {DOW.map((d) => (
          <div
            key={d}
            className="py-[3px] text-center text-[10px] font-medium text-muted-foreground/70"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((c, i) => (
          <button
            key={i}
            className={`flex h-[28px] items-center justify-center rounded-[6px] text-[11px] font-medium transition ${
              !c.cur
                ? "text-muted-foreground/30"
                : c.today
                  ? "bg-primary font-bold text-white shadow-lg shadow-primary/20"
                  : c.hl
                    ? "font-semibold text-primary"
                    : "text-foreground/80 hover:bg-accent hover:text-foreground"
            }`}
          >
            {c.d}
          </button>
        ))}
      </div>
    </div>
  )
}
