import { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

type PaymentStatus = "unpaid" | "advance_paid" | "fully_paid"

export interface GuideTourPlan {
  _id: string
  title: string
  basePrice: number
}

export interface BookingPrefill {
  callbackRequestId?: string
  tourPlanId?: string
  travelerName?: string
  travelerEmail?: string
  travelerPhone?: string
}

interface CreateBookingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  guideTourPlans: GuideTourPlan[]
  prefill?: BookingPrefill
}

interface FormState {
  travelerName: string
  travelerEmail: string
  travelerPhone: string
  travelerAddress: string
  governmentIdNumber: string
  tripDate: string
  tourPlanId: string
  finalPrice: string
  numberOfTravelers: string
  paymentStatus: PaymentStatus
  advanceAmount: string
}

const emptyForm: FormState = {
  travelerName: "",
  travelerEmail: "",
  travelerPhone: "",
  travelerAddress: "",
  governmentIdNumber: "",
  tripDate: "",
  tourPlanId: "",
  finalPrice: "",
  numberOfTravelers: "1",
  paymentStatus: "unpaid",
  advanceAmount: "",
}

// Bigger, more legible field sizing than the app's default compact inputs -
// this form is filled in by guides on the phone with a traveler, often
// glancing between screen and call, so err on the side of larger text.
const FIELD_INPUT_CLASS = "h-11 text-base md:text-base px-3.5"
const FIELD_LABEL_CLASS = "text-base font-semibold"

