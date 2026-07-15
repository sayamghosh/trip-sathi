import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"

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
    { label: "Done", value: tripStatus.done, color: "#2E7CF6" },
    { label: "Booked", value: tripStatus.booked, color: "#22B357" },
    { label: "Cancelled", value: tripStatus.cancelled, color: "#EF4444" },
  ]

  return (
    <div className="rounded-[14px] border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-[14px] font-semibold text-foreground">
            Total Trips
          </h3>
          <span className="text-[20px] font-bold text-foreground">
            {total.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="mb-2.5 flex h-[10px] w-full overflow-hidden rounded-full bg-muted">
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
            <div className="h-[8px] w-[8px] rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-[11px] text-muted-foreground">{s.label}</span>
            <span className="text-[11px] font-bold text-foreground">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
