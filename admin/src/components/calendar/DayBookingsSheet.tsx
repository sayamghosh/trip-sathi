import { MapPin, Users } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Event } from "./CalendarView"

interface DayBookingsSheetProps {
  date: Date | null
  events: Event[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectEvent: (event: Event) => void
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
          {events.map((event) => {
            const status = event.paymentStatus || "unpaid"
            const initial = event.travelerName?.trim()?.[0]?.toUpperCase() || "?"
            return (
              <button
                key={event.id}
                onClick={() => onSelectEvent(event)}
                className="w-full rounded-xl border border-border bg-card/50 p-4 text-left shadow-sm transition-colors hover:bg-accent/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                        {initial}
                      </AvatarFallback>
                    </Avatar>
                    <p className="truncate font-semibold text-foreground">{event.travelerName}</p>
                  </div>
                  <Badge variant="secondary" className={cn("shrink-0", paymentBadgeStyle[status])}>
                    {paymentLabel[status]}
                  </Badge>
                </div>
                <p className="mt-2 truncate text-sm text-muted-foreground">
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
            )
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
}
