import { useQuery } from "@tanstack/react-query"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import api from "@/lib/axios"

interface Destination {
  locations: string[]
  count: number
  participants: number
}

interface BookingMetricsResponse {
  destinations: Destination[]
}

const COLORS = ["#2E7CF6", "#5BC5F0", "#818CF8", "#F472B6"]

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
    : [{ name: "No confirmed bookings yet", pct: 100, participants: 0, color: "#E5E7EB" }]

  return (
    <div className="rounded-[14px] border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-foreground">
          Top Destinations
        </h3>
      </div>

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

        <div className="flex flex-1 flex-col gap-[10px] min-w-0">
          {data.map((d) => (
            <div key={d.name} className="flex items-start gap-2">
              <div className="mt-[4px] h-[8px] w-[8px] shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
              <div className="min-w-0">
                <p className="text-[12px] leading-tight font-medium text-foreground truncate">
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
    </div>
  )
}
