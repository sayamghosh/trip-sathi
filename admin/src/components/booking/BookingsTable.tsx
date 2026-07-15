import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Plus, Search, XCircle } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"

const SEARCH_DEBOUNCE_MS = 400

export interface Booking {
  _id: string
  travelerName: string
  travelerPhone?: string
  tripDate?: string
  createdAt?: string
  finalPrice: number
  paymentStatus: 'unpaid' | 'advance_paid' | 'fully_paid'
  status: 'confirmed' | 'cancelled'
  tourPlanId?: {
    title?: string
    durationDays?: number
    durationNights?: number
  }
}

export interface BookingFilters {
  page: number
  limit: number
  search: string
  status: 'confirmed' | 'cancelled' | 'all'
  dateFrom: string
  dateTo: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface BookingsTableProps {
  bookings: Booking[]
  pagination?: Pagination
  filters: BookingFilters
  onFiltersChange: (next: Partial<BookingFilters>) => void
  onAddBooking: () => void
}

const paymentStatusLabel: Record<Booking['paymentStatus'], string> = {
  unpaid: "Unpaid",
  advance_paid: "Advance Paid",
  fully_paid: "Fully Paid",
}

export function BookingsTable({ bookings, pagination, filters, onFiltersChange, onAddBooking }: BookingsTableProps) {
  const queryClient = useQueryClient()

  // Keep the input snappy while typing, but only push into the actual
  // filter (and thus trigger a new /api/bookings/mine request) once the
  // guide pauses - avoids firing a request per keystroke.
  const [searchInput, setSearchInput] = useState(filters.search)

  useEffect(() => {
    setSearchInput(filters.search)
  }, [filters.search])

  useEffect(() => {
    if (searchInput === filters.search) return
    const handle = setTimeout(() => {
      onFiltersChange({ search: searchInput, page: 1 })
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(handle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/api/bookings/${id}/cancel`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })

  const handleCancel = (id: string) => {
    if (window.confirm("Cancel this booking?")) {
      cancelMutation.mutate(id)
    }
  }

  const totalPages = pagination?.totalPages ?? 1
  const page = pagination?.page ?? filters.page

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-[18px] font-bold text-foreground">Bookings</h3>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search traveler name, phone, email"
              className="h-9 w-full sm:w-[250px] rounded-[10px] border border-border bg-card pl-9 pr-3 text-[13px] text-foreground placeholder-muted-foreground/60 outline-none transition-all hover:bg-muted/30 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onFiltersChange({ dateFrom: e.target.value, page: 1 })}
            className="h-9 rounded-[10px] border border-border bg-card px-2.5 text-[13px] text-foreground outline-none"
            title="Trip date from"
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onFiltersChange({ dateTo: e.target.value, page: 1 })}
            className="h-9 rounded-[10px] border border-border bg-card px-2.5 text-[13px] text-foreground outline-none"
            title="Trip date to"
          />
          <select
            value={filters.status}
            onChange={(e) => onFiltersChange({ status: e.target.value as BookingFilters['status'], page: 1 })}
            className="h-9 rounded-[10px] border border-border bg-card px-2.5 text-[13px] text-foreground outline-none"
          >
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="all">All</option>
          </select>
          <button
            onClick={onAddBooking}
            className="flex h-9 items-center gap-1.5 rounded-[10px] bg-primary px-3.5 text-[13px] font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Add Booking
          </button>
        </div>
      </div>

      <div className="rounded-[12px] border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-muted/50 font-medium text-muted-foreground border-b border-border">
              <tr>
                <th className="px-5 py-3.5">Name</th>
                <th className="px-5 py-3.5">Booking Code</th>
                <th className="px-5 py-3.5">Package</th>
                <th className="px-5 py-3.5">Duration</th>
                <th className="px-5 py-3.5">Trip Date</th>
                <th className="px-5 py-3.5">Price</th>
                <th className="px-5 py-3.5">Payment</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-8 text-center text-muted-foreground">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => {
                  const statusClass = booking.status === "confirmed"
                    ? "bg-primary text-white"
                    : "bg-red-500/10 text-red-500";

                  const statusText = booking.status === "confirmed" ? "Confirmed" : "Cancelled";

                  const dateString = booking.tripDate
                    ? new Date(booking.tripDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : "N/A";

                  return (
                    <tr key={booking._id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4 font-medium text-foreground">
                        {booking.travelerName || "Anonymous"}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        BKG{booking._id?.toString().slice(-6).toUpperCase()}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {booking.tourPlanId?.title || "Custom Package"}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {booking.tourPlanId?.durationDays ?? "-"}D / {booking.tourPlanId?.durationNights ?? "-"}N
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {dateString}
                      </td>
                      <td className="px-5 py-4 font-medium text-foreground">
                        ₹{booking.finalPrice.toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {paymentStatusLabel[booking.paymentStatus]}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusClass}`}
                        >
                          {statusText}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {booking.status === "confirmed" && (
                          <button
                            onClick={() => handleCancel(booking._id)}
                            disabled={cancelMutation.isPending}
                            className="flex items-center gap-1 text-[12px] text-red-500 hover:text-red-600 disabled:opacity-50"
                            title="Cancel booking"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border px-5 py-3">
          <div className="text-[13px] text-muted-foreground">
            Showing{" "}
            <select
              value={filters.limit}
              onChange={(e) => onFiltersChange({ limit: Number(e.target.value), page: 1 })}
              className="mx-1 rounded border border-border bg-card text-foreground outline-none py-0.5 px-1"
            >
              {[8, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>{" "}
            out of {pagination?.total ?? 0}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onFiltersChange({ page: Math.max(1, page - 1) })}
              disabled={page <= 1}
              className="flex h-8 items-center gap-1 rounded-[6px] px-2.5 text-[13px] text-muted-foreground hover:bg-muted disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <span className="px-2 text-[13px] text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => onFiltersChange({ page: Math.min(totalPages, page + 1) })}
              disabled={page >= totalPages}
              className="flex h-8 items-center gap-1 rounded-[6px] px-2.5 text-[13px] text-muted-foreground hover:bg-muted disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
