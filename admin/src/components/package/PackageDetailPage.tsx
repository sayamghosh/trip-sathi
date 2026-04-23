import { useEffect, useMemo, useState } from "react"
import {
  ArrowLeft,
  CalendarDays,
  ImageIcon,
  Loader2,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
} from "lucide-react"
import { Link, useParams } from "@tanstack/react-router"
import { cn } from "@/lib/utils"

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
  includes?: string[]
  excludes?: string[]
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

const formatDate = (date: Date) => {
  const day = date.getDate()
  const month = date.toLocaleString("en-US", { month: "short" })
  const year = date.getFullYear().toString().slice(-2)
  return `${day} ${month} ${year}`
}

const addDays = (date: Date, days: number) => {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export default function PackageDetailPage() {
  const { packageId } = useParams({ strict: false }) as any
  const [plan, setPlan] = useState<TourPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedDay, setExpandedDay] = useState<number | null>(1)

  const [lightbox, setLightbox] = useState<{
    open: boolean
    index: number
    images: string[]
  }>({
    open: false,
    index: 0,
    images: [],
  })

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

  const startDate = plan?.createdAt ? new Date(plan.createdAt) : new Date()
  const durationDays = plan?.durationDays ?? 0
  const durationNights = Math.max(durationDays - 1, 0)
  
  const formattedPrice = plan?.basePrice?.toLocaleString?.() || "—"

  const openLightbox = (images: string[], index: number) => {
    setLightbox({ open: true, index, images })
  }

  const closeLightbox = () => setLightbox(prev => ({ ...prev, open: false }))
  
  const nextImg = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setLightbox(prev => ({ 
      ...prev, 
      index: (prev.index + 1) % prev.images.length 
    }))
  }

  const prevImg = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setLightbox(prev => ({ 
      ...prev, 
      index: (prev.index - 1 + prev.images.length) % prev.images.length 
    }))
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightbox.open) return
      if (e.key === "ArrowRight") nextImg()
      if (e.key === "ArrowLeft") prevImg()
      if (e.key === "Escape") closeLightbox()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [lightbox.open, lightbox.images.length])

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 backdrop-blur-sm">
        <div className="flex items-center gap-3 text-secondary-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
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
    <div className="space-y-6 pb-12 relative">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-3">
          <Link to="/packages" className="flex items-center gap-2 text-[14px] font-semibold text-foreground hover:text-primary transition">
            <ArrowLeft className="h-4 w-4" />
            Back to Packages List
          </Link>
          <div className="h-4 w-px bg-border" />
          <span className="text-[13px] font-bold text-foreground/50">
            Package Details
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={async () => {
              if (window.confirm("Are you sure you want to delete this package?")) {
                try {
                  await api.delete(`/api/tour-plans/${plan._id}`)
                  window.location.href = "/packages"
                } catch (e) {
                  alert("Failed to delete package")
                }
              }
            }}
            variant="outline" 
            className="border-destructive/20 text-destructive hover:bg-destructive/10 h-9 rounded-lg text-[13px] font-bold"
          >
            Delete
          </Button>
          <Button variant="outline" className="border-border text-foreground h-9 rounded-lg text-[13px] font-bold">Duplicate</Button>
          <Link to="/packages/$packageId/edit" params={{ packageId: plan._id }}>
            <Button className="bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 h-9 rounded-lg text-[13px] font-bold px-6">Edit Data</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_440px]">
        {/* Main Content */}
        <div className="space-y-8">
          {/* Gallery Grid */}
          <div className="grid grid-cols-12 grid-rows-2 gap-4 h-96">
            <div 
              className="col-span-8 row-span-2 rounded-[20px] bg-cover bg-center shadow-sm cursor-pointer transform transition hover:brightness-110 active:scale-[0.99]"
              style={{ backgroundImage: `url(${photos[0]})` }}
              onClick={() => openLightbox(photos, 0)}
            />
            <div 
              className="col-span-4 row-span-1 rounded-[20px] bg-cover bg-center shadow-sm cursor-pointer transform transition hover:brightness-110 active:scale-[0.99]"
              style={{ backgroundImage: `url(${photos[1]})` }}
              onClick={() => openLightbox(photos, 1)}
            />
            <div 
              className="col-span-2 row-span-1 rounded-[20px] bg-cover bg-center shadow-sm cursor-pointer transform transition hover:brightness-110 active:scale-[0.99]"
              style={{ backgroundImage: `url(${photos[2]})` }}
              onClick={() => openLightbox(photos, 2)}
            />
            <div 
              className="col-span-2 row-span-1 rounded-[20px] bg-cover bg-center shadow-sm cursor-pointer transform transition hover:brightness-110 active:scale-[0.99]"
              style={{ backgroundImage: `url(${photos[3]})` }}
              onClick={() => openLightbox(photos, 3)}
            />
          </div>

          <div className="space-y-8 px-1">
            {/* Header: Title & Price */}
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <h1 className="text-[32px] font-extrabold text-foreground tracking-tight">{plan.title || "Safari Adventure"}</h1>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2 text-[14px] font-semibold text-foreground/70">
                    <MapPin className="h-[15px] w-[15px] text-primary" />
                    <span>{plan.locations?.[0] || "Serengeti, Tanzania"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[14px] font-semibold text-foreground/70">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 2v10l4.2 4.2"/><circle cx="12" cy="12" r="10"/></svg>
                    <span>{durationDays} Days / {durationNights} Nights</span>
                  </div>
                  <div className="flex items-center gap-2 text-[14px] font-semibold text-foreground/70">
                    <Users className="h-[15px] w-[15px] text-primary" />
                    <span>15 participants</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[32px] font-extrabold text-primary">₹{formattedPrice}</div>
                <div className="text-[14px] font-medium text-muted-foreground">per person</div>
              </div>
            </div>

            {/* About Section */}
            <div className="space-y-3">
              <h3 className="text-[13px] font-bold text-foreground/40 uppercase tracking-wider">About</h3>
              <p className="text-[15.5px] leading-[1.7] text-foreground/90 font-medium">
                {plan.description || "Experience the thrill of a lifetime with our Safari Adventure package. Traverse the Serengeti and witness the majestic wildlife in their natural habitat. This all-inclusive safari offers luxurious accommodations, expert-guided tours, and unforgettable experiences."}
              </p>
            </div>

            {/* Trip Schedule */}
            <div className="space-y-3">
              <h3 className="text-[13px] font-bold text-foreground/40 uppercase tracking-wider">Trip Schedule</h3>
              <div className="flex items-center gap-3 text-[14px] font-bold text-foreground">
                <CalendarDays className="h-4 w-4 text-primary" />
                <span>{formatDate(startDate)} — {formatDate(addDays(startDate, durationDays - 1))}</span>
              </div>
            </div>

            <div className="h-px bg-border w-full" />

            {/* Includes / Excludes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Includes */}
              <div className="space-y-6">
                <h3 className="text-[12px] font-bold text-foreground/40 uppercase tracking-widest">Includes</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  {plan.includes?.length ? plan.includes.map((item: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-accent flex items-center justify-center shrink-0 mt-0.5">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <span className="text-[14px] font-medium text-foreground leading-tight">{item}</span>
                    </div>
                  )) : defaultIncludes.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-accent flex items-center justify-center shrink-0 mt-0.5">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <span className="text-[14px] font-medium text-foreground leading-tight">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Excludes */}
              <div className="space-y-6 flex flex-col">
                <div className="h-full border-l border-border pl-12">
                  <h3 className="text-[12px] font-bold text-foreground/40 uppercase tracking-widest mb-6">Excludes</h3>
                  <div className="space-y-4">
                    {plan.excludes?.length ? plan.excludes.map((item: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </div>
                        <span className="text-[14px] font-medium text-foreground leading-tight">{item}</span>
                      </div>
                    )) : defaultExcludes.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </div>
                        <span className="text-[14px] font-medium text-foreground leading-tight">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Travel Plans */}
        <aside className="lg:block">
          <div className="rounded-[24px] border border-border bg-card/30 backdrop-blur-xl p-6 sticky top-6 shadow-2xl shadow-black/20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[20px] font-extrabold text-foreground tracking-tight">Travel Plans</h2>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CalendarDays className="h-4 w-4" />
              </div>
            </div>
            
            <div className="space-y-0 relative">
              {/* Vertical line connecting circles with gradient */}
              <div className="absolute left-[39px] top-6 bottom-6 w-[2px] bg-linear-to-b from-primary/50 via-border to-transparent z-0" />
              
              {sortedDays.length ? sortedDays.map((day: DayPlan) => {
                const isExpanded = expandedDay === day.dayNumber
                
                return (
                  <div key={day.dayNumber} className="relative flex gap-5 pb-6 last:pb-0 group/day">
                    {/* Left Column: Day & Date */}
                    <div className="w-10 shrink-0 flex flex-col items-center pt-1 z-10 transition-transform group-hover/day:scale-105">
                      <div 
                        onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
                        className={cn(
                          "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[12px] font-bold shadow-lg ring-4 ring-background transition-all duration-300",
                          isExpanded 
                            ? "bg-primary text-white shadow-primary/30" 
                            : "bg-muted text-muted-foreground shadow-black/10"
                        )}
                      >
                        {day.dayNumber}
                      </div>
                    </div>
   
                    {/* Right Column: Info */}
                    <div className="flex-1 space-y-4">
                      <div 
                        className="flex items-center justify-between cursor-pointer group/header"
                        onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
                      >
                        <div className="flex flex-col gap-0.5">
                          <h4 className={cn(
                            "text-[16px] font-extrabold leading-tight tracking-tight transition-colors",
                            isExpanded ? "text-foreground" : "text-foreground/60 group-hover/header:text-foreground"
                          )}>
                            {day.title}
                          </h4>
                          <p className="text-[11px] font-bold text-primary uppercase tracking-widest leading-none mt-1 opacity-80">
                            {formatDate(addDays(startDate, day.dayNumber - 1))}
                          </p>
                        </div>
                        <ChevronDown className={cn(
                          "h-5 w-5 text-muted-foreground transition-transform duration-300 ease-in-out",
                          isExpanded && "rotate-180 text-primary"
                        )} />
                      </div>

                      <div className={cn(
                        "space-y-4 grid transition-all duration-500 ease-in-out",
                        isExpanded ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 overflow-hidden mt-0"
                      )}>
                        <div className="overflow-hidden space-y-3">
                          {day.activities?.map((act: Activity, i: number) => (
                            <div key={i} className="group/card relative rounded-2xl border border-border/50 bg-card/50 p-3 self-start transition-all hover:border-primary/30 hover:bg-card hover:shadow-md">
                              <div className="flex items-start gap-4">
                                <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/20">
                                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                </div>
                                <div className="space-y-2 flex-1">
                                  <p className="text-[13px] font-bold text-foreground leading-snug">
                                    {act.title}
                                  </p>
                                  {act.description && (
                                    <p className="text-[12px] font-medium text-foreground/60 leading-relaxed">
                                      {act.description}
                                    </p>
                                  )}
                                  {act.images && act.images.length > 0 && (
                                    <div className="flex gap-2 overflow-x-auto pt-1 no-scrollbar">
                                      {act.images.map((img: string, imgIdx: number) => (
                                        <div key={imgIdx} className="relative h-14 w-14 shrink-0 group/img cursor-pointer active:scale-95 transition-transform" onClick={() => openLightbox(act.images || [], imgIdx)}>
                                          <img 
                                            src={img} alt="Activity" 
                                            className="h-full w-full rounded-lg object-cover border border-border/50 shadow-sm" 
                                          />
                                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white">
                                            <ImageIcon className="h-4 w-4 shadow-sm" />
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }) : (
                <div className="text-center py-12 px-4 bg-card/20 rounded-2xl border border-dashed border-border/50">
                  <ImageIcon className="h-10 w-10 text-primary/20 mx-auto mb-3" />
                  <p className="text-[14px] font-semibold text-foreground/40">Add an itinerary to show travel plans.</p>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Lightbox Modal */}
      {lightbox.open && (
        <div 
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-sm transition-all duration-300"
          onClick={closeLightbox}
        >
          <button 
            className="absolute top-6 right-8 text-white/70 hover:text-white transition p-2 bg-white/10 rounded-full"
            onClick={closeLightbox}
          >
            <X className="h-6 w-6" />
          </button>
          
          <button 
            className="absolute left-8 h-12 w-12 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-full transition"
            onClick={prevImg}
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <div className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <img 
              src={lightbox.images[lightbox.index]} 
              alt="Lightbox" 
              className="max-h-full max-w-full object-contain rounded-lg shadow-2xl transition-opacity duration-300"
            />
            <div className="text-white/60 text-[14px] font-medium bg-black/40 px-4 py-1 rounded-full backdrop-blur-md">
              {lightbox.index + 1} / {lightbox.images.length}
            </div>
          </div>

          <button 
            className="absolute right-8 h-12 w-12 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-full transition"
            onClick={nextImg}
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </div>
      )}
    </div>
  )
}
