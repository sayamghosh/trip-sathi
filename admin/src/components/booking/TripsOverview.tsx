import { ChevronDown } from "lucide-react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Line } from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-bold">Trips Overview</CardTitle>
        <Button variant="secondary" size="sm" className="h-8 gap-1.5 text-xs font-medium">
          Last 12 Months
          <ChevronDown className="h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-3" style={{ backgroundColor: "var(--chart-1)" }} />
            <span className="text-xs font-medium text-muted-foreground">Done</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-3 border-t-2 border-dashed border-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Canceled</span>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDone" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
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
                      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                        <p className="mb-1 text-sm font-semibold text-foreground">{payload[0].payload.done.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{payload[0].payload.month}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="done"
                stroke="var(--chart-1)"
                strokeWidth={2}
                fill="url(#colorDone)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, fill: "var(--background)", stroke: "var(--chart-1)" }}
              />
              <Line
                type="monotone"
                dataKey="canceled"
                stroke="var(--muted-foreground)"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
