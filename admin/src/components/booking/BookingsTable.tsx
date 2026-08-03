import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Plus, Search, XCircle } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

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

const paymentStatusClass: Record<Booking['paymentStatus'], string> = {
  unpaid: "border-transparent bg-muted text-muted-foreground",
  advance_paid: "border-transparent bg-warning/10 text-warning",
  fully_paid: "border-transparent bg-success/10 text-success",
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
        <h3 className="text-lg font-bold text-foreground">Bookings</h3>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:flex-none">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
            <Input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search traveler name, phone, email"
              className="h-9 w-full pl-9 sm:w-64"
            />
          </div>
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onFiltersChange({ dateFrom: e.target.value, page: 1 })}
            className="h-9 w-auto"
            title="Trip date from"
          />
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onFiltersChange({ dateTo: e.target.value, page: 1 })}
            className="h-9 w-auto"
            title="Trip date to"
          />
          <Select
            value={filters.status}
            onChange={(e) => onFiltersChange({ status: e.target.value as BookingFilters['status'], page: 1 })}
            className="h-9 w-auto"
          >
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="all">All</option>
          </Select>
          <Button onClick={onAddBooking} size="sm" className="h-9">
            <Plus className="h-4 w-4" />
            Add Booking
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>Name</TableHead>
              <TableHead>Booking Code</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Trip Date</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="py-8 text-center text-muted-foreground">
                  No bookings found.
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => {
                const dateString = booking.tripDate
                  ? new Date(booking.tripDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : "N/A";

                return (
                  <TableRow key={booking._id}>
                    <TableCell className="font-medium text-foreground">
                      {booking.travelerName || "Anonymous"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      BKG{booking._id?.toString().slice(-6).toUpperCase()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {booking.tourPlanId?.title || "Custom Package"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {booking.tourPlanId?.durationDays ?? "-"}D / {booking.tourPlanId?.durationNights ?? "-"}N
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {dateString}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      ₹{booking.finalPrice.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={paymentStatusClass[booking.paymentStatus]}>
                        {paymentStatusLabel[booking.paymentStatus]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          booking.status === "confirmed"
                            ? "border-transparent bg-success/10 text-success"
                            : "border-transparent bg-destructive/10 text-destructive"
                        )}
                      >
                        {booking.status === "confirmed" ? "Confirmed" : "Cancelled"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {booking.status === "confirmed" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancel(booking._id)}
                          disabled={cancelMutation.isPending}
                          title="Cancel booking"
                          className="h-8 gap-1 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between border-t border-border px-5 py-3">
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <Select
              value={filters.limit}
              onChange={(e) => onFiltersChange({ limit: Number(e.target.value), page: 1 })}
              className="mx-1 inline-flex h-7 w-auto px-1.5 py-0"
            >
              {[8, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
            </Select>{" "}
            out of {pagination?.total ?? 0}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onFiltersChange({ page: Math.max(1, page - 1) })}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="px-2 text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onFiltersChange({ page: Math.min(totalPages, page + 1) })}
              disabled={page >= totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
