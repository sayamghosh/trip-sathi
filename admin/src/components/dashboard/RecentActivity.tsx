import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

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

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

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
      color: CHART_COLORS[i % CHART_COLORS.length],
      init: b.travelerName?.[0]?.toUpperCase() || "?",
    })
    if (b.status === "cancelled" && b.cancelledAt) {
      events.push({
        id: `${b._id}-cancelled`,
        user: b.travelerName,
        action: `cancelled their ${packageName} booking.`,
        time: new Date(b.cancelledAt),
        color: "hsl(var(--destructive))",
        init: b.travelerName?.[0]?.toUpperCase() || "?",
      })
    }
  })

  const recent = events.sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 6)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
      </CardHeader>

      <CardContent>
        {recent.length === 0 ? (
          <p className="py-4 text-center text-xs text-muted-foreground">No activity yet.</p>
        ) : (
          <div>
            {recent.map((a, i) => (
              <div key={a.id} className="flex gap-2.5 py-1.5">
                <div className="flex flex-col items-center">
                  <Avatar className="h-7 w-7 shrink-0 shadow-sm">
                    <AvatarFallback
                      className="text-xs font-bold text-white"
                      style={{ backgroundColor: a.color }}
                    >
                      {a.init}
                    </AvatarFallback>
                  </Avatar>
                  {i < recent.length - 1 && <div className="mt-1 w-px flex-1 bg-border" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs leading-normal text-secondary-foreground">
                    <span className="font-semibold text-foreground">{a.user}</span>{" "}
                    {a.action}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {a.time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {a.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
