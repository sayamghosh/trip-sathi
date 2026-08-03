import { MapPin, Clock, Calendar as CalendarIcon, Users, Phone, Plane, Train } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { Event } from "./CalendarView"

interface ScheduleDetailsProps {
  selectedEvent: Event | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const paymentBadgeStyle: Record<string, string> = {
  fully_paid: "bg-success/10 text-success",
  advance_paid: "bg-warning/10 text-warning",
  unpaid: "bg-muted text-muted-foreground",
}

const paymentLabel: Record<string, string> = {
  fully_paid: "Fully Paid",
  advance_paid: "Advance Paid",
  unpaid: "Unpaid",
}

export function ScheduleDetails({ selectedEvent, open, onOpenChange }: ScheduleDetailsProps) {
  const status = selectedEvent?.paymentStatus || "unpaid"

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full data-[side=right]:sm:max-w-md">
        <SheetHeader>
          <div className="flex items-start justify-between gap-2">
            <SheetTitle className="text-xl">{selectedEvent?.title || "Schedule Details"}</SheetTitle>
            {selectedEvent && (
              <Badge variant="secondary" className={cn("shrink-0", paymentBadgeStyle[status])}>
                {paymentLabel[status]}
              </Badge>
            )}
          </div>
          <SheetDescription>Booking details for this trip</SheetDescription>
        </SheetHeader>

        {selectedEvent && (
          <div className="flex-1 space-y-8 overflow-y-auto px-4 pb-4">
            <div className="space-y-5 text-sm">
              {selectedEvent.travelerName && (
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 p-2 bg-accent rounded-lg">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1 uppercase tracking-wider font-semibold">Traveler</p>
                    <p className="font-semibold text-foreground">{selectedEvent.travelerName}</p>
                    {selectedEvent.travelerPhone && (
                      <p className="text-muted-foreground text-sm">{selectedEvent.travelerPhone}</p>
                    )}
                  </div>
                </div>
              )}

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
                <div>
                  <p className="text-muted-foreground text-xs mb-1 uppercase tracking-wider font-semibold">Total Participants</p>
                  <p className="font-semibold text-foreground">{selectedEvent.participants || 0}</p>
                </div>
              </div>
            </div>

            {selectedEvent.meetingPoints && selectedEvent.meetingPoints.length > 0 && (
              <div>
                <Separator className="mb-6" />
                <h4 className="text-sm font-bold text-foreground mb-4">Meeting Points</h4>
                <div className="space-y-4">
                  {selectedEvent.meetingPoints.map((mp, index) => (
                    <div key={index} className="p-4 rounded-xl border border-border bg-card/50 shadow-sm backdrop-blur-xs transition-colors hover:bg-accent/10">
                      <div className="flex items-center gap-2 mb-2">
                        {mp.type === "AIRPORT" ? (
                          <Plane className="h-4 w-4 text-primary" />
                        ) : (
                          <Train className="h-4 w-4 text-primary" />
                        )}
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{mp.type}</span>
                      </div>
                      <p className="text-xs font-bold text-primary mb-1 uppercase">{mp.isFinish ? "Finish" : "Start"}</p>
                      <p className="text-sm font-bold text-foreground mb-1">{mp.name}</p>
                      <p className="text-xs text-muted-foreground font-medium">{mp.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
