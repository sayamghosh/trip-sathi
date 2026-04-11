import { useState, useEffect } from "react"
import { CalendarView, type Event } from "@/components/calendar/CalendarView"
import { ScheduleDetails } from "@/components/calendar/ScheduleDetails"
import api from "@/lib/axios"

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch Tour Plans (Packages)
        const { data: plans } = await api.get("/api/tour-plans")
        
        // Map Tour Plans to Calendar Events
        // Since Tour Plans don't have fixed dates in the current schema,
        // we map them to events spread across the current month for visualization.
        const mappedEvents: Event[] = plans.map((plan: any, index: number) => {
          const startDate = new Date()
          startDate.setDate(1 + (index * 5) % 25) // Spread them out
          startDate.setMonth(new Date().getMonth()) // Current month
          
          const endDate = new Date(startDate)
          endDate.setDate(startDate.getDate() + (plan.durationDays || 3))

          return {
            id: plan._id,
            title: plan.title,
            start: startDate,
            end: endDate,
            type: "tour",
            color: index % 4 === 0 
              ? "bg-blue-500" 
              : index % 4 === 1 
              ? "bg-purple-500"
              : index % 4 === 2
              ? "bg-green-500"
              : "bg-orange-500",
            destination: plan.locations?.join(", ") || "Various",
            duration: `${plan.durationDays || 0} Days / ${plan.durationNights || 0} Nights`,
            participants: 10 + (index * 5), // Mock participant data as it's not in TourPlan schema
            meetingPoints: [
              { type: "AIRPORT", name: "Local International Airport", time: "08:00 AM" },
              { type: "AIRPORT", name: "Local International Airport", time: "04:30 PM", isFinish: true },
            ]
          }
        })

        setEvents(mappedEvents)
        if (mappedEvents.length > 0) {
          setSelectedEvent(mappedEvents[0])
        }
      } catch (error) {
        console.error("Error fetching calendar data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col text-foreground pr-2">
      <div className="flex flex-1 gap-6 overflow-hidden min-h-[700px]">
        {/* Main Calendar Area */}
        <CalendarView 
          events={events} 
          selectedEvent={selectedEvent} 
          onSelectEvent={setSelectedEvent} 
        />

        {/* Sidebar: Schedule Details */}
        <ScheduleDetails selectedEvent={selectedEvent} />
      </div>
    </div>
  )
}
