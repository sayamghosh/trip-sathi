import { Search, ArrowUpDown, Loader2, XCircle } from "lucide-react"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"

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
  confirmed: "border-success/30 bg-success/10 text-success",
  cancelled: "border-destructive/30 bg-destructive/10 text-destructive",
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
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-semibold">Recent Bookings</CardTitle>
        <div className="relative w-40">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search bookings"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-7 text-xs"
          />
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {["Name", "Package", "Phone", "Trip Date", "Status", "Actions"].map(
                (h) => (
                  <TableHead key={h}>
                    <span className="flex items-center gap-1 text-xs">
                      {h}
                      <ArrowUpDown className="h-2.5 w-2.5" />
                    </span>
                  </TableHead>
                )
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-primary" />
                </TableCell>
              </TableRow>
            ) : filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-xs text-muted-foreground">
                  No recent bookings.
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.slice(0, 8).map((b) => (
                <TableRow key={b._id}>
                  <TableCell className="text-xs font-medium text-foreground">
                    {b.travelerName || "Anonymous"}
                  </TableCell>
                  <TableCell className="text-xs text-secondary-foreground">
                    <div className="max-w-40 truncate">{b.tourPlanId?.title || "Custom Package"}</div>
                  </TableCell>
                  <TableCell className="text-xs text-secondary-foreground">
                    {b.travelerPhone}
                  </TableCell>
                  <TableCell className="text-xs text-secondary-foreground">
                    {b.tripDate ? new Date(b.tripDate).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`capitalize ${statusCls[b.status]}`}>
                      {b.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {b.status === 'confirmed' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:bg-accent hover:text-destructive"
                        title="Cancel booking"
                        onClick={() => {
                          if (window.confirm("Cancel this booking?")) cancelMutation.mutate(b._id)
                        }}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
