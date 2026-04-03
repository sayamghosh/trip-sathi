import { useEffect, useMemo, useState } from "react"
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ImageIcon,
  Loader2,
  MapPin,
  Users,
  XCircle,
} from "lucide-react"
import { Link, useParams } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"
import api from "@/lib/axios"

type Activity = {
  type: string
  title: string
  description?: string
  images?: string[]
}

type DayPlan = {
  dayNumber: number
  title: string
  activities?: Activity[]
}

type TourPlan = {
  _id: string
  title: string
  description: string
  basePrice: number
  durationDays: number
  durationNights: number
  locations: string[]
  bannerImages?: string[]
  days: DayPlan[]
  createdAt?: string
}

const fallbackPhotos = [
  "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1518562923427-19e694fbd8e9?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=600",
]

const defaultIncludes = [
  "Premium accommodation",
  "Daily breakfast and dinner",
  "Guided sightseeing tours",
  "All group transfers",
  "Expert local tour manager",
  "Signature cultural experiences",
  "Airport/Station transfers",
  "24/7 travel assistance",
]

const defaultExcludes = [
  "Airfare or Rail tickets",
  "Personal expenses (shopping, laundry)",
  "Entrance fees to monuments",
  "Optional activities/adventure sports",
  "GST and other taxes",
  "Travel Insurance",
]

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)

