import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface BookingMetricsResponse {
  tripStatus: { done: number; booked: number; cancelled: number }
}

export function TotalTrips() {
  const { data: metrics } = useQuery<BookingMetricsResponse>({
    queryKey: ['bookings', 'metrics'],
    queryFn: async () => {
      const { data } = await api.get('/api/bookings/metrics')
      return data as BookingMetricsResponse
    },
  })

  const tripStatus = metrics?.tripStatus || { done: 0, booked: 0, cancelled: 0 }
  const total = tripStatus.done + tripStatus.booked + tripStatus.cancelled

  const stats = [
    { label: "Done", value: tripStatus.done, color: "var(--chart-1)" },
    { label: "Booked", value: tripStatus.booked, color: "var(--success)" },
    { label: "Cancelled", value: tripStatus.cancelled, color: "var(--destructive)" },
  ]

  return (
    <Card>
      <CardHeader className="flex-row items-center gap-3 space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold">
          Total Trips
        </CardTitle>
        <span className="text-xl font-bold text-foreground">
          {total.toLocaleString()}
        </span>
      </CardHeader>

      <CardContent>
        <div className="mb-2.5 flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
          {total > 0 && stats.map((s) => (
            <div
              key={s.label}
              style={{ width: `${(s.value / total) * 100}%`, backgroundColor: s.color }}
            />
          ))}
        </div>

        <div className="flex items-center gap-4">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <span className="text-xs font-bold text-foreground">{s.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
