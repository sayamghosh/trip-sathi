import { useState, useEffect } from "react"
import { CalendarView, type Event } from "@/components/calendar/CalendarView"
import { ScheduleDetails } from "@/components/calendar/ScheduleDetails"
import api from "@/lib/axios"
import { Link } from "@tanstack/react-router"
import { CalendarDays } from "lucide-react"

export default function Calendar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckLoading, setIsCheckLoading] = useState(true)

  useEffect(() => {
    const user = localStorage.getItem("user")
    setIsAuthenticated(!!user)
    setIsCheckLoading(false)
  }, [])

  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }
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

  if (isCheckLoading) return null

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center p-8 bg-card/50 rounded-3xl border border-dashed border-border backdrop-blur-sm">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
          <CalendarDays className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tight text-foreground">Sign in to view Calendar</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Please sign in with your administrator account to view your scheduled tours and events.
          </p>
        </div>
        <Link
          to="/login"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-10 text-[15px] font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 active:scale-95"
        >
          Sign In
        </Link>
      </div>
    )
  }

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