export function CreateBookingModal({ open, onOpenChange, guideTourPlans, prefill }: CreateBookingModalProps) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<FormState>(emptyForm)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    const tourPlanId = prefill?.tourPlanId || guideTourPlans[0]?._id || ""
    const plan = guideTourPlans.find(p => p._id === tourPlanId)
    setForm({
      ...emptyForm,
      travelerName: prefill?.travelerName || "",
      travelerEmail: prefill?.travelerEmail || "",
      travelerPhone: prefill?.travelerPhone || "",
      tourPlanId,
      finalPrice: plan ? String(plan.basePrice) : "",
    })
    setError(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, prefill])

  const createMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        callbackRequestId: prefill?.callbackRequestId,
        tourPlanId: form.tourPlanId,
        travelerName: form.travelerName.trim(),
        travelerEmail: form.travelerEmail.trim() || undefined,
        travelerPhone: form.travelerPhone.trim(),
        travelerAddress: form.travelerAddress.trim() || undefined,
        governmentIdNumber: form.governmentIdNumber.trim() || undefined,
        tripDate: form.tripDate,
        numberOfTravelers: Number(form.numberOfTravelers) || 1,
        finalPrice: Number(form.finalPrice),
        paymentStatus: form.paymentStatus,
        advanceAmount: form.paymentStatus === "advance_paid" ? Number(form.advanceAmount) : undefined,
      }
      await api.post("/api/bookings", payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
      queryClient.invalidateQueries({ queryKey: ["callbacks"] })
      onOpenChange(false)
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || "Failed to create booking")
    },
  })

  const handleChange = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleTourPlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tourPlanId = e.target.value
    const plan = guideTourPlans.find(p => p._id === tourPlanId)
    setForm(prev => ({ ...prev, tourPlanId, finalPrice: plan ? String(plan.basePrice) : prev.finalPrice }))
  }

  const validate = (): string | null => {
    if (!form.travelerName.trim()) return "Traveler name is required"
    if (!form.travelerPhone.trim()) return "Traveler phone is required"
    if (!form.tourPlanId) return "Please select a package"
    if (!form.tripDate) return "Trip date is required"
    const price = Number(form.finalPrice)
    if (!form.finalPrice || Number.isNaN(price) || price <= 0) return "Final price must be greater than 0"
    const participants = Number(form.numberOfTravelers)
    if (!participants || participants < 1) return "Number of travelers must be at least 1"
    if (form.paymentStatus === "advance_paid") {
      const advance = Number(form.advanceAmount)
      if (!form.advanceAmount || Number.isNaN(advance) || advance <= 0) return "Advance amount is required"
      if (advance > price) return "Advance amount cannot exceed final price"
    }
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setError(null)
    createMutation.mutate()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Booking</DialogTitle>
          <DialogDescription>
            Confirm traveler details and negotiated price to create a booking.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 pb-2">
          <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-3">
            <div className="md:col-span-3 flex flex-col gap-2">
              <Label htmlFor="travelerName" className={FIELD_LABEL_CLASS}>Traveler Name *</Label>
              <Input id="travelerName" className={FIELD_INPUT_CLASS} value={form.travelerName} onChange={handleChange("travelerName")} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="travelerPhone" className={FIELD_LABEL_CLASS}>Phone *</Label>
              <Input id="travelerPhone" className={FIELD_INPUT_CLASS} value={form.travelerPhone} onChange={handleChange("travelerPhone")} required />
            </div>
            <div className="md:col-span-2 flex flex-col gap-2">
              <Label htmlFor="travelerEmail" className={FIELD_LABEL_CLASS}>Email</Label>
              <Input id="travelerEmail" type="email" className={FIELD_INPUT_CLASS} value={form.travelerEmail} onChange={handleChange("travelerEmail")} />
            </div>
            <div className="md:col-span-2 flex flex-col gap-2">
              <Label htmlFor="travelerAddress" className={FIELD_LABEL_CLASS}>Address</Label>
              <Input id="travelerAddress" className={FIELD_INPUT_CLASS} value={form.travelerAddress} onChange={handleChange("travelerAddress")} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="governmentIdNumber" className={FIELD_LABEL_CLASS}>Government ID Number</Label>
              <Input id="governmentIdNumber" className={FIELD_INPUT_CLASS} value={form.governmentIdNumber} onChange={handleChange("governmentIdNumber")} />
            </div>

            <Separator className="md:col-span-3 my-1" />

            <div className="md:col-span-2 flex flex-col gap-2">
              <Label htmlFor="tourPlanId" className={FIELD_LABEL_CLASS}>Package *</Label>
              <Select id="tourPlanId" className={FIELD_INPUT_CLASS} value={form.tourPlanId} onChange={handleTourPlanChange} required>
                <option value="" disabled>Select a package</option>
                {guideTourPlans.map(plan => (
                  <option key={plan._id} value={plan._id}>{plan.title}</option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="tripDate" className={FIELD_LABEL_CLASS}>Trip Date *</Label>
              <Input id="tripDate" type="date" className={FIELD_INPUT_CLASS} value={form.tripDate} onChange={handleChange("tripDate")} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="numberOfTravelers" className={FIELD_LABEL_CLASS}>Number of Travelers</Label>
              <Input id="numberOfTravelers" type="number" min={1} className={FIELD_INPUT_CLASS} value={form.numberOfTravelers} onChange={handleChange("numberOfTravelers")} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="finalPrice" className={FIELD_LABEL_CLASS}>Final Price (₹) *</Label>
              <Input id="finalPrice" type="number" min={0} className={FIELD_INPUT_CLASS} value={form.finalPrice} onChange={handleChange("finalPrice")} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="paymentStatus" className={FIELD_LABEL_CLASS}>Payment Status</Label>
              <Select id="paymentStatus" className={FIELD_INPUT_CLASS} value={form.paymentStatus} onChange={handleChange("paymentStatus")}>
                <option value="unpaid">Unpaid</option>
                <option value="advance_paid">Advance Paid</option>
                <option value="fully_paid">Fully Paid</option>
              </Select>
            </div>
            {form.paymentStatus === "advance_paid" && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="advanceAmount" className={FIELD_LABEL_CLASS}>Advance Amount (₹) *</Label>
                <Input id="advanceAmount" type="number" min={0} className={FIELD_INPUT_CLASS} value={form.advanceAmount} onChange={handleChange("advanceAmount")} required />
              </div>
            )}
          </div>

          {error && <p className="text-base font-medium text-destructive">{error}</p>}

          <DialogFooter className="px-0 pt-2">
            <Button type="button" variant="outline" size="lg" className="text-base" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="lg" className="text-base" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create Booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
