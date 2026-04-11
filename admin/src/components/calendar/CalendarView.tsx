import { useState, useMemo } from "react"
import { ChevronDown, ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Users, HelpCircle, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Event {
  id: string
  title: string
  start: Date
  end: Date
  type: "stay" | "tour" | "activity"
  color?: string
  destination?: string
  duration?: string
  participants?: number
  meetingPoints?: {
    type: "AIRPORT" | "STATION"
    name: string
    time: string
    isFinish?: boolean
  }[]
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

interface CalendarViewProps {
  events: Event[]
  selectedEvent: Event | null
  onSelectEvent: (event: Event) => void
}

export function CalendarView({ events, selectedEvent, onSelectEvent }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2028, 6, 1))
  const [view, setView] = useState<"Day" | "Week" | "Month">("Month")
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const monthName = currentDate.toLocaleString("default", { month: "long" })
  const year = currentDate.getFullYear()

  // Calendar logic
  const daysInMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, currentDate.getMonth(), 1).getDay()
  
  const days = []
  const prevMonthLastDay = new Date(year, currentDate.getMonth(), 0).getDate()
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({ day: prevMonthLastDay - i, currentMonth: false })
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, currentMonth: true })
  }
  const remainingCells = 42 - days.length
  for (let i = 1; i <= remainingCells; i++) {
    days.push({ day: i, currentMonth: false })
  }

  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.start)
      const eventEnd = new Date(event.end)
      const dayStart = new Date(date)
      dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(date)
      dayEnd.setHours(23, 59, 59, 999)
      
      return eventStart <= dayEnd && eventEnd >= dayStart
    })
  }

  const handleNavigate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    const amount = direction === "next" ? 1 : -1
    
    if (view === "Month") {
      newDate.setMonth(currentDate.getMonth() + amount)
    } else if (view === "Week") {
      newDate.setDate(currentDate.getDate() + (amount * 7))
    } else {
      newDate.setDate(currentDate.getDate() + amount)
    }
    setCurrentDate(newDate)
  }

  const getDayLabel = () => {
    if (view === "Month") return `${monthName} ${year}`
    if (view === "Week") {
      const startOfWeek = new Date(currentDate)
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)
      
      if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
        return `${startOfWeek.toLocaleString("default", { month: "short" })} ${startOfWeek.getDate()} - ${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`
      }
      return `${startOfWeek.toLocaleString("default", { month: "short" })} ${startOfWeek.getDate()} - ${endOfWeek.toLocaleString("default", { month: "short" })} ${endOfWeek.getDate()}, ${endOfWeek.getFullYear()}`
    }
    return currentDate.toLocaleDateString("default", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
  }

  // Row-based layout engine for visual continuity of multi-day events
  const rowAssignments = useMemo(() => {
    const assigned: Record<string, number> = {}
    const rows: { id: string, start: number, end: number }[][] = []
    
    const sortedEvents = [...events].sort((a, b) => {
      const lenA = a.end.getTime() - a.start.getTime()
      const lenB = b.end.getTime() - b.start.getTime()
      if (lenB !== lenA) return lenB - lenA
      return a.start.getTime() - b.start.getTime()
    })

    sortedEvents.forEach(event => {
       const eStart = event.start.getTime()
       const eEnd = event.end.getTime()
       let rowIndex = 0
       
       while (true) {
         if (!rows[rowIndex]) rows[rowIndex] = []
         const hasOverlap = rows[rowIndex].some(r => eStart < r.end && r.start < eEnd)

         if (!hasOverlap) {
            rows[rowIndex].push({ id: event.id, start: eStart, end: eEnd })
            assigned[event.id] = rowIndex
            break
         }
         rowIndex++
       }
    })
    return assigned
  }, [events])

  const maxRowsInWeek = useMemo(() => {
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
    startOfWeek.setHours(0,0,0,0)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 7)
    
    let max = 10 // Minimum rows to ensure a clean look without unnecessary scrolling
    events.forEach(event => {
      const eStart = new Date(event.start)
      const eEnd = new Date(event.end)
      if (eStart < endOfWeek && eEnd >= startOfWeek) {
        const row = rowAssignments[event.id] || 0
        if (row + 1 > max) max = row + 1
      }
    })
    return max
  }, [events, currentDate, rowAssignments])

  return (
    <div className="flex flex-1 flex-col rounded-3xl border border-border bg-card/50 dark:bg-background p-6 shadow-sm backdrop-blur-sm">
      {/* Calendar Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-baseline gap-2">
             <span className="text-2xl font-bold text-foreground">{monthName}</span>
             <span className="text-2xl font-normal text-muted-foreground/80">{year}</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-1.5 text-sm font-medium border border-border rounded-full hover:bg-accent transition-colors text-foreground"
            >
              Today
            </button>
            <div className="flex items-center gap-2 text-muted-foreground">
              <button 
                onClick={() => handleNavigate("prev")}
                className="p-1 hover:bg-accent hover:text-foreground rounded-full transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={() => handleNavigate("next")}
                className="p-1 hover:bg-accent hover:text-foreground rounded-full transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-foreground/70">
             <button className="p-1.5 hover:bg-accent rounded-full text-muted-foreground hover:text-foreground transition-colors"><HelpCircle className="h-5 w-5" /></button>
             <button className="p-1.5 hover:bg-accent rounded-full text-muted-foreground hover:text-foreground transition-colors"><Settings className="h-5 w-5" /></button>
          </div>
          <div className="w-px h-5 bg-border mx-1"></div>
          <div className="flex rounded-lg bg-accent/30 p-1 border border-border/50">
            {["Day", "Week", "Month"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v as any)}
                className={cn(
                  "px-4 py-1.5 text-sm font-medium transition-all rounded-md",
                  view === v ? "bg-background text-foreground shadow-sm border border-border/50" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar content based on view */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {view === "Month" && (
          <div className="flex flex-1 flex-col border border-border bg-card rounded-md overflow-hidden">
            <div className="grid grid-cols-7 border-b border-border">
              {DAYS.map((day) => (
                <div key={day} className="text-left text-sm font-medium text-foreground py-2.5 px-4 lg:px-4 border-r border-border last:border-r-0">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid flex-1 grid-cols-7 grid-rows-6">
              {days.map((d, i) => {
                const dayDate = new Date(year, currentDate.getMonth(), d.day)
                if (!d.currentMonth) {
                  // Adjust month for previous/next month days
                  if (i < 7) dayDate.setMonth(currentDate.getMonth() - 1)
                  else dayDate.setMonth(currentDate.getMonth() + 1)
                }
                
                const dayEvents = getEventsForDay(dayDate).sort((a, b) => a.id.localeCompare(b.id))
                const today = new Date()
                const isToday = d.currentMonth && 
                               d.day === today.getDate() && 
                               currentDate.getMonth() === today.getMonth() && 
                               currentDate.getFullYear() === today.getFullYear()
                
                return (
                  <div
                    key={i}
                    className={cn(
                      "relative border-r border-b border-border transition-colors min-h-[120px] flex flex-col pt-2",
                      (i + 1) % 7 === 0 && "border-r-0",
                      i >= 35 && "border-b-0",
                      isToday ? "bg-background" : "bg-card"
                    )}
                  >
                    <div className="px-3 mb-1.5 flex">
                      <span className={cn(
                        "text-sm h-8 w-8 flex items-center justify-center shrink-0 rounded-full",
                        d.currentMonth ? "text-foreground font-normal" : "text-muted-foreground/40 font-normal",
                        isToday && "bg-[#1a73e8] text-white font-medium"
                      )}>
                        {d.day}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 z-10 relative">
                      {[0, 1, 2, 3].map((rowIndex) => {
                        const event = dayEvents.find(e => rowAssignments[e.id] === rowIndex)
                        if (event) {
                          const eStart = new Date(event.start).setHours(0,0,0,0)
                          const eEnd = new Date(event.end).setHours(0,0,0,0)
                          const dDate = new Date(dayDate).setHours(0,0,0,0)
                          
                          const nDay = new Date(dayDate); nDay.setDate(dayDate.getDate() + 1); const nDate = nDay.setHours(0,0,0,0)
                          const pDay = new Date(dayDate); pDay.setDate(dayDate.getDate() - 1); const pDate = pDay.setHours(0,0,0,0)
                          
                          const continuesNext = eEnd >= nDate
                          const continuesPrev = eStart <= pDate
                          
                          // Custom pastel color mapping based on screenshot
                          let colorStyle = "bg-[#fce8e6] text-[#8c1d18] border-[#c5221f] dark:bg-pink-900/30 dark:text-pink-200 dark:border-pink-700" // default pink
                          const colorKey = event.color?.split(' ')[0]
                          if (colorKey?.includes("blue")) colorStyle = "bg-[#d3e3fd] text-[#041e49] border-[#0b57d0] dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-700"
                          if (colorKey?.includes("green")) colorStyle = "bg-[#e6f4ea] text-[#0d652d] border-[#137333] dark:bg-green-900/30 dark:text-green-200 dark:border-green-700"
                          if (colorKey?.includes("purple")) colorStyle = "bg-[#f3e8fd] text-[#681fa2] border-[#8e24aa] dark:bg-purple-900/30 dark:text-purple-200 dark:border-purple-700"
                          if (colorKey?.includes("orange")) colorStyle = "bg-[#fef7e0] text-[#b06000] border-[#e65100] dark:bg-orange-900/30 dark:text-orange-200 dark:border-orange-700"

                          return (
                            <div
                              key={event.id}
                              onClick={() => onSelectEvent(event)}
                              className={cn(
                                "cursor-pointer h-[22px] px-2 text-xs font-medium leading-none flex items-center transition-opacity hover:opacity-80 active:opacity-60",
                                colorStyle,
                                !continuesPrev ? "rounded-l ml-2 border-l-[3px]" : "border-l-0 ml-0",
                                !continuesNext ? "rounded-r mr-2" : "mr-0",
                                selectedEvent?.id === event.id && "brightness-95 ring-1 ring-inset ring-black/5"
                              )}
                            >
                              <span className="truncate w-full">{event.title}</span>
                            </div>
                          )
                        }
                        return <div key={rowIndex} className="h-[22px]" />
                      })}
                      {dayEvents.length > 4 && (
                        <div className="text-[10px] font-bold text-muted-foreground/60 hover:text-foreground transition-colors pl-2 mt-0.5 cursor-default">
                           + {dayEvents.length - 4} more
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {view === "Week" && (
          <div className="flex flex-1 flex-col border border-border bg-card rounded-md overflow-hidden">
            <div className="grid grid-cols-7 border-b border-border bg-background">
              {Array.from({ length: 7 }).map((_, i) => {
                const startOfWeek = new Date(currentDate)
                startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + i)
                const isToday = startOfWeek.toDateString() === new Date().toDateString()
                
                return (
                  <div key={i} className="flex flex-col items-center py-3 border-r border-border last:border-r-0">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{DAYS[i]}</span>
                    <span className={cn(
                      "mt-1 text-2xl h-12 w-12 flex items-center justify-center rounded-full font-normal transition-colors",
                      isToday ? "bg-[#1a73e8] text-white" : "text-foreground"
                    )}>
                      {startOfWeek.getDate()}
                    </span>
                  </div>
                )
              })}
            </div>
            
            <div className="grid flex-1 grid-cols-7 overflow-y-auto custom-scrollbar">
              {Array.from({ length: 7 }).map((_, i) => {
                const startOfWeek = new Date(currentDate)
                startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + i)
                const dayDate = new Date(startOfWeek)
                
                const dayEvents = getEventsForDay(dayDate).sort((a, b) => a.id.localeCompare(b.id))
                const isToday = dayDate.toDateString() === new Date().toDateString()
                
                return (
                  <div key={i} className={cn(
                    "relative border-r border-border min-h-full flex flex-col pt-3 pb-8 last:border-r-0", 
                    isToday ? "bg-background" : "bg-card"
                  )}>
                    <div className="flex flex-col gap-1.5 z-10 relative">
                      {Array.from({ length: maxRowsInWeek }).map((_, rowIndex) => {
                        const event = dayEvents.find(e => rowAssignments[e.id] === rowIndex)
                        if (event) {
                          const eStart = new Date(event.start).setHours(0,0,0,0)
                          const eEnd = new Date(event.end).setHours(0,0,0,0)
                          const dDate = new Date(dayDate).setHours(0,0,0,0)
                          
                          const nDay = new Date(dayDate); nDay.setDate(dayDate.getDate() + 1); const nDate = nDay.setHours(0,0,0,0)
                          const pDay = new Date(dayDate); pDay.setDate(dayDate.getDate() - 1); const pDate = pDay.setHours(0,0,0,0)
                          
                          const continuesNext = eEnd >= nDate
                          const continuesPrev = eStart <= pDate
                          
                          // Custom pastel color mapping based on screenshot
                          let colorStyle = "bg-[#fce8e6] text-[#8c1d18] border-[#c5221f] dark:bg-pink-900/30 dark:text-pink-200 dark:border-pink-700" 
                          const colorKey = event.color?.split(' ')[0]
                          if (colorKey?.includes("blue")) colorStyle = "bg-[#d3e3fd] text-[#041e49] border-[#0b57d0] dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-700"
                          if (colorKey?.includes("green")) colorStyle = "bg-[#e6f4ea] text-[#0d652d] border-[#137333] dark:bg-green-900/30 dark:text-green-200 dark:border-green-700"
                          if (colorKey?.includes("purple")) colorStyle = "bg-[#f3e8fd] text-[#681fa2] border-[#8e24aa] dark:bg-purple-900/30 dark:text-purple-200 dark:border-purple-700"
                          if (colorKey?.includes("orange")) colorStyle = "bg-[#fef7e0] text-[#b06000] border-[#e65100] dark:bg-orange-900/30 dark:text-orange-200 dark:border-orange-700"

                          return (
                            <div
                              key={event.id}
                              onClick={() => onSelectEvent(event)}
                              className={cn(
                                "cursor-pointer h-[38px] py-1 px-2.5 flex flex-col justify-center transition-opacity hover:opacity-80 active:opacity-60",
                                colorStyle,
                                !continuesPrev ? "rounded-md ml-2 border-l-[4px]" : "border-l-0 ml-0",
                                !continuesNext ? "rounded-r-md mr-2" : "mr-0",
                                selectedEvent?.id === event.id && "brightness-95 ring-1 ring-inset ring-black/5"
                              )}
                            >
                              <span className="truncate w-full font-semibold text-xs text-current">{event.title}</span>
                              <span className="truncate w-full text-[10px] opacity-70">
                                {event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          )
                        }
                        return <div key={rowIndex} className="h-[38px]" />
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {view === "Day" && (
          <div className="flex flex-1 flex-col h-full border-t border-border overflow-hidden">
            <div className="flex flex-1 overflow-hidden">
              {/* Time axis */}
              <div className="w-16 border-r border-border flex flex-col py-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="h-20 text-[10px] font-bold text-muted-foreground text-center relative">
                    <span className="absolute -top-2 left-0 right-0">{i * 2}:00</span>
                  </div>
                ))}
              </div>
              
              {/* Timeline content */}
              <div className="flex-1 relative overflow-y-auto p-8 bg-[radial-gradient(ellipse_at_top_right,rgba(46,124,246,0.05)_0%,transparent_70%)] custom-scrollbar">
                <div className="max-w-5xl mx-auto space-y-10">
                  <div className="flex items-center justify-between border-b border-border/50 pb-8 mb-12">
                    <div>
                        <h3 className="text-4xl font-black tracking-tight text-foreground mb-2">Focus Mode</h3>
                        <p className="text-base font-bold text-muted-foreground uppercase tracking-[0.4em]">Agenda for {currentDate.toLocaleDateString('default', { day: 'numeric', month: 'long' })}</p>
                    </div>
                    <div className="px-6 py-3 rounded-2xl bg-primary/10 border-2 border-primary/20 shadow-md">
                        <span className="text-sm font-black text-primary uppercase tracking-widest">{getEventsForDay(currentDate).length} Experiences Scheduled</span>
                    </div>
                  </div>

                  {getEventsForDay(currentDate)
                    .sort((a, b) => {
                      const timeDiff = a.start.getTime() - b.start.getTime()
                      if (timeDiff !== 0) return timeDiff
                      return a.id.localeCompare(b.id)
                    })
                    .map((event, idx) => (
                    <div
                      key={event.id}
                      onClick={() => onSelectEvent(event)}
                      className={cn(
                        "group rounded-[32px] p-10 shadow-xl transition-all duration-500 cursor-pointer overflow-hidden relative",
                        "bg-card border-2 border-border hover:border-primary/50",
                        "hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2",
                        selectedEvent?.id === event.id && "ring-4 ring-primary/20 border-primary"
                      )}
                    >
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-10">
                          <div className="space-y-3">
                            <span className="text-xs font-black text-primary uppercase tracking-[0.5em] mb-2 block">{idx + 1}. Session</span>
                            <h4 className="text-4xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight max-w-2xl">{event.title}</h4>
                          </div>
                          <span className="text-xs font-black px-6 py-3 rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/30 uppercase tracking-[0.2em]">{event.duration}</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                          <div className="flex items-center gap-5 group/item">
                            <div className="p-4 rounded-2xl bg-accent group-hover/item:bg-primary/20 transition-all duration-300">
                                <CalendarIcon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-1.5 focus-ring">Schedule</p>
                                <span className="text-lg font-bold text-foreground">{event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                          
                          {event.destination && (
                            <div className="flex items-center gap-5 group/item">
                              <div className="p-4 rounded-2xl bg-accent group-hover/item:bg-primary/20 transition-all duration-300">
                                  <MapPin className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-1.5">Destination</p>
                                  <span className="text-lg font-bold text-foreground line-clamp-1">{event.destination}</span>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-5 group/item">
                              <div className="p-4 rounded-2xl bg-accent group-hover/item:bg-primary/20 transition-all duration-300">
                                  <Users className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-1.5">Status</p>
                                  <span className="text-lg font-bold text-success flex items-center gap-2">
                                     <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
                                     Confirmed
                                  </span>
                              </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {getEventsForDay(currentDate).length === 0 && (
                    <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-border rounded-[40px] bg-accent/5">
                      <div className="h-20 w-20 rounded-full bg-accent flex items-center justify-center mb-6">
                        <CalendarIcon className="h-10 w-10 text-muted-foreground/30" />
                      </div>
                      <h3 className="text-xl font-black tracking-tighter text-muted-foreground/60 mb-2">Clear Agenda</h3>
                      <p className="text-sm font-bold text-muted-foreground/40 uppercase tracking-widest">No experiences scheduled for this day</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
