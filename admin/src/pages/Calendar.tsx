import { useState, useEffect } from "react"
import { CalendarView, type Event } from "@/components/calendar/CalendarView"
import { ScheduleDetails } from "@/components/calendar/ScheduleDetails"
import { DayBookingsSheet } from "@/components/calendar/DayBookingsSheet"
import { mapBookingToEvent, type BookingResponse } from "@/lib/calendarEvents"
import api from "@/lib/axios"

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
        setEvents(bookings.map(mapBookingToEvent))
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
