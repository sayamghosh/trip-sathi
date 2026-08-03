import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Calendar, Users } from "lucide-react"
import api from "@/lib/axios"
import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { mapBookingToEvent, type BookingResponse } from "@/lib/calendarEvents"
import type { Event } from "@/components/calendar/CalendarView"
import { ScheduleDetails } from "@/components/calendar/ScheduleDetails"

const paymentDot: Record<string, string> = {
  fully_paid: "bg-success",
  advance_paid: "bg-warning",
  unpaid: "bg-muted-foreground",
}

const UPCOMING_WINDOW_DAYS = 14

export function UpcomingTrips() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const { data } = useQuery({
    queryKey: ['bookings', 'upcoming'],
    queryFn: async () => {
      const { data } = await api.get('/api/bookings/mine', {
        params: { status: 'confirmed', limit: 50 },
      })
      return data.data as BookingResponse[]
    },
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const windowEnd = new Date(today)
  windowEnd.setDate(today.getDate() + UPCOMING_WINDOW_DAYS)

  const upcoming = (data || [])
    .filter((b) => {
      const tripDate = new Date(b.tripDate)
      return tripDate >= today && tripDate <= windowEnd
    })
    .sort((a, b) => new Date(a.tripDate).getTime() - new Date(b.tripDate).getTime())
    .slice(0, 4)

  const handleSelect = (booking: BookingResponse) => {
    setSelectedEvent(mapBookingToEvent(booking))
    setDetailsOpen(true)
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold">Upcoming Trips</CardTitle>
        <span className="text-xs text-muted-foreground">Next {UPCOMING_WINDOW_DAYS} days</span>
      </CardHeader>

      <CardContent>
        {upcoming.length === 0 ? (
          <p className="py-4 text-center text-xs text-muted-foreground">No confirmed trips coming up.</p>
        ) : (
          <div className="space-y-2">
            {upcoming.map((b) => (
              <button
                key={b._id}
                type="button"
                onClick={() => handleSelect(b)}
                className="w-full rounded-lg border border-border/60 p-2.5 text-left transition hover:border-primary/40 hover:bg-accent hover:shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-semibold text-muted-foreground">
                    {b.tourPlanId?.title || "Custom Package"}
                  </span>
                  <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", paymentDot[b.paymentStatus])} title={b.paymentStatus} />
                </div>
                <h4 className="mt-1 truncate text-xs font-bold text-foreground">
                  {b.tourPlanId?.locations?.join(", ") || "Not specified"}
                </h4>
                <div className="mt-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs font-semibold text-primary">
                    <Users className="h-2.5 w-2.5" />
                    {b.numberOfTravelers}
                  </div>
                  <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
                    <Calendar className="h-2.5 w-2.5" />
                    {new Date(b.tripDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>

      <ScheduleDetails selectedEvent={selectedEvent} open={detailsOpen} onOpenChange={setDetailsOpen} />
    </Card>
  )
}
