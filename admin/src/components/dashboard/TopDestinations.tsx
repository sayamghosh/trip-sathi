import { useQuery } from "@tanstack/react-query"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import api from "@/lib/axios"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface Destination {
  locations: string[]
  count: number
  participants: number
}

interface BookingMetricsResponse {
  destinations: Destination[]
}

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]

export function TopDestinations() {
  const { data: metrics } = useQuery<BookingMetricsResponse>({
    queryKey: ['bookings', 'metrics'],
    queryFn: async () => {
      const { data } = await api.get('/api/bookings/metrics')
      return data as BookingMetricsResponse
    },
  })

  const destinations = metrics?.destinations || []
  const total = destinations.reduce((acc, d) => acc + d.count, 0)

  const data = destinations.length
    ? destinations.map((d, i) => ({
        name: d.locations?.join(", ") || "Custom Destination",
        pct: total === 0 ? 0 : Math.round((d.count / total) * 100),
        participants: d.participants,
        color: COLORS[i % COLORS.length],
      }))
    : [{ name: "No confirmed bookings yet", pct: 100, participants: 0, color: "var(--muted)" }]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">
          Top Destinations
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-5">
          <div className="relative shrink-0" style={{ width: 140, height: 140 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="pct"
                  strokeWidth={0}
                >
                  {data.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-2.5">
            {data.map((d) => (
              <div key={d.name} className="flex items-start gap-2">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
                <div className="min-w-0">
                  <p className="truncate text-xs leading-tight font-medium text-foreground">
                    {d.name} {total > 0 && `(${d.pct}%)`}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {d.participants} Participants
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
