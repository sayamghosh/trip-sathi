import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"

interface BookingResponse {
  _id: string
  travelerName: string
  createdAt: string
  cancelledAt?: string
  status: "confirmed" | "cancelled"
  tourPlanId?: { title?: string }
}

interface ActivityEvent {
  id: string
  user: string
  action: string
  time: Date
  color: string
  init: string
}

const COLORS = ["#2E7CF6", "#22B357", "#FB923C", "#EF4444", "#818CF8"]

export function RecentActivity() {
  const { data } = useQuery({
    queryKey: ['bookings', 'activity'],
    queryFn: async () => {
      const { data } = await api.get('/api/bookings/mine', { params: { status: 'all', limit: 20 } })
      return data.data as BookingResponse[]
    },
  })

  const events: ActivityEvent[] = []
  ;(data || []).forEach((b, i) => {
    const packageName = b.tourPlanId?.title || "a custom package"
    events.push({
      id: `${b._id}-booked`,
      user: b.travelerName,
      action: `booked the ${packageName} package.`,
      time: new Date(b.createdAt),
      color: COLORS[i % COLORS.length],
      init: b.travelerName?.[0]?.toUpperCase() || "?",
    })
    if (b.status === "cancelled" && b.cancelledAt) {
      events.push({
        id: `${b._id}-cancelled`,
        user: b.travelerName,
        action: `cancelled their ${packageName} booking.`,
        time: new Date(b.cancelledAt),
        color: "#EF4444",
        init: b.travelerName?.[0]?.toUpperCase() || "?",
      })
    }
  })

  const recent = events.sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 6)

  return (
    <div className="rounded-[14px] border border-border bg-card p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-foreground">
          Recent Activity
        </h3>
      </div>

      {recent.length === 0 ? (
        <p className="py-4 text-center text-[11px] text-muted-foreground">No activity yet.</p>
      ) : (
        <div>
          {recent.map((a, i) => (
            <div key={a.id} className="flex gap-2.5 py-[7px]">
              <div className="flex flex-col items-center">
                <div
                  className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm"
                  style={{ backgroundColor: a.color }}
                >
                  {a.init}
                </div>
                {i < recent.length - 1 && <div className="mt-1 w-px flex-1 bg-border" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] leading-normal text-secondary-foreground">
                  <span className="font-semibold text-foreground">{a.user}</span>{" "}
                  {a.action}
                </p>
                <p className="mt-[2px] text-[9px] text-muted-foreground">
                  {a.time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {a.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
