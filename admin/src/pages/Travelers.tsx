import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"
import { Check, X, Clock, CheckCircle2, XCircle } from "lucide-react"
import { CreateBookingModal, type GuideTourPlan, type BookingPrefill } from "@/components/booking/CreateBookingModal"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type CallbackStatus = 'pending' | 'positive' | 'negative' | 'contacted'

interface CallbackRequest {
  _id: string
  createdAt?: string
  requesterName?: string
  requesterEmail?: string
  requesterPhone?: string
  status: CallbackStatus
  tourPlanId?: {
    _id?: string
    title?: string
    basePrice?: number
  }
}

export default function Travelers() {
  const queryClient = useQueryClient()
  const [bookingModal, setBookingModal] = useState<{ open: boolean; prefill?: BookingPrefill }>({ open: false })

  const { data: requests = [], isLoading: loading } = useQuery<CallbackRequest[]>({
    queryKey: ['callbacks'],
    queryFn: async () => {
      const { data } = await api.get('/api/callbacks/mine')
      return data as CallbackRequest[]
    }
  })

  const { data: tourPlans = [] } = useQuery<GuideTourPlan[]>({
    queryKey: ['tour-plans', 'mine'],
    queryFn: async () => {
      const { data } = await api.get('/api/tour-plans')
      return data as GuideTourPlan[]
    }
  })

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: 'negative' }) => {
      await api.patch(`/api/callbacks/${id}/status`, { status })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callbacks'] })
    },
    onError: (error) => {
      console.error("Error updating status:", error)
    }
  })

  const markNotInterested = (id: string) => {
    updateStatusMutation.mutate({ id, status: 'negative' })
  }

  const markInterested = (req: CallbackRequest) => {
    setBookingModal({
      open: true,
      prefill: {
        callbackRequestId: req._id,
        tourPlanId: req.tourPlanId?._id,
        travelerName: req.requesterName,
        travelerEmail: req.requesterEmail,
        travelerPhone: req.requesterPhone,
      },
    })
  }

  return (
    <div className="flex flex-col gap-6 pt-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Traveler Requests</h1>
          <p className="text-sm text-muted-foreground">Manage callback and booking requests from travelers.</p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/20">
              <TableHead>Date</TableHead>
              <TableHead>Traveler</TableHead>
              <TableHead>Email ID</TableHead>
              <TableHead>Tour Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">Loading...</TableCell>
              </TableRow>
            ) : requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">No requests found.</TableCell>
              </TableRow>
            ) : (
              requests.map((req) => (
                <TableRow key={req._id}>
                  <TableCell>
                    {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell className="font-medium">
                    {req.requesterName || "Anonymous"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {req.requesterEmail || "N/A"}
                  </TableCell>
                  <TableCell className="max-w-52 truncate" title={req.tourPlanId?.title}>
                    {req.tourPlanId?.title || "Unknown Plan"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {req.status === 'pending' && (
                        <Badge variant="outline" className="gap-1.5 border-warning/30 bg-warning/10 text-warning">
                          <Clock className="size-3.5" /> Pending
                        </Badge>
                      )}
                      {req.status === 'positive' && (
                        <Badge variant="outline" className="gap-1.5 border-success/30 bg-success/10 text-success">
                          <CheckCircle2 className="size-3.5" /> Interested
                        </Badge>
                      )}
                      {req.status === 'negative' && (
                        <Badge variant="outline" className="gap-1.5 border-destructive/30 bg-destructive/10 text-destructive">
                          <XCircle className="size-3.5" /> Not Interested
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => markInterested(req)}
                        className="size-8 rounded-full border-success/30 bg-success/10 text-success hover:bg-success hover:text-success-foreground"
                        title="Mark as Interested"
                      >
                        <Check className="size-4" strokeWidth={3} />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => markNotInterested(req._id)}
                        disabled={updateStatusMutation.isPending}
                        className="size-8 rounded-full border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        title="Mark as Not Interested"
                      >
                        <X className="size-4" strokeWidth={3} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <CreateBookingModal
        open={bookingModal.open}
        onOpenChange={(open) => setBookingModal(s => ({ ...s, open }))}
        guideTourPlans={tourPlans}
        prefill={bookingModal.prefill}
      />
    </div>
  )
}
