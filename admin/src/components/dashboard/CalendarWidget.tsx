import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { ChevronLeft, ChevronRight } from "lucide-react"
import api from "@/lib/axios"
import { cn } from "@/lib/utils"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { mapBookingToEvent, type BookingResponse } from "@/lib/calendarEvents"
import type { Event } from "@/components/calendar/CalendarView"
import { ScheduleDetails } from "@/components/calendar/ScheduleDetails"
import { DayBookingsSheet } from "@/components/calendar/DayBookingsSheet"

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function CalendarWidget() {
  const [viewDate, setViewDate] = useState(new Date())
  const today = new Date()

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [dayList, setDayList] = useState<{ date: Date; events: Event[] } | null>(null)
  const [dayListOpen, setDayListOpen] = useState(false)

  const { data: bookings = [] } = useQuery({
    queryKey: ['bookings', 'mini-calendar'],
    queryFn: async () => {
      const { data } = await api.get('/api/bookings/mine', { params: { status: 'confirmed', limit: 500 } })
      return data.data as BookingResponse[]
    },
  })

  const events = useMemo(() => bookings.map(mapBookingToEvent), [bookings])

  const y = viewDate.getFullYear()
  const m = viewDate.getMonth()
  const first = new Date(y, m, 1).getDay()
  const dim = new Date(y, m + 1, 0).getDate()
  const prevDim = new Date(y, m, 0).getDate()
  const monthStr = viewDate.toLocaleString("default", { month: "long" })

  // Group this month's events by day-of-month so a click can open the right
  // detail (single booking) or list (multiple bookings) sheet.
  const eventsByDay = useMemo(() => {
    const map = new Map<number, Event[]>()
    events.forEach((e) => {
      if (e.start.getFullYear() === y && e.start.getMonth() === m) {
        const day = e.start.getDate()
        map.set(day, [...(map.get(day) || []), e])
      }
    })
    return map
  }, [events, y, m])

  type DayItem = { d: number; cur: boolean; today: boolean; hl: boolean }
  const cells: DayItem[] = []
  for (let i = first - 1; i >= 0; i--)
    cells.push({ d: prevDim - i, cur: false, today: false, hl: false })
  for (let i = 1; i <= dim; i++)
    cells.push({
      d: i,
      cur: true,
      today: i === today.getDate() && m === today.getMonth() && y === today.getFullYear(),
      hl: eventsByDay.has(i),
    })
  const rem = 42 - cells.length
  for (let i = 1; i <= rem; i++)
    cells.push({ d: i, cur: false, today: false, hl: false })

  const navigate = (dir: -1 | 1) => {
    setViewDate(new Date(y, m + dir, 1))
  }

  const handleDayClick = (c: DayItem) => {
    if (!c.cur) return
    const dayEvents = eventsByDay.get(c.d)
    if (!dayEvents || dayEvents.length === 0) return
    if (dayEvents.length === 1) {
      setSelectedEvent(dayEvents[0])
      setDetailsOpen(true)
    } else {
      setDayList({ date: new Date(y, m, c.d), events: dayEvents })
      setDayListOpen(true)
    }
  }

  const handleSelectFromDayList = (event: Event) => {
    setDayListOpen(false)
    setSelectedEvent(event)
    setDetailsOpen(true)
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <span className="text-sm font-semibold text-foreground">
          {monthStr} {y}
        </span>
        <div className="flex gap-0.5">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-3 w-3 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => navigate(1)}>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7">
          {DOW.map((d) => (
            <div key={d} className="py-1 text-center text-xs font-medium text-muted-foreground/70">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((c, i) => (
            <button
              key={i}
              onClick={() => handleDayClick(c)}
              title={c.hl ? "View confirmed trip(s) on this day" : undefined}
              className={cn(
                "flex h-7 items-center justify-center rounded-md text-xs font-medium transition",
                !c.cur
                  ? "text-muted-foreground/30"
                  : c.today
                    ? "bg-primary font-bold text-primary-foreground shadow-lg shadow-primary/20"
                    : c.hl
                      ? "cursor-pointer font-semibold text-primary hover:bg-primary/10"
                      : "text-foreground/80 hover:bg-accent hover:text-foreground"
              )}
            >
              {c.d}
            </button>
          ))}
        </div>
      </CardContent>

      <ScheduleDetails selectedEvent={selectedEvent} open={detailsOpen} onOpenChange={setDetailsOpen} />
      <DayBookingsSheet
        date={dayList?.date ?? null}
        events={dayList?.events ?? []}
        open={dayListOpen}
        onOpenChange={setDayListOpen}
        onSelectEvent={handleSelectFromDayList}
      />
    </Card>
  )
}
