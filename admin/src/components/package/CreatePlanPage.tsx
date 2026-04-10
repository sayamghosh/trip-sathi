import React, { useMemo, useState, useRef } from "react"
import {
  CalendarDays,
  MapPin,
  IndianRupee,
  ImagePlus,
  Clock3,
  Users,
  Building2,
  PlaneTakeoff,
  Eye,
  Sparkles,
  CheckCircle2,
  Plus,
  Trash2,
  Check,
  Utensils,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import api from "@/lib/axios"


interface ActivityItem {
  id: string
  type: "transfer" | "sightseeing" | "hotel" | "meal" | "other"
  metaInfo?: string
  title: string
  description?: string
  images?: string[]
}

interface ItineraryItem {
  day: number
  title: string
  activities: ActivityItem[]
}

function AddActivityButton({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-[13px] font-medium text-secondary-foreground hover:bg-secondary hover:text-foreground transition-all"
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}




const tagOptions = [
  "Beach",
  "Adventure",
  "Family Friendly",
  "Workcation",
  "Luxury",
  "Budget",
  "Nature",
  "City Break",
]

import { useParams, useNavigate } from "@tanstack/react-router"

export function CreatePlanPage() {
  const { packageId } = useParams({ strict: false }) as any
  const navigate = useNavigate()
  const isEdit = !!packageId

  const [planName, setPlanName] = useState("")
  const [description, setDescription] = useState("")
  const [destination, setDestination] = useState("")
  const [category, setCategory] = useState("Adventure")
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
  const [price, setPrice] = useState(0)
  const [capacity, setCapacity] = useState(10)
  const [duration, setDuration] = useState(1)
  const [includeFlights, setIncludeFlights] = useState(false)
  const [includeStay, setIncludeStay] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)
  const [isRecommended, setIsRecommended] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [bannerImages, setBannerImages] = useState<string[]>([])
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([
    { day: 1, title: "Arrival", activities: [] }
  ])
  const [activeDayIndex, setActiveDayIndex] = useState(0)

  const [activityModalOpen, setActivityModalOpen] = useState(false)
  const [activityModalDay, setActivityModalDay] = useState(0)
  const [currentActivity, setCurrentActivity] = useState<ActivityItem | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(isEdit)
  const [isUploading, setIsUploading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadType, setUploadType] = useState<{ type: 'banner' | 'gallery' | 'activity', index?: number }>({ type: 'banner' })
  const [dragActive, setDragActive] = useState<{ type: string, index?: number } | null>(null)

  const updateImageState = (imageUrl: string, type: string, index?: number) => {
    if (type === 'banner') {
      setBannerImages(prev => {
        const next = [...prev]
        next[0] = imageUrl
        return next
      })
    } else if (type === 'gallery') {
      setBannerImages(prev => {
        const next = [...prev]
        const idx = (index ?? (prev.length - 1)) + 1
        next[idx] = imageUrl
        return next
      })
    } else if (type === 'activity') {
      setCurrentActivity(prev => {
        if (!prev) return prev
        return {
          ...prev,
          images: [...(prev.images || []), imageUrl]
        }
      })
    }
  }

  const uploadFile = async (file: File, type: string, index?: number) => {
    const formData = new FormData()
    formData.append('image', file)

    if (isUploading) {
       alert("Please wait for images to finish uploading.")
       return
    }
    
    setIsUploading(true)
    try {
      const res = await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      updateImageState(res.data.url, type, index)
    } catch (error) {
      console.error("Upload failed:", error)
      alert("Failed to upload image")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    uploadFile(file, uploadType.type, uploadType.index)
  }

  const handleDrag = (e: React.DragEvent, active: boolean, type: string, index?: number) => {
    e.preventDefault()
    e.stopPropagation()
    if (active) {
      setDragActive({ type, index })
    } else {
      setDragActive(null)
    }
  }

  const handleDrop = async (e: React.DragEvent, type: 'banner' | 'gallery' | 'activity', index?: number) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(null)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        uploadFile(file, type, index)
      }
    } else {
      const url = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain')
      if (url && (url.startsWith('http') || url.startsWith('https'))) {
        // Clean the URL if it's from uri-list (it might have multiple or be a link)
        const cleanUrl = url.split('\n')[0].trim()
        updateImageState(cleanUrl, type, index)
      }
    }
  }

  const triggerUpload = (type: 'banner' | 'gallery' | 'activity', index?: number) => {
    setUploadType({ type, index })
    fileInputRef.current?.click()
  }

  React.useEffect(() => {
    if (isEdit) {
      const fetchPlan = async () => {
        try {
          const res = await api.get(`/api/tour-plans/${packageId}`)
          const data = res.data
          setPlanName(data.title)
          setDescription(data.description)
          setPrice(data.basePrice)
          setDuration(data.durationDays)
          setDestination(data.locations?.[0] || "")
          setBannerImages(data.bannerImages || [])
          setIsRecommended(data.isRecommended || false)
          
          const fetchedDays = data.days?.length > 0 ? data.days : [{ dayNumber: 1, title: "Arrival", activities: [] }]
          setItinerary(fetchedDays.map((d: any) => ({
            day: d.dayNumber,
            title: d.title,
            activities: d.activities?.map((a: any) => ({
              id: Math.random().toString(36).substr(2, 9),
              type: a.type || "other",
              title: a.title,
              metaInfo: a.duration || "",
              description: a.description || "",
              images: a.images || [],
            })) || []
          })))
          setActiveDayIndex(0)
          if (data.createdAt) {
             setStartDate(new Date(data.createdAt).toISOString().split('T')[0])
          }
        } catch (error) {
          console.error("Error fetching plan:", error)
          alert("Failed to load plan data")
        } finally {
          setIsLoading(false)
        }
      }
      fetchPlan()
    }
  }, [isEdit, packageId])

  const nights = useMemo(() => Math.max(duration - 1, 0), [duration])
  const selectedTags = useMemo(() => tags.join(", "), [tags])

  const toggleTag = (tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const updateItinerary = (index: number, patch: Partial<ItineraryItem>) => {
    setItinerary((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], ...patch }
      return next
    })
  }

  const addDay = () => {
    setItinerary((prev) => [
      ...prev,
      {
        day: prev.length + 1,
        title: "New Day",
        activities: [],
      },
    ])
    setActiveDayIndex(itinerary.length)
  }

  const removeDay = (index: number) => {
    setItinerary((prev) => prev.filter((_, i) => i !== index).map((item, i) => ({ ...item, day: i + 1 })))
    if (activeDayIndex >= index && activeDayIndex > 0) {
      setActiveDayIndex(activeDayIndex - 1)
    }
  }

  const openActivityModal = (dayIndex: number, type: ActivityItem["type"], existingActivity?: ActivityItem) => {
    setActivityModalDay(dayIndex)
    if (existingActivity) {
      setCurrentActivity(existingActivity)
    } else {
      setCurrentActivity({
        id: Math.random().toString(36).substr(2, 9),
        type,
        title: "",
        metaInfo: "",
        description: "",
        images: []
      })
    }
    setActivityModalOpen(true)
  }

  const saveActivity = () => {
    if (!currentActivity) return
    setItinerary(prev => {
      const next = [...prev]
      const day = next[activityModalDay]
      const exists = day.activities.findIndex(a => a.id === currentActivity.id)
      if (exists !== -1) {
        day.activities[exists] = currentActivity
      } else {
        day.activities.push(currentActivity)
      }
      return next
    })
    setActivityModalOpen(false)
  }

  const removeActivity = (dayIndex: number, activityId: string) => {
    setItinerary(prev => {
      const next = [...prev]
      next[dayIndex].activities = next[dayIndex].activities.filter(a => a.id !== activityId)
      return next
    })
  }

  const handlePublish = async () => {
    if (isUploading) {
      alert("Please wait for images to finish uploading.")
      return
    }
    setIsSubmitting(true)
    try {
      const payload = {
        title: planName,
        description,
        basePrice: price,
        durationDays: duration,
        durationNights: nights,
        locations: [destination],
        bannerImages: bannerImages.length > 0 ? bannerImages : [
          "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800",
        ],
        isRecommended,
        days: itinerary.map((item) => ({
          dayNumber: item.day,
          title: item.title,
          activities: item.activities.map(a => ({
            type: a.type,
            title: a.title,
            duration: a.metaInfo || "",
            description: a.description || "",
            images: a.images || [],
          })),
        })),
      }

      if (isEdit) {
        await api.put(`/api/tour-plans/${packageId}`, payload)
        alert("Plan updated successfully!")
      } else {
        await api.post("/api/tour-plans", payload)
        alert("Plan published successfully!")
      }
      setIsPublished(true)
      navigate({ to: "/packages" })
    } catch (error: any) {
      console.error("Error saving plan:", error)
      alert(error.response?.data?.message || "Failed to save plan")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this package?")) return
    try {
      await api.delete(`/api/tour-plans/${packageId}`)
      alert("Package deleted successfully!")
      navigate({ to: "/packages" })
    } catch (error) {
      console.error("Error deleting package:", error)
      alert("Failed to delete package")
    }
  }

  if (isLoading) {
    return <div className="flex h-[70vh] items-center justify-center">Loading plan details...</div>
  }

  return (
    <div className="space-y-4">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleFileUpload}
      />
      {/* Hero header */}
      <div className="rounded-[16px] border border-border bg-white dark:bg-card px-6 py-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">{isEdit ? "Edit Plan" : "Create Plan"}</span>
              <span className="h-4 w-px bg-border" />
              <p className="text-[11px] font-medium text-secondary-foreground">{isEdit ? "Refining an existing experience" : "Crafting a new journey"}</p>
            </div>
            <h1 className="text-2xl font-extrabold text-foreground mt-2 tracking-tight">{planName || (isEdit ? "Loading..." : "Untitled travel plan")}</h1>
            <p className="text-[13px] text-secondary-foreground mt-1.5 leading-relaxed">{isEdit ? "Review and update every aspect of this curated package." : "Share the unique vibe, itinerary and pricing of your next big tour."}</p>
          </div>
          <div className="flex items-center gap-2.5">
            {isEdit && (
              <Button onClick={handleDelete} variant="ghost" size="sm" className="h-10 border-destructive/20 text-destructive/80 hover:bg-destructive/10 hover:text-destructive font-semibold">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
            <div className="h-8 w-px bg-border mx-1" />
            <Button variant="outline" size="sm" className="h-10 border-border font-semibold px-5">Save Draft</Button>
            <Button variant="secondary" size="sm" className="h-10 font-semibold px-5">Preview</Button>
            <Button 
              onClick={handlePublish} 
              disabled={isSubmitting || isUploading} 
              size="sm" 
              className="h-10 bg-primary shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 font-bold px-6 transition-all"
            >
              {isSubmitting ? "Processing..." : (isEdit ? "Update Plan" : "Publish Plan")}
            </Button>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          {/* Basic details */}
          <section className="rounded-[16px] border border-border bg-card p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[16px] font-bold text-foreground">Plan basics</h3>
                <p className="text-[12px] text-secondary-foreground">The foundational details travelers will see first.</p>
              </div>
              <span className="rounded-full bg-amber-100 dark:bg-amber-900/30 px-3 py-1.5 text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest border border-amber-200/50 dark:border-amber-700/50">Draft</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-secondary-foreground ml-1">Plan Name</label>
                <Input value={planName} onChange={(e) => setPlanName(e.target.value)} placeholder="e.g., Alpine Trails & Lakes" className="h-11 border-border bg-secondary/10 focus:bg-background transition-all text-sm font-medium" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-secondary-foreground ml-1">Primary Destination</label>
                <Input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="City / Country" className="h-11 border-border bg-secondary/10 focus:bg-background transition-all text-sm font-medium" />
              </div>
              <div className="col-span-2 space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-secondary-foreground ml-1">Experience Description</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Tell a story about what makes this trip special..." 
                  className="min-h-30 w-full rounded-xl border border-border bg-secondary/10 px-4 py-3 text-[13px] text-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all leading-relaxed"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-secondary-foreground ml-1">Travel Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-11 w-full rounded-xl border border-border bg-secondary/10 px-4 text-[13px] text-foreground font-medium focus:border-primary focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all">
                  <option>Adventure</option>
                  <option>Leisure</option>
                  <option>Cultural</option>
                  <option>Wellness</option>
                  <option>Workcation</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-secondary-foreground ml-1">Hook Tagline</label>
                <Input placeholder="Short punchy line" className="h-11 border-border bg-secondary/20 focus:bg-white transition-all text-sm font-medium" />
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-secondary-foreground ml-1">Search Tags</label>
              <div className="flex flex-wrap gap-2.5 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/20 border border-border/50">
                {tagOptions.map((tag) => {
                  const active = tags.includes(tag)
                  return (
                    <button key={tag} type="button" onClick={() => toggleTag(tag)} className={cn("rounded-full border px-4 py-1.5 text-[12px] font-semibold transition-all duration-200", active ? "border-primary bg-primary text-white shadow-md shadow-primary/20 scale-105" : "border-border bg-card text-secondary-foreground hover:border-primary/50 hover:bg-muted")}>
                      {active && <Check className="mr-1.5 inline h-3.5 w-3.5" />}
                      {tag}
                    </button>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Dates & pricing */}
          <section className="rounded-[16px] border border-border bg-card p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[16px] font-bold text-foreground">Dates & pricing</h3>
                <p className="text-[12px] text-secondary-foreground">Set global availability, slots and what's included.</p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10">
                <Eye className="h-3 w-3" /> LIVE PREVIEW
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-secondary-foreground ml-1">Departure Date</label>
                <div className="flex items-center gap-2.5 rounded-xl border border-border bg-secondary/10 px-4 py-2.5 focus-within:bg-background focus-within:ring-4 focus-within:ring-primary/5 transition-all">
                  <CalendarDays className="h-4 w-4 text-primary/70" />
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border-none bg-transparent text-[13px] font-medium text-foreground outline-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-secondary-foreground ml-1">Return Date</label>
                <div className="flex items-center gap-2.5 rounded-xl border border-border bg-secondary/10 px-4 py-2.5 focus-within:bg-background focus-within:ring-4 focus-within:ring-primary/5 transition-all">
                  <CalendarDays className="h-4 w-4 text-primary/70" />
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full border-none bg-transparent text-[13px] font-medium text-foreground outline-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-secondary-foreground ml-1">Duration</label>
                <div className="relative">
                   <Input type="number" min={1} value={duration} onChange={(e) => setDuration(Number(e.target.value) || 1)} className="h-11 border-border bg-secondary/20 focus:bg-white transition-all text-sm font-medium pr-12" />
                   <span className="absolute right-4 top-3 text-[11px] font-bold text-muted-foreground uppercase">Days</span>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-secondary-foreground ml-1">Base Price (INR)</label>
                <div className="flex items-center gap-2.5 rounded-xl border border-border bg-secondary/10 px-4 py-2.5 focus-within:bg-background focus-within:ring-4 focus-within:ring-primary/5 transition-all">
                  <IndianRupee className="h-4 w-4 text-emerald-500" />
                  <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value) || 0)} className="w-full border-none bg-transparent text-[14px] font-bold text-foreground outline-none" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Per Head</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-secondary-foreground ml-1">Total Capacity</label>
                <div className="flex items-center gap-2.5 rounded-xl border border-border bg-secondary/10 px-4 py-2.5 focus-within:bg-background focus-within:ring-4 focus-within:ring-primary/5 transition-all">
                  <Users className="h-4 w-4 text-blue-500" />
                  <input type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value) || 0)} className="w-full border-none bg-transparent text-[14px] font-bold text-foreground outline-none" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Seats</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-secondary-foreground ml-1">Booking Terms</label>
                <select className="h-11 w-full rounded-xl border border-border bg-secondary/20 px-4 text-[13px] font-medium text-foreground focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all">
                  <option>Full payment upfront</option>
                  <option>50% to book, rest on arrival</option>
                  <option>EMI available</option>
                </select>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <ToggleTile title="Stay included" description="Hotels & stays" icon={<Building2 className="h-4 w-4 text-purple-500" />} active={includeStay} onToggle={() => setIncludeStay((v) => !v)} />
              <ToggleTile title="Flights" description="Airfare handling" icon={<PlaneTakeoff className="h-4 w-4 text-blue-500" />} active={includeFlights} onToggle={() => setIncludeFlights((v) => !v)} />
              <ToggleTile title="Featured" description="Showcase on home" icon={<Sparkles className="h-4 w-4 text-amber-500" />} active={isFeatured} onToggle={() => setIsFeatured((v) => !v)} />
            </div>
          </section>

          {/* Itinerary */}
          <section className="rounded-[24px] border border-border bg-card shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between bg-card">
              <div>
                <h3 className="text-[18px] font-extrabold text-foreground tracking-tight">Day-wise Itinerary</h3>
                <p className="text-[12px] text-secondary-foreground mt-0.5">Craft the narrative of each day with activities, stays, and meals.</p>
              </div>
              <Button
                type="button"
                onClick={addDay}
                variant="outline"
                size="sm"
                className="h-10 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 font-bold px-5 rounded-xl shadow-sm transition-all"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Next Day
              </Button>
            </div>
            
            <div className="flex flex-1 min-h-125">
              {/* Sidebar - Minimal List */}
              <div className="w-45 shrink-0 border-r border-border bg-muted/20 p-4 space-y-1 overflow-y-auto">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-3">Days</p>
                {itinerary.map((day, idx) => {
                  const isActive = idx === activeDayIndex
                  return (
                    <button
                      key={day.day}
                      onClick={() => setActiveDayIndex(idx)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-all",
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-secondary-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <span>Day {day.day}</span>
                      <span className={cn("text-[10px] opacity-70", isActive ? "text-primary-foreground" : "text-muted-foreground")}>{day.activities.length}</span>
                    </button>
                  )
                })}
              </div>



              {/* Day Details - Content Area */}
              <div className="flex-1 p-8 bg-card dark:bg-background/20 relative">
                {itinerary[activeDayIndex] && (
                  <div className="max-w-200 mx-auto space-y-8">
                    {/* Day Header */}
                    <div className="flex items-start justify-between gap-6 px-1">
                      <div className="space-y-4 flex-1">
                        <div>
                           <h2 className="text-[18px] font-bold text-foreground">Day Summary</h2>
                           <p className="text-[12px] text-muted-foreground mt-0.5">Define the main focus for Day {itinerary[activeDayIndex].day}</p>
                        </div>
                        <Input 
                          value={itinerary[activeDayIndex].title} 
                          onChange={(e) => updateItinerary(activeDayIndex, { title: e.target.value })} 
                          placeholder="e.g. Arrival & Evening Dhow Cruise"
                          className="h-11 font-medium text-foreground text-[15px] border-border bg-muted/30 focus-visible:ring-primary/20 px-4 transition-all rounded-lg"
                        />
                      </div>
                      {itinerary.length > 1 && (
                        <div className="pt-8">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeDay(activeDayIndex)} 
                            className="text-destructive/60 hover:bg-destructive/10 hover:text-destructive h-10 w-10 p-0 rounded-full"
                            title="Delete Day"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      )}
                    </div>

                     {/* Activities List */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-border pb-4">
                        <div>
                           <h4 className="text-[15px] font-bold text-foreground">Day Content</h4>
                           <p className="text-[12px] text-muted-foreground mt-0.5">Manage activities for this day</p>
                        </div>
                        <span className="text-[11px] font-bold text-muted-foreground bg-secondary px-2 py-1 rounded border border-border">{itinerary[activeDayIndex].activities.length} Activities</span>
                      </div>



                      {itinerary[activeDayIndex].activities.length === 0 ? (
                        <div className="rounded-[24px] border border-dashed border-border bg-muted/20 py-20 text-center flex flex-col items-center justify-center">
                          <button
                            type="button"
                            onClick={() => openActivityModal(activeDayIndex, "other")}
                            className="h-16 w-16 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-primary/40 hover:text-primary hover:border-primary/40 hover:shadow-md transition-all group mb-4"
                          >
                            <Plus className="h-8 w-8 transition-transform group-hover:rotate-90" />
                          </button>
                          <p className="text-[15px] font-bold text-foreground">Start building Day {activeDayIndex + 1}</p>
                          <p className="text-[12px] text-muted-foreground mt-1 max-w-70">Add transfers, sightseeing, hotels or meals to create a rich itinerary.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {itinerary[activeDayIndex].activities.map((activity) => (
                               <div key={activity.id} className="rounded-xl border border-border p-4 bg-card hover:border-primary/30 transition-all group">
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3 flex-1">
                                       <div className={cn(
                                         "h-8 w-8 shrink-0 flex items-center justify-center rounded-lg border shadow-sm",
                                         activity.type === "transfer" ? "border-blue-100 bg-blue-50 text-blue-600" :
                                         activity.type === "sightseeing" ? "border-emerald-100 bg-emerald-50 text-emerald-600" :
                                         activity.type === "hotel" ? "border-indigo-100 bg-indigo-50 text-indigo-600" :
                                         activity.type === "meal" ? "border-rose-100 bg-rose-50 text-rose-600" :
                                         "border-slate-100 bg-slate-50 text-slate-600"
                                       )}>
                                          {activity.type === "transfer" && <Clock3 className="h-4 w-4" />}
                                          {activity.type === "sightseeing" && <MapPin className="h-4 w-4" />}
                                          {activity.type === "hotel" && <Building2 className="h-4 w-4" />}
                                          {activity.type === "meal" && <Utensils className="h-4 w-4" />}
                                          {activity.type === "other" && <Sparkles className="h-4 w-4" />}
                                       </div>
                                       <div className="space-y-0.5">
                                          <h5 className="text-[14px] font-bold text-foreground leading-tight">{activity.title || "Untitled Activity"}</h5>
                                          <div className="flex items-center gap-2">
                                             <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{activity.type}</span>
                                             {activity.metaInfo && (
                                               <>
                                                 <span className="h-1 w-1 rounded-full bg-border" />
                                                 <span className="text-[11px] font-medium text-primary/80">{activity.metaInfo}</span>
                                               </>
                                             )}
                                          </div>
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                       <Button variant="ghost" size="sm" onClick={() => openActivityModal(activeDayIndex, activity.type, activity)} className="h-8 px-2 text-[12px]">Edit</Button>
                                       <Button variant="ghost" size="sm" onClick={() => removeActivity(activeDayIndex, activity.id)} className="h-8 w-8 p-0 text-destructive/80 hover:text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                  </div>
                                  {activity.description && <p className="text-[13px] text-secondary-foreground mt-3 leading-relaxed border-l-2 border-border pl-4 ml-4">{activity.description}</p>}

                                  
                                  {activity.images && activity.images.length > 0 && (
                                    <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none pl-4 ml-4">
                                      {activity.images.map((img, i) => (
                                        <div key={i} className="relative group/img h-16 w-16 shrink-0 rounded-lg overflow-hidden border border-border shadow-sm">
                                          <img src={img} alt="Activity" className="h-full w-full object-cover" />
                                          <button 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setItinerary(prev => {
                                                const next = [...prev];
                                                const act = next[activeDayIndex].activities.find(a => a.id === activity.id);
                                                if (act) act.images = act.images?.filter((_, idx) => idx !== i);
                                                return next;
                                              });
                                            }}
                                            className="absolute top-0.5 right-0.5 hidden group-hover/img:flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white"
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                          ))}
                        </div>
                      )}
 
                      {/* Add Activity Controls - Minimalist Buttons */}
                      <div className="pt-6 border-t border-border flex flex-wrap gap-2">
                        <AddActivityButton icon={<Clock3 className="h-4 w-4" />} label="Transfer" onClick={() => openActivityModal(activeDayIndex, "transfer")} />
                        <AddActivityButton icon={<MapPin className="h-4 w-4" />} label="Sightseeing" onClick={() => openActivityModal(activeDayIndex, "sightseeing")} />
                        <AddActivityButton icon={<Building2 className="h-4 w-4" />} label="Hotel" onClick={() => openActivityModal(activeDayIndex, "hotel")} />
                        <AddActivityButton icon={<Utensils className="h-4 w-4" />} label="Meal" onClick={() => openActivityModal(activeDayIndex, "meal")} />
                        <AddActivityButton icon={<Sparkles className="h-4 w-4" />} label="Other" onClick={() => openActivityModal(activeDayIndex, "other")} />
                      </div>

                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>


          {/* Media */}
          <section className="rounded-[20px] border border-border bg-card p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-[17px] font-bold text-foreground tracking-tight">Cover & gallery</h3>
                <p className="text-[12px] text-secondary-foreground mt-0.5">Define the visual identity of this tour with a hero cover and supporting media.</p>
              </div>
              <div className="flex gap-2">
                 <Button variant="outline" size="sm" className="h-8 text-[11px] border-border hover:bg-accent transition-all">
                    <Sparkles className="mr-1.5 h-3 w-3 text-primary" />
                    AI Enhance
                 </Button>
                 <Button variant="outline" size="sm" className="h-8 text-[11px] border-border">Manage gallery</Button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Full Width Cover Slot */}
              <div 
                onDragOver={(e) => handleDrag(e, true, 'banner')}
                onDragLeave={(e) => handleDrag(e, false, 'banner')}
                onDrop={(e) => handleDrop(e, 'banner')}
                className={cn(
                  "group relative w-full h-80 overflow-hidden rounded-[24px] border-2 border-dashed transition-all duration-300 shadow-sm",
                  dragActive?.type === 'banner' 
                    ? "border-primary bg-primary/5 ring-4 ring-primary/10" 
                    : "border-border bg-muted/20 hover:border-primary/40"
                )}
              >
                {bannerImages[0] ? (
                  <>
                    <img src={bannerImages[0]} alt="Cover" className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="absolute top-5 left-5 rounded-full bg-primary/90 px-4 py-1.5 text-[10px] font-bold text-white shadow-xl backdrop-blur-md border border-white/10">
                      MAIN COVER PHOTO
                    </div>
                    <div className="absolute bottom-6 right-6 flex gap-2 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <Button size="sm" variant="secondary" className="h-10 bg-white/95 text-foreground hover:bg-white shadow-2xl font-bold px-5" onClick={() => triggerUpload('banner')}>
                        <span className="flex items-center gap-2 font-bold"><ImagePlus className="h-4.5 w-4.5" /> Replace Cover</span>
                      </Button>
                      <Button size="sm" variant="destructive" className="h-10 w-10 p-0 shadow-2xl rounded-xl" onClick={() => setBannerImages(prev => prev.filter((_, i) => i !== 0))}>
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                    {dragActive?.type === 'banner' && (
                      <div className="absolute inset-0 z-30 flex items-center justify-center bg-primary/20 backdrop-blur-[2px]">
                        <div className="bg-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
                          <ImagePlus className="h-6 w-6 text-primary" />
                          <span className="text-[14px] font-bold text-primary">Drop to set cover</span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center space-y-5 p-10 text-center bg-secondary/10 relative">
                    <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-card text-primary shadow-lg border border-border transition-transform group-hover:scale-110">
                      <ImagePlus className="h-10 w-10" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[18px] font-bold text-foreground">Upload the main cover photo</p>
                      <p className="mx-auto max-w-[320px] text-[13px] text-secondary-foreground leading-relaxed">This image will be the first thing travelers see. High resolution (1920x1080) landscape photos work best.</p>
                    </div>
                    <Button 
                      size="sm" 
                      disabled={isUploading} 
                      onClick={() => triggerUpload('banner')}
                      className="mt-2 bg-primary px-10 h-11 rounded-xl shadow-[0_8px_20px_rgba(var(--primary),0.25)] hover:shadow-[0_12px_28px_rgba(var(--primary),0.4)] transition-all font-bold"
                    >
                      {isUploading && uploadType.type === 'banner' ? "Uploading..." : "Select Cover Photo"}
                    </Button>
                    {dragActive?.type === 'banner' && (
                      <div className="absolute inset-0 z-30 flex items-center justify-center bg-primary/10">
                         <div className="text-primary font-bold animate-pulse">Drop here!</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Gallery List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-[13px] font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    Gallery Images 
                    <span className="text-[11px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{bannerImages.length > 1 ? bannerImages.length - 1 : 0} / 5</span>
                  </h4>
                  <p className="text-[11px] text-secondary-foreground">Add supporting photos to showcase the itinerary.</p>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  {/* Existing Gallery Images */}
                  {bannerImages.slice(1).map((img, idx) => (
                    <div 
                      key={idx} 
                      onDragOver={(e) => handleDrag(e, true, 'gallery', idx)}
                      onDragLeave={(e) => handleDrag(e, false, 'gallery', idx)}
                      onDrop={(e) => handleDrop(e, 'gallery', idx)}
                      className={cn(
                        "group relative h-35 w-55 overflow-hidden rounded-[18px] border transition-all duration-300 shadow-sm",
                        dragActive?.type === 'gallery' && dragActive?.index === idx
                          ? "border-primary bg-primary/5 ring-4 ring-primary/10 scale-[1.05] z-10"
                          : "border-border bg-muted/20 hover:border-primary/40 hover:shadow-xl"
                      )}
                    >
                      <img src={img} alt={`Gallery ${idx + 1}`} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-all duration-300 translate-y-3 group-hover:translate-y-0 group-hover:opacity-100">
                         <button 
                            onClick={() => triggerUpload('gallery', idx)}
                            className="rounded-full bg-white/95 p-2.5 text-foreground hover:bg-white shadow-xl hover:scale-110 transition-all"
                            title="Replace image"
                         >
                            <Plus className="h-4.5 w-4.5" />
                         </button>
                         <button 
                          onClick={() => setBannerImages(prev => prev.filter((_, i) => i !== idx + 1))}
                          className="rounded-full bg-destructive/95 p-2.5 text-white hover:bg-destructive shadow-xl hover:scale-110 transition-all"
                          title="Delete image"
                         >
                          <Trash2 className="h-4.5 w-4.5" />
                         </button>
                      </div>
                      {dragActive?.type === 'gallery' && dragActive?.index === idx && (
                         <div className="absolute inset-0 z-30 flex items-center justify-center bg-primary/20 backdrop-blur-[1px]">
                            <Plus className="h-8 w-8 text-white scale-animation" />
                         </div>
                      )}
                    </div>
                  ))}

                  {/* Add New Image Button - Only show if less than 6 total images (1 cover + 5 gallery) */}
                  {bannerImages.length < 6 && (
                    <button 
                      type="button"
                      disabled={isUploading}
                      onDragOver={(e) => handleDrag(e, true, 'gallery', Math.max(0, bannerImages.length - 1))}
                      onDragLeave={(e) => handleDrag(e, false, 'gallery', Math.max(0, bannerImages.length - 1))}
                      onDrop={(e) => handleDrop(e, 'gallery', Math.max(0, bannerImages.length - 1))}
                      onClick={() => triggerUpload('gallery', Math.max(0, bannerImages.length - 1))}
                      className={cn(
                        "group flex h-35 w-55 flex-col items-center justify-center gap-3 rounded-[18px] border-2 border-dashed transition-all duration-300",
                        dragActive?.type === 'gallery' && dragActive?.index === Math.max(0, bannerImages.length - 1)
                          ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                          : "border-border bg-muted/30 hover:bg-muted/50 hover:border-primary/40 hover:shadow-md"
                      )}
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-card border border-border text-secondary-foreground group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/30 transition-all shadow-sm">
                        <Plus className="h-6 w-6" />
                      </div>
                      <div className="text-center">
                        <span className="block text-[12px] font-bold text-foreground group-hover:text-primary transition-colors">Add Image</span>
                        <span className="text-[10px] text-muted-foreground">Supporting media</span>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Right column */}
        <div className="space-y-4">
          <section className="rounded-[14px] border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-foreground">Launch controls</h3>
              <span className={cn("rounded-full px-2.5 py-0.75 text-[11px] font-semibold", isPublished ? "bg-success/20 text-success" : "bg-warning/20 text-warning")}>{isPublished ? "Published" : "Draft"}</span>
            </div>

            <div className="mt-3 space-y-3">
              <SwitchRow label="Visible to travelers" sub="Listed on search, booking open" checked={isPublished} onChange={setIsPublished} />
              <SwitchRow label="Mark as featured" sub="Show on homepage hero" checked={isFeatured} onChange={setIsFeatured} />
              <SwitchRow label="Recommended Packages" sub="Show in the Recommended section" checked={isRecommended} onChange={setIsRecommended} />
              <SwitchRow label="Accept waitlist" sub="Collect leads when seats fill" checked={capacity <= 0} onChange={() => setCapacity((c) => (c === 0 ? 18 : 0))} />
            </div>

            <div className="mt-4 flex items-center justify-between rounded-[12px] border border-border bg-secondary/50 px-3 py-3">
              <div className="space-y-0.5 text-[12px] text-secondary-foreground">
                <p className="font-semibold text-foreground">Ready to publish?</p>
                <p>{selectedTags || "Add at least one tag"}</p>
              </div>
              <Button size="sm" disabled={isSubmitting || isUploading} onClick={handlePublish}>Publish</Button>
            </div>
          </section>

          <section className="rounded-[14px] border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2 text-foreground">
              <Eye className="h-4 w-4 text-primary" />
              <h3 className="text-[14px] font-semibold">Listing preview</h3>
            </div>
            <div className="space-y-2 rounded-[12px] border border-border bg-secondary p-3">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{destination}</span>
              </div>
              <div className="text-[12px] text-secondary-foreground">{planName}</div>
              <div className="flex items-center gap-3 text-[11px] text-secondary-foreground">
                <span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> {duration} days / {nights} nights</span>
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {capacity} seats</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <div className="text-[12px] text-secondary-foreground">
                  {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(startDate))} - {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(endDate))}
                </div>
                <div className="text-right">
                  <div className="text-[15px] font-bold text-primary">₹{price.toLocaleString("en-IN")}</div>
                  <div className="text-[11px] text-muted-foreground">per person</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                {tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-card px-2 py-0.75 text-[11px] font-semibold text-primary">{tag}</span>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[14px] border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2 text-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <h3 className="text-[14px] font-semibold">Publish checklist</h3>
            </div>
            <ul className="space-y-2 text-[12px] text-secondary-foreground">              {["Cover photo added", "At least 2 itinerary days", "Pricing & seats set", "Tags selected", "Visibility set to published"].map((item, idx) => (
                <li key={item} className="flex items-center gap-2 rounded-lg border border-border px-2.5 py-2">
                  <span className={cn("flex h-5 w-5 items-center justify-center rounded-full text-[11px]", idx < 3 || isPublished ? "bg-success/20 text-success" : "bg-warning/20 text-warning")}>{idx < 3 || isPublished ? <Check className="h-3 w-3" /> : idx + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {activityModalOpen && currentActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-125 bg-card rounded-[16px] border border-border shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                {currentActivity.type === "transfer" && <Clock3 className="h-4 w-4 text-primary" />}
                {currentActivity.type === "sightseeing" && <MapPin className="h-4 w-4 text-emerald-500" />}
                {currentActivity.type === "hotel" && <Building2 className="h-4 w-4 text-purple-500" />}
                {currentActivity.type === "meal" && <Utensils className="h-4 w-4 text-rose-500" />}
                {currentActivity.type === "other" && <Sparkles className="h-4 w-4 text-amber-500" />}
                <h3 className="text-[16px] font-bold text-foreground">
                  {!currentActivity.id ? `Add ${currentActivity.type === "other" ? "Activity" : currentActivity.type.charAt(0).toUpperCase() + currentActivity.type.slice(1)}` : 
                   (currentActivity.title ? "Edit Activity" : `Add ${currentActivity.type === "other" ? "Activity" : currentActivity.type.charAt(0).toUpperCase() + currentActivity.type.slice(1)}`)}
                </h3>
              </div>
              <button 
                onClick={() => setActivityModalOpen(false)}
                className="text-secondary-foreground hover:bg-secondary p-1 rounded-full transition"
              >
                <Plus className="h-5 w-5 rotate-45" />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-foreground">Activity Type</label>
                  <select 
                    value={currentActivity?.type || "other"} 
                    onChange={(e) => setCurrentActivity(prev => prev ? { ...prev, type: e.target.value as any } : null)}
                    className="w-full h-10 rounded-lg border border-border px-3 text-[13px] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="transfer">Transfer</option>
                    <option value="sightseeing">Sightseeing</option>
                    <option value="hotel">Hotel</option>
                    <option value="meal">Meal</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-foreground">Duration / Meta Info</label>
                  <div className="relative">
                    <Clock3 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="e.g. 2 hrs, 1 Night" 
                      value={currentActivity?.metaInfo || ""} 
                      onChange={(e) => setCurrentActivity(prev => prev ? { ...prev, metaInfo: e.target.value } : null)}
                      className="pl-9 h-10 text-[13px]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-foreground">Title <span className="text-destructive">*</span></label>
                <Input 
                  placeholder={currentActivity?.type === 'transfer' ? "Private Transfer Airport to Hotel" : currentActivity?.type === 'hotel' ? "Hotel Check-in" : currentActivity?.type === 'meal' ? "Lunch Buffet at Resort" : currentActivity?.type === 'sightseeing' ? "Guided City Tour" : "Activity Name"} 
                  value={currentActivity?.title || ""} 
                  onChange={(e) => setCurrentActivity(prev => prev ? { ...prev, title: e.target.value } : null)}
                  className={cn("h-10 font-medium text-[13px]", !currentActivity?.title ? "border-destructive/20 focus:ring-destructive/20" : "")}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-foreground">Description / Inclusions</label>
                <textarea 
                  placeholder="Add details about what is included or what to expect..." 
                  value={currentActivity?.description || ""} 
                  onChange={(e) => setCurrentActivity(prev => prev ? { ...prev, description: e.target.value } : null)}
                  className="w-full min-h-22.5 rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-foreground">Activity Images</label>
                <div 
                  onDragOver={(e) => handleDrag(e, true, 'activity')}
                  onDragLeave={(e) => handleDrag(e, false, 'activity')}
                  onDrop={(e) => handleDrop(e, 'activity')}
                  className={cn(
                    "flex gap-3 overflow-x-auto pb-6 pt-2 px-2 scrollbar-none min-h-30 border-2 border-dashed transition-all duration-300 rounded-2xl",
                    dragActive?.type === 'activity' ? "border-primary bg-primary/10" : "border-transparent bg-muted/10"
                  )}
                >
                  {currentActivity?.images && currentActivity.images.map((img, i) => (
                    <div key={i} className="relative h-20 w-20 shrink-0 rounded-[10px] overflow-hidden border border-border group">
                      <img src={img} alt="" className="h-full w-full object-cover" />
                      <button 
                        onClick={() => setCurrentActivity(prev => prev ? ({...prev, images: prev.images?.filter((_, idx) => idx !== i)}) : null)}
                        className="absolute top-1 right-1 hidden group-hover:flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white shadow-lg"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button"
                    disabled={isUploading}
                    onClick={() => triggerUpload('activity')}
                    className={cn(
                      "w-20 h-20 shrink-0 rounded-[10px] border border-dashed transition-all duration-300 flex flex-col items-center justify-center disabled:opacity-50",
                      dragActive?.type === 'activity' 
                        ? "border-primary bg-primary/10 scale-105 z-10 shadow-lg" 
                        : "border-input bg-secondary/50 text-secondary-foreground hover:bg-accent hover:border-primary hover:text-primary"
                    )}
                  >
                    <ImagePlus className="h-5 w-5 mb-1" />
                    <span className="text-[10px] font-medium">{isUploading && uploadType.type === 'activity' ? '...' : 'Upload'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border bg-muted/30 dark:bg-card/50 rounded-b-[16px] flex justify-end gap-2">
              <Button variant="outline" onClick={() => setActivityModalOpen(false)} className="bg-background dark:bg-card border-border text-foreground hover:bg-accent font-bold px-5">Cancel</Button>
              <Button onClick={saveActivity} disabled={!currentActivity?.title} className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 font-bold px-6">Save Activity</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ToggleTile({ icon, title, description, active, onToggle }: { icon: React.ReactNode; title: string; description: string; active: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} className={cn("flex w-full items-start gap-2 rounded-[12px] border px-3 py-3 text-left transition", active ? "border-primary bg-accent" : "border-border bg-card hover:border-input")}>
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1">
        <p className="text-[13px] font-semibold text-foreground">{title}</p>
        <p className="text-[12px] text-secondary-foreground">{description}</p>
      </div>
      <div className={cn("relative inline-flex h-5 w-9 items-center rounded-full", active ? "bg-primary" : "bg-muted")}>
        <span className={cn("inline-block h-4 w-4 transform rounded-full bg-background shadow transition", active ? "translate-x-4" : "translate-x-1")} />
      </div>
    </button>
  )
}

function SwitchRow({ label, sub, checked, onChange }: { label: string; sub: string; checked: boolean; onChange: (next: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-[10px] border border-border px-3 py-2.5 bg-card">
      <div>
        <p className="text-[12px] font-semibold text-foreground">{label}</p>
        <p className="text-[11px] text-secondary-foreground">{sub}</p>
      </div>
      <button type="button" onClick={() => onChange(!checked)} className={cn("relative inline-flex h-6 w-11 items-center rounded-full transition", checked ? "bg-primary" : "bg-muted")}>
        <span className={cn("inline-block h-5 w-5 transform rounded-full bg-background shadow transition", checked ? "translate-x-5" : "translate-x-1")} />
      </button>
    </div>
  )
}

export default CreatePlanPage
