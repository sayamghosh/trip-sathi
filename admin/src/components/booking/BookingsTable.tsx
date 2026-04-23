import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Plus, Search } from "lucide-react"

interface BookingsTableProps {
  bookings: any[]
}

export function BookingsTable({ bookings }: BookingsTableProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] font-bold text-foreground">Bookings</h3>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
            <input
              type="text"
              placeholder="Search name, package, etc"
              className="h-9 w-full sm:w-[250px] rounded-[10px] border border-border bg-card pl-9 pr-3 text-[13px] text-foreground placeholder-muted-foreground/60 outline-none transition-all hover:bg-muted/30 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
          <button className="flex h-9 items-center gap-2 rounded-[10px] border border-border bg-card px-3 text-[13px] font-medium text-foreground hover:bg-muted/80 transition-colors">
            <CalendarDays className="h-4 w-4 text-muted-foreground/80" />
            Today
            <ChevronDown className="h-4 w-4 text-muted-foreground/80" />
          </button>
          <button className="flex h-9 items-center gap-1.5 rounded-[10px] bg-primary px-3.5 text-[13px] font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]">
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
                <th className="px-5 py-3.5 flex items-center gap-1 cursor-pointer">Name <ChevronDown className="h-3 w-3 opacity-50" /></th>
                <th className="px-5 py-3.5">Booking Code <ChevronDown className="h-3 w-3 inline opacity-50 mb-[2px] ml-1" /></th>
                <th className="px-5 py-3.5">Package <ChevronDown className="h-3 w-3 inline opacity-50 mb-[2px] ml-1" /></th>
                <th className="px-5 py-3.5">Duration <ChevronDown className="h-3 w-3 inline opacity-50 mb-[2px] ml-1" /></th>
                <th className="px-5 py-3.5">Date <ChevronDown className="h-3 w-3 inline opacity-50 mb-[2px] ml-1" /></th>
                <th className="px-5 py-3.5">Price <ChevronDown className="h-3 w-3 inline opacity-50 mb-[2px] ml-1" /></th>
                <th className="px-5 py-3.5">Status <ChevronDown className="h-3 w-3 inline opacity-50 mb-[2px] ml-1" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                bookings.map((booking: any) => {
                  const statusClass = booking.status === "contacted"
                    ? "bg-primary text-white"
                    : booking.status === "pending"
                      ? "bg-blue-500/10 text-blue-500"
                      : "bg-red-500/10 text-red-500";

                  const statusText = booking.status === "contacted"
                    ? "Confirmed"
                    : booking.status === "pending"
                      ? "Pending"
                      : "Cancelled";

                  const dateString = booking.createdAt
                    ? new Date(booking.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : "N/A";

                  return (
                    <tr key={booking._id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4 font-medium text-foreground">
                        {booking.requesterName || "Anonymous"}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        BKG{booking._id?.toString().substring(0, 5).toUpperCase()}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {booking.tourPlanId?.title || "Custom Package"}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {booking.tourPlanId?.duration || "N/A"} Days
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {dateString}
                      </td>
                      <td className="px-5 py-4 font-medium text-foreground">
                        {booking.tourPlanId?.basePrice ? `₹${booking.tourPlanId.basePrice.toLocaleString()}` : "N/A"}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusClass}`}
                        >
                          {statusText}
                        </span>
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
            <select className="mx-1 rounded border border-border bg-card text-foreground outline-none py-0.5 px-1">
              <option className="bg-card text-foreground">8</option>
            </select>{" "}
            out of 286
          </div>
          <div className="flex items-center gap-1">
            <button className="flex h-8 items-center gap-1 rounded-[6px] px-2.5 text-[13px] text-muted-foreground hover:bg-muted">
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#3B82F6] text-[13px] font-medium text-white hover:bg-[#3B82F6]/90">
              1
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[13px] font-medium text-muted-foreground hover:bg-muted">
              2
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[13px] font-medium text-muted-foreground hover:bg-muted">
              3
            </button>
            <span className="text-muted-foreground mx-1">...</span>
            <button className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[13px] font-medium text-muted-foreground hover:bg-muted">
              16
            </button>
            <button className="flex h-8 items-center gap-1 rounded-[6px] px-2.5 text-[13px] text-muted-foreground hover:bg-muted">
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
