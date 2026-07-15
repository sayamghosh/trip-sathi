import { useState, useEffect } from "react"
import { CalendarView, type Event } from "@/components/calendar/CalendarView"
import { ScheduleDetails } from "@/components/calendar/ScheduleDetails"
import { DayBookingsSheet } from "@/components/calendar/DayBookingsSheet"
import api from "@/lib/axios"

interface BookingResponse {
  _id: string
  travelerName: string
  travelerPhone?: string
  tripDate: string
  numberOfTravelers: number
  paymentStatus: "unpaid" | "advance_paid" | "fully_paid"
  tourPlanId?: {
    title?: string
    locations?: string[]
    durationDays?: number
    durationNights?: number
  }
}

const paymentColor: Record<BookingResponse["paymentStatus"], string> = {
  fully_paid: "bg-green-500",
  advance_paid: "bg-orange-500",
  unpaid: "bg-gray-500",
}

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [dayList, setDayList] = useState<{ date: Date; events: Event[] } | null>(null)
  const [dayListOpen, setDayListOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Only confirmed bookings belong on the calendar - it's meant to be
        // the guide's "who's actually coming" view, not raw inquiries.
        const { data } = await api.get("/api/bookings/mine", {
          params: { status: "confirmed", limit: 500 },
        })
        const bookings: BookingResponse[] = data.data

        const mappedEvents: Event[] = bookings.map((booking) => {
          const start = new Date(booking.tripDate)
          const end = new Date(start)
          end.setDate(start.getDate() + Math.max(1, booking.tourPlanId?.durationDays || 1))

          return {
            id: booking._id,
            title: `${booking.travelerName} · ${booking.tourPlanId?.title || "Custom Package"}`,
            start,
            end,
            type: "tour",
            color: paymentColor[booking.paymentStatus],
            destination: booking.tourPlanId?.locations?.join(", ") || "Not specified",
            duration: `${booking.tourPlanId?.durationDays ?? 0} Days / ${booking.tourPlanId?.durationNights ?? 0} Nights`,
            participants: booking.numberOfTravelers,
            travelerName: booking.travelerName,
            travelerPhone: booking.travelerPhone,
            paymentStatus: booking.paymentStatus,
          }
        })

        setEvents(mappedEvents)
      } catch (error) {
        console.error("Error fetching calendar data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event)
    setDetailsOpen(true)
  }

  const handleShowMore = (date: Date, dayEvents: Event[]) => {
    setDayList({ date, events: dayEvents })
    setDayListOpen(true)
  }

  const handleSelectFromDayList = (event: Event) => {
    setDayListOpen(false)
    handleSelectEvent(event)
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col text-foreground pr-2">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <CalendarView
          events={events}
          selectedEvent={detailsOpen ? selectedEvent : null}
          onSelectEvent={handleSelectEvent}
          onShowMore={handleShowMore}
        />
      </div>

      <ScheduleDetails
        selectedEvent={selectedEvent}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />

      <DayBookingsSheet
        date={dayList?.date ?? null}
        events={dayList?.events ?? []}
        open={dayListOpen}
        onOpenChange={setDayListOpen}
        onSelectEvent={handleSelectFromDayList}
      />
    </div>
  )
}
