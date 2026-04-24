import { useEffect, useState } from "react"
import api from "@/lib/axios"
import { Check, X, Clock, CheckCircle2, XCircle } from "lucide-react"

export default function Travelers() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/api/callbacks/mine')
      setRequests(data)
    } catch (error) {
      console.error("Error fetching travelers/requests:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const updateStatus = async (id: string, status: 'positive' | 'negative') => {
    try {
      await api.patch(`/api/callbacks/${id}/status`, { status })
      setRequests(requests.map(req => req._id === id ? { ...req, status } : req))
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  return (
    <div className="flex flex-col gap-6 pt-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Traveler Requests</h1>
          <p className="text-sm text-muted-foreground">Manage callback and booking requests from travelers.</p>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted bg-muted/20">
                <th className="h-12 px-4 text-left align-middle font-semibold text-muted-foreground">Date</th>
                <th className="h-12 px-4 text-left align-middle font-semibold text-muted-foreground">Traveler</th>
                <th className="h-12 px-4 text-left align-middle font-semibold text-muted-foreground">Email ID</th>
                <th className="h-12 px-4 text-left align-middle font-semibold text-muted-foreground">Tour Plan</th>
                <th className="h-12 px-4 text-left align-middle font-semibold text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-center align-middle font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {loading ? (
                <tr>
                  <td colSpan={6} className="h-24 text-center">Loading...</td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="h-24 text-center text-muted-foreground">No requests found.</td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req._id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 align-middle font-medium">
                      {req.requesterName || "Anonymous"}
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">
                      {req.requesterEmail || "N/A"}
                    </td>
                    <td className="p-4 align-middle max-w-[200px] truncate" title={req.tourPlanId?.title}>
                      {req.tourPlanId?.title || "Unknown Plan"}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        {req.status === 'pending' && <span className="inline-flex items-center gap-1.5 text-yellow-700 bg-yellow-50 border border-yellow-200 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm"><Clock size={14} /> Pending</span>}
                        {req.status === 'positive' && <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm"><CheckCircle2 size={14} /> Interested</span>}
                        {req.status === 'negative' && <span className="inline-flex items-center gap-1.5 text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm"><XCircle size={14} /> Not Interested</span>}
                        {req.status === 'contacted' && <span className="inline-flex items-center gap-1.5 text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm"><CheckCircle2 size={14} /> Contacted</span>}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          onClick={() => updateStatus(req._id, 'positive')}
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                          title="Mark as Interested"
                        >
                          <Check size={18} strokeWidth={3} />
                        </button>
                        <button 
                          onClick={() => updateStatus(req._id, 'negative')}
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-100 text-rose-600 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                          title="Mark as Not Interested"
                        >
                          <X size={18} strokeWidth={3} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
