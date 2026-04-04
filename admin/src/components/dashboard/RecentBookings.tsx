import { Search, ArrowUpDown, Loader2, Check } from "lucide-react"
import { useState, useEffect } from "react"
import api from "@/lib/axios"

interface Booking {
  _id: string
  requesterName?: string
  requesterPhone: string
  tourPlanId?: {
    _id: string
    title: string
  }
  status: 'pending' | 'contacted'
  createdAt: string
}

const statusCls: Record<string, string> = {
  pending: "bg-[#FFF8E5] text-[#E5A100] border border-[#FFE7A0]",
  contacted: "bg-[#E3F7EC] text-[#22B357] border border-[#C9EFDA]",
}

export function RecentBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchBookings = async () => {
    try {
      const res = await api.get("/api/callbacks/mine")
      setBookings(res.data)
    } catch (err) {
      console.error("Failed to fetch bookings", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleMarkAsContacted = async (id: string) => {
    try {
      await api.patch(`/api/callbacks/${id}/read`)
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'contacted' } : b))
    } catch (err) {
      alert("Failed to update status")
    }
  }

  const filteredBookings = bookings.filter(b => 
    b.requesterName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.requesterPhone.includes(searchQuery) ||
    b.tourPlanId?.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="rounded-[14px] border border-[#E4EAF1] bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-[#1A2B3D]">
          Recent Callback Requests
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-[8px] border border-[#E4EAF1] px-2 py-[5px]">
            <Search className="h-[13px] w-[13px] text-[#8896A6]" />
            <input
              placeholder="Search bookings"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[100px] border-none bg-transparent text-[11px] placeholder-[#8896A6] outline-none"
            />
          </div>
          <button className="rounded-[8px] bg-[#2E7CF6] px-3 py-[5px] text-[11px] font-medium text-white transition hover:bg-[#1B5FCC]">
            View All
          </button>
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-[#E4EAF1]">
            {["Name", "Package", "Phone", "Date", "Status", "Actions"].map(
              (h) => (
                <th
                  key={h}
                  className="px-2.5 py-2 text-left text-[11px] font-medium text-[#8896A6]"
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
                <Loader2 className="mx-auto h-5 w-5 animate-spin text-[#2E7CF6]" />
              </td>
            </tr>
          ) : filteredBookings.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-10 text-center text-[12px] text-slate-500">
                No recent callback requests.
              </td>
            </tr>
          ) : (
            filteredBookings.slice(0, 8).map((b) => (
              <tr
                key={b._id}
                className="border-b border-[#F0F4F8] transition last:border-0 hover:bg-[#F5F7FA]"
              >
                <td className="px-2.5 py-2.5 text-[11.5px] font-medium text-[#1A2B3D]">
                  {b.requesterName || "Anonymous"}
                </td>
                <td className="px-2.5 py-2.5 text-[11.5px] text-[#5A6E82]">
                  <div className="max-w-[150px] truncate">{b.tourPlanId?.title || "Unknown Package"}</div>
                </td>
                <td className="px-2.5 py-2.5 text-[11.5px] text-[#5A6E82]">
                  {b.requesterPhone}
                </td>
                <td className="px-2.5 py-2.5 text-[11.5px] text-[#5A6E82]">
                  {new Date(b.createdAt).toLocaleDateString()}
                </td>
                <td className="px-2.5 py-2.5">
                  <span
                    className={`rounded-full px-2.5 py-[3px] text-[10px] font-semibold capitalize ${statusCls[b.status]}`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="px-2.5 py-2.5">
                  {b.status === 'pending' && (
                    <button 
                      onClick={() => handleMarkAsContacted(b._id)}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-[#E4EAF1] bg-white text-[#2E7CF6] hover:bg-slate-50"
                      title="Mark as contacted"
                    >
                      <Check className="h-3.5 w-3.5" />
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
