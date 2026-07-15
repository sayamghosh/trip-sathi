import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Calendar, Users } from "lucide-react"
import api from "@/lib/axios"
import { mapBookingToEvent, type BookingResponse } from "@/lib/calendarEvents"
import type { Event } from "@/components/calendar/CalendarView"
import { ScheduleDetails } from "@/components/calendar/ScheduleDetails"

const paymentDot: Record<string, string> = {
  fully_paid: "bg-green-500",
  advance_paid: "bg-orange-500",
  unpaid: "bg-gray-400",
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
    <div className="rounded-[14px] border border-border bg-card p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-foreground">
          Upcoming Trips
        </h3>
        <span className="text-[10px] text-muted-foreground">Next {UPCOMING_WINDOW_DAYS} days</span>
      </div>

      {upcoming.length === 0 ? (
        <p className="py-4 text-center text-[11px] text-muted-foreground">No confirmed trips coming up.</p>
      ) : (
        <div className="space-y-2">
          {upcoming.map((b) => (
            <button
              key={b._id}
              type="button"
              onClick={() => handleSelect(b)}
              className="w-full rounded-[10px] border border-border/60 p-2.5 text-left transition hover:border-primary/40 hover:bg-accent/40 hover:shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-[9px] font-semibold text-muted-foreground">
                  {b.tourPlanId?.title || "Custom Package"}
                </span>
                <span className={`h-[7px] w-[7px] shrink-0 rounded-full ${paymentDot[b.paymentStatus]}`} title={b.paymentStatus} />
              </div>
              <h4 className="mt-1 truncate text-[12px] font-bold text-foreground">
                {b.tourPlanId?.locations?.join(", ") || "Not specified"}
              </h4>
              <div className="mt-1.5 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[9px] font-semibold text-primary">
                  <Users className="h-[10px] w-[10px]" />
                  {b.numberOfTravelers}
                </div>
                <div className="flex items-center gap-0.5 text-[9px] text-muted-foreground">
                  <Calendar className="h-[10px] w-[10px]" />
                  {new Date(b.tripDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <ScheduleDetails selectedEvent={selectedEvent} open={detailsOpen} onOpenChange={setDetailsOpen} />
    </div>
  )
}
