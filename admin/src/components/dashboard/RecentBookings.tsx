import { Search, ArrowUpDown, Loader2, XCircle } from "lucide-react"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"

interface Booking {
  _id: string
  travelerName: string
  travelerPhone?: string
  tripDate?: string
  finalPrice: number
  status: 'confirmed' | 'cancelled'
  tourPlanId?: {
    title?: string
  }
}

const statusCls: Record<string, string> = {
  confirmed: "bg-success/20 text-success border border-success/30",
  cancelled: "bg-destructive/20 text-destructive border border-destructive/30",
}

export function RecentBookings() {
  const [searchQuery, setSearchQuery] = useState("")
  const queryClient = useQueryClient()

  const { data: bookings = [], isLoading: loading } = useQuery<Booking[]>({
    queryKey: ['bookings', 'recent'],
    queryFn: async () => {
      const { data } = await api.get('/api/bookings/mine', { params: { limit: 8, status: 'all' } })
      return data.data as Booking[]
    },
  })

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/api/bookings/${id}/cancel`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
    onError: () => {
      alert("Failed to cancel booking")
    },
  })

  const filteredBookings = bookings.filter(b =>
    b.travelerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.travelerPhone?.includes(searchQuery) ||
    b.tourPlanId?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="rounded-[14px] border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-foreground">
          Recent Bookings
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-[8px] border border-border px-2 py-[5px]">
            <Search className="h-[13px] w-[13px] text-muted-foreground" />
            <input
              placeholder="Search bookings"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[100px] border-none bg-transparent text-[11px] text-foreground placeholder-muted-foreground outline-none"
            />
          </div>
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {["Name", "Package", "Phone", "Trip Date", "Status", "Actions"].map(
              (h) => (
                <th
                  key={h}
                  className="px-2.5 py-2 text-left text-[11px] font-medium text-muted-foreground"
                >
                  <span className="flex items-center gap-1">
                    {h}
                    <ArrowUpDown className="h-[10px] w-[10px]" />
                  </span>
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="py-10 text-center">
                <Loader2 className="mx-auto h-5 w-5 animate-spin text-primary" />
              </td>
            </tr>
          ) : filteredBookings.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-10 text-center text-[12px] text-muted-foreground">
                No recent bookings.
              </td>
            </tr>
          ) : (
            filteredBookings.slice(0, 8).map((b) => (
              <tr
                key={b._id}
                className="border-b border-border transition last:border-0 hover:bg-accent"
              >
                <td className="px-2.5 py-2.5 text-[11.5px] font-medium text-foreground">
                  {b.travelerName || "Anonymous"}
                </td>
                <td className="px-2.5 py-2.5 text-[11.5px] text-secondary-foreground">
                  <div className="max-w-[150px] truncate">{b.tourPlanId?.title || "Custom Package"}</div>
                </td>
                <td className="px-2.5 py-2.5 text-[11.5px] text-secondary-foreground">
                  {b.travelerPhone}
                </td>
                <td className="px-2.5 py-2.5 text-[11.5px] text-secondary-foreground">
                  {b.tripDate ? new Date(b.tripDate).toLocaleDateString() : "N/A"}
                </td>
                <td className="px-2.5 py-2.5">
                  <span
                    className={`rounded-full px-2.5 py-[3px] text-[10px] font-semibold capitalize ${statusCls[b.status]}`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="px-2.5 py-2.5">
                  {b.status === 'confirmed' && (
                    <button
                      onClick={() => {
                        if (window.confirm("Cancel this booking?")) cancelMutation.mutate(b._id)
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card text-destructive hover:bg-accent"
                      title="Cancel booking"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
