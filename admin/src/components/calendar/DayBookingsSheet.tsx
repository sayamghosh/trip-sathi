import { MapPin, Users } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import type { Event } from "./CalendarView"

interface DayBookingsSheetProps {
  date: Date | null
  events: Event[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectEvent: (event: Event) => void
}

const paymentDot: Record<string, string> = {
  fully_paid: "bg-green-500",
  advance_paid: "bg-orange-500",
  unpaid: "bg-gray-400",
}

export function DayBookingsSheet({ date, events, open, onOpenChange, onSelectEvent }: DayBookingsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full data-[side=right]:sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-xl">
            {date?.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' }) || "Bookings"}
          </SheetTitle>
          <SheetDescription>
            {events.length} confirmed {events.length === 1 ? "booking" : "bookings"} on this day
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 pb-4">
          {events.map((event) => (
            <button
              key={event.id}
              onClick={() => onSelectEvent(event)}
              className="w-full rounded-xl border border-border bg-card/50 p-4 text-left shadow-sm transition-colors hover:bg-accent/40"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-foreground">{event.travelerName}</p>
                <span
                  className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", paymentDot[event.paymentStatus || "unpaid"])}
                  title={event.paymentStatus}
                />
              </div>
              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                {event.title.split("·")[1]?.trim() || event.title}
              </p>
              <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                {event.destination && (
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {event.destination}
                  </span>
                )}
                <span className="flex items-center gap-1 shrink-0">
                  <Users className="h-3 w-3" />
                  {event.participants || 0}
                </span>
              </div>
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
