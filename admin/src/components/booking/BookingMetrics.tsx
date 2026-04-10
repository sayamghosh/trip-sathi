import { CalendarDays, MoreHorizontal, TrendingDown, TrendingUp } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer } from "recharts"

interface Metric {
  title: string
  value: string
  change: string
  isUp: boolean
  color: string
  chartData: { val: number }[]
}

interface BookingMetricsProps {
  metrics: Metric[]
}

export function BookingMetrics({ metrics }: BookingMetricsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {metrics.map((m, i) => (
        <div
          key={i}
          className="flex flex-col justify-between rounded-[16px] border border-border bg-card p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-[8px]"
                style={{ backgroundColor: `${m.color}15` }}
              >
                <CalendarDays className="h-4 w-4" style={{ color: m.color }} />
              </div>
              <span className="text-[13px] font-medium text-muted-foreground">
                {m.title}
              </span>
            </div>
            <button className="text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-[28px] font-bold text-foreground leading-none">
                {m.value}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-[11px]">
                {m.isUp ? (
                  <TrendingUp className="h-3 w-3 text-[#3B82F6]" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-[#EF4444]" />
                )}
                <span
                  className={`font-medium ${
                    m.isUp ? "text-[#3B82F6]" : "text-[#EF4444]"
                  }`}
                >
                  {m.change}
                </span>
                <span className="text-muted-foreground">from last week</span>
              </div>
            </div>
            <div className="h-[40px] w-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={m.chartData}>
                  <defs>
                    <linearGradient id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={m.color} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={m.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="val"
                    stroke={m.color}
                    strokeWidth={2}
                    fill={`url(#grad-${i})`}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
