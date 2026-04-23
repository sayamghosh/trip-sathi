import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { ChevronDown } from "lucide-react"

const data = [
  { day: "Sun", value: 180 },
  { day: "Mon", value: 350 },
  { day: "Tue", value: 380 },
  { day: "Wed", value: 420 },
  { day: "Thu", value: 635 },
  { day: "Fri", value: 380 },
  { day: "Sat", value: 320 },
]

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-[8px] border border-border bg-card px-3 py-1.5 shadow-lg">
        <p className="text-[10px] text-muted-foreground">{label}</p>
        <p className="text-[13px] font-bold text-foreground">
          ${payload[0].value}
        </p>
      </div>
    )
  }
  return null
}

export function RevenueChart() {
  return (
    <div className="rounded-[14px] border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-foreground">
          Revenue Overview
        </h3>
        <button className="flex items-center gap-1 rounded-[8px] bg-primary px-3 py-[5px] text-[11px] font-medium text-white transition hover:bg-primary/90">
          Weekly
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      <div style={{ height: 185 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 5, left: -15, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2E7CF6" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#2E7CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              tickFormatter={(v: number) => `$${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#2E7CF6"
              strokeWidth={2}
              fill="url(#colorRev)"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#2E7CF6",
                stroke: "var(--card)",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