const addDays = (date: Date, days: number) => {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export default function PackageDetailPage() {
  const { packageId } = useParams({ strict: false }) as any
  const [plan, setPlan] = useState<TourPlan | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlan = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/api/tour-plans/${packageId}`)
        setPlan(res.data)
      } catch (error) {
        console.error("Failed to fetch package details", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlan()
  }, [packageId])

  const photos = useMemo(() => {
    if (plan?.bannerImages?.length) {
      return [...plan.bannerImages, ...fallbackPhotos].slice(0, 5)
    }
    return fallbackPhotos
  }, [plan?.bannerImages])

  const sortedDays = useMemo(
    () => [...(plan?.days || [])].sort((a, b) => a.dayNumber - b.dayNumber),
    [plan?.days],
  )

  const startDate = plan?.createdAt ? new Date(plan.createdAt) : null
  const durationDays = plan?.durationDays ?? 0
  
  // Rule: Nights is always 1 less than Days in this app's context
  const durationNights = Math.max(durationDays - 1, 0)
  
  const endDate =
    startDate && durationDays
      ? addDays(startDate, Math.max(durationDays - 1, 0))
      : null

  const formattedPrice = plan?.basePrice?.toLocaleString?.() || "—"

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center rounded-2xl border border-dashed bg-white/60">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-6 w-6 animate-spin text-[#2E7CF6]" />
          <span>Loading package details…</span>
        </div>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-700">
        Unable to find this package. It might have been removed or is unavailable.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to="/packages" className="flex items-center gap-2 text-sm font-semibold text-[#1A2B3D] hover:text-[#2E7CF6]">
            <ArrowLeft className="h-4 w-4" />
            Back to Packages List
          </Link>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[12px] font-semibold text-slate-700">
            Package Details
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={async () => {
              if (window.confirm("Are you sure you want to delete this package?")) {
                try {
                  await api.delete(`/api/tour-plans/${plan._id}`)
                  alert("Package deleted successfully")
                  window.location.href = "/packages"
                } catch (e) {
                  alert("Failed to delete package")
                }
              }
            }}
            variant="outline" 
            className="border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 h-9"
          >
            Delete
          </Button>
          <Button variant="outline" className="border-[#E4EAF1] text-[#1A2B3D] h-9">Duplicate</Button>
          <Link to="/plans/edit/$packageId" params={{ packageId: plan._id }}>
            <Button className="bg-[#2E7CF6] text-white shadow-sm hover:bg-[#2569d9] h-9">Edit Data</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <div className="rounded-[16px] border border-[#E4EAF1] bg-white p-5 shadow-[0_12px_30px_-24px_rgba(26,43,61,0.15)]">
            <div className="grid gap-3 md:grid-cols-3">
              <div
                className="md:col-span-2 h-56 rounded-[14px] bg-cover bg-center"
                style={{ backgroundImage: `url(${photos[0]})` }}
              />
              <div className="grid grid-cols-2 gap-3">
                {photos.slice(1, 5).map((img, idx) => (
                  <div
                    key={idx}
                    className="h-24 rounded-[12px] bg-cover bg-center"
                    style={{ backgroundImage: `url(${img})` }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3 text-sm text-[#5A6E82]">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-[#2E7CF6]" />
                    {plan.locations?.[0] || "Destination"}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4 text-[#2E7CF6]" />
                    {durationDays} Days / {durationNights} Nights
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-[#2E7CF6]" />
                    {sortedDays.length} planned days
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-[#1A2B3D]">{plan.title || "Package"}</h2>
                <p className="max-w-4xl text-sm leading-relaxed text-[#5A6E82]">
                  {plan.description ||
                    "Discover a thoughtfully crafted itinerary designed to balance signature experiences, relaxation, and authentic cultural immersion."}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs uppercase text-[#5A6E82]">From</p>
                <p className="text-3xl font-bold text-[#2E7CF6]">₹{formattedPrice}</p>
                <p className="text-xs text-[#5A6E82]">per person</p>
              </div>
            </div>
          </div>

            <div className="rounded-[16px] border border-[#E4EAF1] bg-white p-5 shadow-[0_12px_30px_-24px_rgba(26,43,61,0.15)] space-y-4">
              <div>
                <h3 className="text-[15px] font-semibold text-[#1A2B3D]">Trip Schedule</h3>
                <div className="mt-2 flex items-center gap-2 text-sm text-[#5A6E82]">
                  <CalendarDays className="h-4 w-4 text-[#2E7CF6]" />
                  {startDate && endDate ? (
                    <span>
                      {formatDate(startDate)} — {formatDate(endDate)}
                    </span>
                  ) : (
                    <span>Dates will be confirmed after publishing</span>
                  )}
                </div>
              </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[12px] border border-[#E4EAF1] bg-[#F7FAFD] p-4">
                <h4 className="mb-3 text-sm font-semibold text-[#1A2B3D]">Includes</h4>
                <div className="space-y-2 text-sm text-[#1A2B3D]">
                  {defaultIncludes.map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-[2px] h-4 w-4 text-[#2E7CF6]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[12px] border border-[#E4EAF1] bg-[#FFF8F6] p-4">
                <h4 className="mb-3 text-sm font-semibold text-[#1A2B3D]">Excludes</h4>
                <div className="space-y-2 text-sm text-[#1A2B3D]">
                  {defaultExcludes.map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <XCircle className="mt-[2px] h-4 w-4 text-[#F15B2A]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-[16px] border border-[#E4EAF1] bg-white p-4 shadow-[0_12px_30px_-24px_rgba(26,43,61,0.15)]">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-[15px] font-semibold text-[#1A2B3D]">Travel Plans</h4>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[12px] font-semibold text-slate-700">
                {sortedDays.length} days
              </span>
            </div>

            <div className="space-y-3">
              {sortedDays.length ? (
                sortedDays.map((day) => (
                  <div key={day.dayNumber} className="flex gap-3 rounded-[12px] border border-[#E4EAF1] bg-[#F9FBFD] p-3">
                    <div className="flex flex-col items-center gap-1">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-semibold text-[#1A2B3D] shadow-sm">
                        {day.dayNumber}
                      </span>
                      {startDate && (
                        <span className="text-[11px] font-medium text-[#5A6E82]">
                          {formatDate(addDays(startDate, day.dayNumber - 1))}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-[#1A2B3D]">{day.title}</p>
                      </div>
                      <div className="space-y-1 text-[13px] text-[#5A6E82]">
                        {day.activities && day.activities.length ? (
                          day.activities.map((activity, idx) => (
                            <div key={idx} className="flex gap-2">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#2E7CF6]" />
                              <span className="leading-snug">
                                {activity.title}
                                {activity.description ? ` — ${activity.description}` : ""}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center gap-2 text-[13px] text-slate-500">
                            <ImageIcon className="h-4 w-4" />
                            No activities added for this day yet.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2 rounded-lg border border-dashed border-[#E4EAF1] bg-slate-50 px-3 py-4 text-[13px] text-slate-600">
                  <ImageIcon className="h-4 w-4 text-[#2E7CF6]" />
                  Add an itinerary to show day-by-day highlights.
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
