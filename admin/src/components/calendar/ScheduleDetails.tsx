import { MoreHorizontal, MapPin, Clock, Calendar as CalendarIcon, Users, Plane, Train } from "lucide-react"
import type { Event } from "./CalendarView"

interface ScheduleDetailsProps {
  selectedEvent: Event | null
}

export function ScheduleDetails({ selectedEvent }: ScheduleDetailsProps) {
  return (
    <div className="w-[380px] flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-bold">Schedule Details</h2>
        <button className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {selectedEvent ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
          {/* Event Header */}
          <div>
            <h3 className="text-2xl font-bold text-primary mb-6">{selectedEvent.title}</h3>
            
            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 p-2 bg-accent rounded-lg">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1 uppercase tracking-wider font-semibold">Destination</p>
                  <p className="font-semibold text-foreground">{selectedEvent.destination || "Not specified"}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-0.5 p-2 bg-accent rounded-lg">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1 uppercase tracking-wider font-semibold">Duration</p>
                  <p className="font-semibold text-foreground">{selectedEvent.duration || "Not specified"}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-0.5 p-2 bg-accent rounded-lg">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1 uppercase tracking-wider font-semibold">Date</p>
                  <p className="font-semibold text-foreground">
                    {selectedEvent.start.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} - {selectedEvent.end.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-0.5 p-2 bg-accent rounded-lg">
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="w-full">
                  <p className="text-muted-foreground text-xs mb-1 uppercase tracking-wider font-semibold">Total Participant</p>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground">{selectedEvent.participants || 0}</p>
                    <div className="flex -space-x-2">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="h-7 w-7 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-[10px] font-bold text-primary">
                          {/* Avatar placeholder */}
                        </div>
                      ))}
                      <div className="h-7 w-7 rounded-full bg-accent border-2 border-card flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                        & { (selectedEvent.participants || 25) - 5 } others
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Meeting Points */}
          <div>
            <h4 className="text-sm font-bold text-foreground mb-4">Meeting Points</h4>
            <div className="space-y-4">
              {selectedEvent.meetingPoints?.map((mp, index) => (
                <div key={index} className="p-4 rounded-xl border border-border bg-card/50 shadow-sm backdrop-blur-xs transition-colors hover:bg-accent/10">
                  <div className="flex items-center gap-2 mb-2">
                    {mp.type === "AIRPORT" ? (
                      <Plane className="h-4 w-4 text-primary" />
                    ) : (
                      <Train className="h-4 w-4 text-primary" />
                    )}
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{mp.type}</span>
                  </div>
                  <p className="text-[10px] font-bold text-primary mb-1 uppercase">{mp.isFinish ? "Finish" : "Start"}</p>
                  <p className="text-[13px] font-bold text-foreground mb-1">{mp.name}</p>
                  <p className="text-[11px] text-muted-foreground font-medium">{mp.time}</p>
                </div>
              )) || <p className="text-sm text-muted-foreground">No meeting points defined</p>}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center text-muted-foreground text-sm">
          Select an event to see details
        </div>
      )}
    </div>
  )
}
