import { ChevronDown } from "lucide-react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Line } from "recharts"

interface TripData {
  month: string
  done: number
  canceled: number
}

interface TripsOverviewProps {
  data: TripData[]
}

export function TripsOverview({ data }: TripsOverviewProps) {
  return (
    <div className="rounded-[16px] border border-border bg-card p-6 shadow-sm lg:col-span-2">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-[16px] font-bold text-foreground">
          Trips Overview
        </h3>
        <button className="flex items-center gap-1.5 rounded-[8px] bg-[#3B82F6] px-3 py-1.5 text-[12px] font-medium text-white hover:bg-[#3B82F6]/90">
          Last 12 Months
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-3 bg-[#3B82F6]" />
          <span className="text-[12px] text-muted-foreground font-medium">Done</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-3 border-t-2 border-dashed border-muted-foreground" />
          <span className="text-[12px] text-muted-foreground font-medium">Canceled</span>
        </div>
      </div>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorDone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              dy={10}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            />
            <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                        <p className="font-semibold text-[14px] text-foreground mb-1">{payload[0].payload.done.toLocaleString()}</p>
                        <p className="text-[11px] text-muted-foreground">{payload[0].payload.month}</p>
                      </div>
                    )
                  }
                  return null
                }}
            />
            <Area
              type="monotone"
              dataKey="done"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#colorDone)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, fill: "#fff", stroke: "#3B82F6" }}
            />
            <Line
              type="monotone"
              dataKey="canceled"
              stroke="#9CA3AF"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
