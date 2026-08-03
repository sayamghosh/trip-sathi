import { CalendarDays, MoreHorizontal, TrendingDown, TrendingUp } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

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
        <Card key={i} className="flex flex-col justify-between">
          <CardContent className="flex flex-1 flex-col justify-between p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${m.color}15` }}
                >
                  <CalendarDays className="h-4 w-4" style={{ color: m.color }} />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {m.title}
                </span>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold leading-none text-foreground">
                  {m.value}
                </p>
                {m.change && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs">
                    {m.isUp ? (
                      <TrendingUp className="h-3 w-3 text-success" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-destructive" />
                    )}
                    <span
                      className={m.isUp ? "font-medium text-success" : "font-medium text-destructive"}
                    >
                      {m.change}
                    </span>
                    <span className="text-muted-foreground">from last week</span>
                  </div>
                )}
              </div>
              <div className="h-10 w-20">
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
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
