import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"

interface BookingMetricsResponse {
  monthly: { month: string; confirmed: number; cancelled: number; revenue: number }[]
}

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
          ₹{payload[0].value.toLocaleString('en-IN')}
        </p>
      </div>
    )
  }
  return null
}

export function RevenueChart() {
  const { data: metrics } = useQuery<BookingMetricsResponse>({
    queryKey: ['bookings', 'metrics'],
    queryFn: async () => {
      const { data } = await api.get('/api/bookings/metrics')
      return data as BookingMetricsResponse
    },
  })

  const data = (metrics?.monthly || []).map(m => ({ month: m.month, value: m.revenue }))

  return (
    <div className="rounded-[14px] border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-foreground">
          Revenue Overview
        </h3>
        <span className="rounded-[8px] bg-primary px-3 py-[5px] text-[11px] font-medium text-white">
          Last 12 Months
        </span>
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
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              tickFormatter={(v: number) => `₹${v.toLocaleString('en-IN')}`}
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
