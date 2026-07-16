import type { Event } from "@/components/calendar/CalendarView"

export interface BookingResponse {
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

export function mapBookingToEvent(booking: BookingResponse): Event {
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
}
