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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

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
      const imageUrl = res.data.url

      if (uploadType.type === 'banner') {
        setBannerImages(prev => {
          const next = [...prev]
          next[0] = imageUrl
          return next
        })
      } else if (uploadType.type === 'gallery') {
        setBannerImages(prev => {
          const next = [...prev]
          const idx = (uploadType.index || 0) + 1
          next[idx] = imageUrl
          return next
        })
      } else if (uploadType.type === 'activity') {
        setCurrentActivity(prev => {
          if (!prev) return prev
          return {
            ...prev,
            images: [...(prev.images || []), imageUrl]
          }
        })
      }
    } catch (error) {
      console.error("Upload failed:", error)
      alert("Failed to upload image")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
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
      <div className="rounded-[14px] border border-[#E4EAF1] bg-white px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wide text-[#2E7CF6]">{isEdit ? "Edit travel plan" : "Create travel plan"}</p>
            <h1 className="text-2xl font-bold text-[#1A2B3D] mt-1">{planName || (isEdit ? "Loading..." : "New travel plan")}</h1>
            <p className="text-[12px] text-[#5A6E82] mt-1">{isEdit ? "Update this package's details, pricing and itinerary." : "Publish curated packages with dates, pricing, and a day-by-day itinerary."}</p>
          </div>
          <div className="flex items-center gap-2">
            {isEdit && (
              <Button onClick={handleDelete} variant="outline" size="sm" className="h-9 border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Package
              </Button>
            )}
            <Button variant="outline" size="sm" className="h-9 border-[#E4EAF1]">Save draft</Button>
            <Button variant="secondary" size="sm" className="h-9">Preview</Button>
            <Button 
              onClick={handlePublish} 
              disabled={isSubmitting || isUploading} 
              size="sm" 
              className="h-9"
            >
              {isSubmitting ? "Saving..." : (isEdit ? "Update plan" : "Publish plan")}
            </Button>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          {/* Basic details */}
          <section className="rounded-[14px] border border-[#E4EAF1] bg-white p-5 shadow-[0_12px_30px_-24px_rgba(26,43,61,0.15)]">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[15px] font-semibold text-[#1A2B3D]">Plan basics</h3>
                <p className="text-[12px] text-[#5A6E82]">Core details travelers will see first.</p>
              </div>
              <span className="rounded-full bg-[#EBF3FE] px-3 py-[6px] text-[11px] font-semibold text-[#2E7CF6]">Draft</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-[12px] font-semibold text-[#1A2B3D]">Plan name</label>
                <Input value={planName} onChange={(e) => setPlanName(e.target.value)} placeholder="e.g., Alpine Trails & Lakes" className="h-10" />
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-semibold text-[#1A2B3D]">Destination</label>
                <Input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="City / Country" className="h-10" />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[12px] font-semibold text-[#1A2B3D]">Rich Description</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Describe the overall experience..." 
                  className="min-h-[100px] w-full rounded-lg border border-[#E4EAF1] bg-white px-3 py-2 text-[13px] text-[#1A2B3D] focus:border-[#2E7CF6] focus:outline-none focus:ring-2 focus:ring-[#2E7CF6]/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-semibold text-[#1A2B3D]">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-10 w-full rounded-lg border border-[#E4EAF1] bg-white px-3 text-[13px] text-[#1A2B3D] focus:border-[#2E7CF6] focus:outline-none focus:ring-2 focus:ring-[#2E7CF6]/20">
                  <option>Adventure</option>
                  <option>Leisure</option>
                  <option>Cultural</option>
                  <option>Wellness</option>
                  <option>Workcation</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-semibold text-[#1A2B3D]">Tagline</label>
                <Input placeholder="One line hook" className="h-10" />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <label className="text-[12px] font-semibold text-[#1A2B3D]">Short description</label>
              <textarea className="min-h-[96px] w-full rounded-lg border border-[#E4EAF1] bg-white px-3 py-2 text-[13px] text-[#1A2B3D] placeholder:text-[#8896A6] focus:border-[#2E7CF6] focus:outline-none focus:ring-2 focus:ring-[#2E7CF6]/20" placeholder="What makes this trip special? Activities, vibe, who it's for." defaultValue="Sunrise volcano trek, waterfall canyoning, reef snorkel day, and slow-evening beach clubs with curated villas." />
            </div>

            <div className="mt-4 space-y-2">
              <label className="text-[12px] font-semibold text-[#1A2B3D]">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tagOptions.map((tag) => {
                  const active = tags.includes(tag)
                  return (
                    <button key={tag} type="button" onClick={() => toggleTag(tag)} className={cn("rounded-full border px-3 py-1 text-[12px] transition", active ? "border-[#2E7CF6] bg-[#EBF3FE] text-[#1A2B3D]" : "border-[#E4EAF1] text-[#5A6E82] hover:border-[#C8D2DE]")}>
                      {active && <Check className="mr-1 inline h-3 w-3 text-[#2E7CF6]" />}
                      {tag}
                    </button>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Dates & pricing */}
          <section className="rounded-[14px] border border-[#E4EAF1] bg-white p-5 shadow-[0_12px_30px_-24px_rgba(26,43,61,0.15)]">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[15px] font-semibold text-[#1A2B3D]">Dates & pricing</h3>
                <p className="text-[12px] text-[#5A6E82]">Set availability, seats, and inclusions.</p>
              </div>
              <span className="text-[11px] font-semibold text-[#2E7CF6]">Live preview updates</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <label className="text-[12px] font-semibold text-[#1A2B3D]">Start date</label>
                <div className="flex items-center gap-2 rounded-lg border border-[#E4EAF1] bg-white px-3 py-2">
                  <CalendarDays className="h-4 w-4 text-[#2E7CF6]" />
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border-none bg-transparent text-[13px] text-[#1A2B3D] outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-semibold text-[#1A2B3D]">End date</label>
                <div className="flex items-center gap-2 rounded-lg border border-[#E4EAF1] bg-white px-3 py-2">
                  <CalendarDays className="h-4 w-4 text-[#2E7CF6]" />
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full border-none bg-transparent text-[13px] text-[#1A2B3D] outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-semibold text-[#1A2B3D]">Duration (days)</label>
                <Input type="number" min={1} value={duration} onChange={(e) => setDuration(Number(e.target.value) || 1)} className="h-10" />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <label className="text-[12px] font-semibold text-[#1A2B3D]">Price per person</label>
                <div className="flex items-center gap-2 rounded-lg border border-[#E4EAF1] bg-white px-3 py-2">
                  <IndianRupee className="h-4 w-4 text-[#2E7CF6]" />
                  <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value) || 0)} className="w-full border-none bg-transparent text-[13px] text-[#1A2B3D] outline-none" />
                  <span className="text-[11px] text-[#8896A6]">INR</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-semibold text-[#1A2B3D]">Seats available</label>
                <div className="flex items-center gap-2 rounded-lg border border-[#E4EAF1] bg-white px-3 py-2">
                  <Users className="h-4 w-4 text-[#2E7CF6]" />
                  <input type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value) || 0)} className="w-full border-none bg-transparent text-[13px] text-[#1A2B3D] outline-none" />
                  <span className="text-[11px] text-[#8896A6]">people</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-semibold text-[#1A2B3D]">Payment terms</label>
                <select className="h-10 w-full rounded-lg border border-[#E4EAF1] bg-white px-3 text-[13px] text-[#1A2B3D] focus:border-[#2E7CF6] focus:outline-none focus:ring-2 focus:ring-[#2E7CF6]/20">
                  <option>Full payment upfront</option>
                  <option>50% to book, rest on arrival</option>
                  <option>EMI available</option>
                </select>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <ToggleTile title="Stay included" description="Hotel / villa and breakfasts" icon={<Building2 className="h-4 w-4 text-[#2E7CF6]" />} active={includeStay} onToggle={() => setIncludeStay((v) => !v)} />
              <ToggleTile title="Flights handled" description="Offer with/without flights" icon={<PlaneTakeoff className="h-4 w-4 text-[#2E7CF6]" />} active={includeFlights} onToggle={() => setIncludeFlights((v) => !v)} />
              <ToggleTile title="Featured" description="Showcase on homepage" icon={<Sparkles className="h-4 w-4 text-[#2E7CF6]" />} active={isFeatured} onToggle={() => setIsFeatured((v) => !v)} />
            </div>
          </section>

          {/* Itinerary */}
          <section className="rounded-[14px] border border-[#E4EAF1] bg-white shadow-[0_12px_30px_-24px_rgba(26,43,61,0.15)] flex flex-col">
            <div className="p-5 border-b border-[#E4EAF1]">
              <h3 className="text-[17px] font-semibold text-[#1A2B3D]">Day-wise Itinerary</h3>
              <p className="text-[13px] text-[#5A6E82]">Manage activities for each day of the tour.</p>
            </div>
            
            <div className="flex bg-[#FAFCFF] flex-1 rounded-b-[14px] min-h-[400px]">
              {/* Sidebar */}
              <div className="w-[220px] shrink-0 border-r border-[#E4EAF1] p-4 flex flex-col gap-3">
                {itinerary.map((day, idx) => {
                  const isActive = idx === activeDayIndex
                  return (
                    <button
                      key={day.day}
                      onClick={() => setActiveDayIndex(idx)}
                      className={cn(
                        "text-left p-3 rounded-lg border transition text-[13px]",
                        isActive 
                          ? "bg-[#2E7CF6] border-[#2E7CF6] text-white shadow-sm"
                          : "bg-white border-[#E4EAF1] text-[#1A2B3D] hover:border-[#C8D2DE]"
                      )}
                    >
                      <div className="font-semibold">Day {day.day}</div>
                      <div className={cn("text-[11px] truncate", isActive ? "text-blue-100" : "text-[#5A6E82]")}>
                        {day.title || "Untitled"}
                      </div>
                    </button>
                  )
                })}
                <button
                  type="button"
                  onClick={addDay}
                  className="flex items-center justify-center gap-1 mt-1 p-3 rounded-lg border border-dashed border-[#C8D2DE] bg-white text-[#5A6E82] text-[13px] hover:border-[#2E7CF6] hover:text-[#2E7CF6] transition"
                >
                  <Plus className="h-4 w-4" /> Add Day
                </button>
              </div>

              {/* Main Day Content */}
              <div className="flex-1 p-6 bg-white rounded-br-[14px]">
                {itinerary[activeDayIndex] && (
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1 max-w-[400px]">
                        <label className="text-[12px] font-semibold text-[#5A6E82]">Day {itinerary[activeDayIndex].day} Title</label>
                        <Input 
                          value={itinerary[activeDayIndex].title} 
                          onChange={(e) => updateItinerary(activeDayIndex, { title: e.target.value })} 
                          placeholder="e.g. Arrival in Ganganagar"
                          className="h-10 font-medium text-[#1A2B3D] text-[14px]"
                        />
                      </div>
                      {itinerary.length > 1 && (
                        <Button variant="ghost" size="sm" onClick={() => removeDay(activeDayIndex)} className="text-[#EF4444] hover:bg-red-50 hover:text-red-600 mt-5">
                          <Trash2 className="h-4 w-4 mr-1" /> Remove
                        </Button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="border-b border-[#E4EAF1] pb-2">
                        <h4 className="text-[11px] font-bold tracking-wider text-[#5A6E82] uppercase">Activities & Plan</h4>
                      </div>

                      {itinerary[activeDayIndex].activities.length === 0 ? (
                        <div className="rounded-[10px] border border-dashed border-[#C8D2DE] bg-[#F8FAFC] py-10 text-center flex flex-col items-center justify-center">
                          <p className="text-[13px] text-[#5A6E82]">No activities added for this day yet.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {itinerary[activeDayIndex].activities.map((activity) => (
                            <div key={activity.id} className="relative group rounded-[10px] border border-[#E4EAF1] p-3 flex gap-3 bg-white shadow-sm hover:shadow-md transition">
                                <div className="mt-1">
                                  {activity.type === "transfer" && <Clock3 className="h-4 w-4 text-[#2E7CF6]" />}
                                  {activity.type === "sightseeing" && <MapPin className="h-4 w-4 text-[#10B981]" />}
                                  {activity.type === "hotel" && <ImagePlus className="h-4 w-4 text-[#8B5CF6]" />}
                                  {activity.type === "meal" && <Utensils className="h-4 w-4 text-[#F43F5E]" />}
                                  {activity.type === "other" && <Sparkles className="h-4 w-4 text-[#F59E0B]" />}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h5 className="text-[13px] font-semibold text-[#1A2B3D]">{activity.title || "Untitled Activity"}</h5>
                                    <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition">
                                      <button onClick={() => openActivityModal(activeDayIndex, activity.type, activity)} className="p-1 text-[#5A6E82] hover:text-[#2E7CF6]">Edit</button>
                                      <button onClick={() => removeActivity(activeDayIndex, activity.id)} className="p-1 text-[#5A6E82] hover:text-[#EF4444]"><Trash2 className="h-3.5 w-3.5" /></button>
                                    </div>
                                  </div>
                                  {activity.metaInfo && <p className="text-[11px] text-[#8896A6] mt-0.5">{activity.metaInfo}</p>}
                                  {activity.description && <p className="text-[12px] text-[#5A6E82] mt-1.5">{activity.description}</p>}
                                  {activity.images && activity.images.length > 0 && (
                                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                                      {activity.images.map((img, i) => (
                                        <div key={i} className="relative group/img h-[60px] w-[60px] shrink-0">
                                          <img src={img} alt="Activity" className="h-full w-full rounded-lg object-cover border border-[#E4EAF1]" />
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
                                            className="absolute -top-1 -right-1 hidden group-hover/img:flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[10px]"
                                          >
                                            <Trash2 className="h-2.5 w-2.5" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2 flex-wrap pt-2">
                        <button onClick={() => openActivityModal(activeDayIndex, "transfer")} type="button" className="flex items-center gap-1.5 rounded-md border border-blue-100 bg-blue-50/50 px-3 py-1.5 text-[12px] font-medium text-blue-600 transition hover:bg-blue-100/50">
                          <Clock3 className="h-3.5 w-3.5" /> Add Transfer
                        </button>
                        <button onClick={() => openActivityModal(activeDayIndex, "sightseeing")} type="button" className="flex items-center gap-1.5 rounded-md border border-emerald-100 bg-emerald-50/50 px-3 py-1.5 text-[12px] font-medium text-emerald-600 transition hover:bg-emerald-100/50">
                          <MapPin className="h-3.5 w-3.5" /> Add Sightseeing
                        </button>
                        <button onClick={() => openActivityModal(activeDayIndex, "hotel")} type="button" className="flex items-center gap-1.5 rounded-md border border-purple-100 bg-purple-50/50 px-3 py-1.5 text-[12px] font-medium text-purple-600 transition hover:bg-purple-100/50">
                          <ImagePlus className="h-3.5 w-3.5" /> Add Hotel
                        </button>
                        <button onClick={() => openActivityModal(activeDayIndex, "meal")} type="button" className="flex items-center gap-1.5 rounded-md border border-rose-100 bg-rose-50/50 px-3 py-1.5 text-[12px] font-medium text-rose-600 transition hover:bg-rose-100/50">
                          <Utensils className="h-3.5 w-3.5" /> Add Meal
                        </button>
                        <button onClick={() => openActivityModal(activeDayIndex, "other")} type="button" className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-[12px] font-medium text-slate-600 transition hover:bg-slate-100">
                          <Plus className="h-3.5 w-3.5" /> Other
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Media */}
          <section className="rounded-[14px] border border-[#E4EAF1] bg-white p-5 shadow-[0_12px_30px_-24px_rgba(26,43,61,0.15)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-semibold text-[#1A2B3D]">Cover & gallery</h3>
                <p className="text-[12px] text-[#5A6E82]">Upload a hero image and supporting media.</p>
              </div>
              <Button variant="outline" size="sm" className="border-[#E4EAF1]">Manage gallery</Button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 flex items-center justify-center rounded-[12px] border border-dashed border-[#C8D2DE] bg-[#F8FAFC] p-6 text-center overflow-hidden relative">
                {bannerImages.length > 0 ? (
                  <img src={bannerImages[0]} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="space-y-2 relative z-10">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#EBF3FE] text-[#2E7CF6]"><ImagePlus className="h-5 w-5" /></div>
                    <p className="text-[13px] font-semibold text-[#1A2B3D]">Drop cover photo</p>
                    <p className="text-[12px] text-[#5A6E82]">JPG, PNG up to 5MB - 1920x1080 recommended</p>
                    <Button size="sm" disabled={isUploading} onClick={() => triggerUpload('banner')}>
                      {isUploading && uploadType.type === 'banner' ? "Uploading..." : "Upload cover"}
                    </Button>
                  </div>
                )}
                {bannerImages.length > 0 && (
                   <button 
                    onClick={() => setBannerImages(prev => prev.filter((_, i) => i !== 0))}
                    className="absolute top-2 right-2 z-20 h-7 w-7 flex items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 transition"
                   >
                     <Trash2 className="h-4 w-4" />
                   </button>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map((slot, idx) => (
                  <div key={slot} className="flex flex-1 items-center justify-between rounded-[10px] border border-[#E4EAF1] bg-white px-3 py-2 text-[12px] text-[#5A6E82] relative overflow-hidden">
                    {bannerImages[idx + 1] ? (
                      <>
                        <img src={bannerImages[idx + 1]} alt={`Gallery slot ${slot}`} className="absolute inset-0 w-full h-full object-cover" />
                        <button 
                          onClick={() => setBannerImages(prev => prev.filter((_, i) => i !== idx + 1))}
                          className="absolute top-1 right-1 z-20 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white shadow-sm hover:bg-red-600 transition"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </>
                    ) : (
                      <>
                        <span>Gallery slot {slot}</span>
                        <Button 
                          size="xs" 
                          variant="ghost" 
                          disabled={isUploading}
                          onClick={() => triggerUpload('gallery', idx)}
                          className="h-7 px-2 text-[11px] text-[#2E7CF6]"
                        >
                          {isUploading && uploadType.type === 'gallery' && uploadType.index === idx ? "..." : "Upload"}
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <section className="rounded-[14px] border border-[#E4EAF1] bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-[#1A2B3D]">Launch controls</h3>
              <span className={cn("rounded-full px-2.5 py-[3px] text-[11px] font-semibold", isPublished ? "bg-[#E7F8EC] text-[#1C8C4A]" : "bg-[#FFF4E5] text-[#C15B07]")}>{isPublished ? "Published" : "Draft"}</span>
            </div>

            <div className="mt-3 space-y-3">
              <SwitchRow label="Visible to travelers" sub="Listed on search, booking open" checked={isPublished} onChange={setIsPublished} />
              <SwitchRow label="Mark as featured" sub="Show on homepage hero" checked={isFeatured} onChange={setIsFeatured} />
              <SwitchRow label="Recommended Packages" sub="Show in the Recommended section" checked={isRecommended} onChange={setIsRecommended} />
              <SwitchRow label="Accept waitlist" sub="Collect leads when seats fill" checked={capacity <= 0} onChange={() => setCapacity((c) => (c === 0 ? 18 : 0))} />
            </div>

            <div className="mt-4 flex items-center justify-between rounded-[12px] border border-[#E4EAF1] bg-[#F8FAFC] px-3 py-3">
              <div className="space-y-0.5 text-[12px] text-[#5A6E82]">
                <p className="font-semibold text-[#1A2B3D]">Ready to publish?</p>
                <p>{selectedTags || "Add at least one tag"}</p>
              </div>
              <Button size="sm" disabled={isSubmitting || isUploading} onClick={handlePublish}>Publish</Button>
            </div>
          </section>

          <section className="rounded-[14px] border border-[#E4EAF1] bg-white p-4">
            <div className="mb-3 flex items-center gap-2 text-[#1A2B3D]">
              <Eye className="h-4 w-4 text-[#2E7CF6]" />
              <h3 className="text-[14px] font-semibold">Listing preview</h3>
            </div>
            <div className="space-y-2 rounded-[12px] border border-[#E4EAF1] bg-[#F8FAFC] p-3">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-[#1A2B3D]">
                <MapPin className="h-4 w-4 text-[#2E7CF6]" />
                <span>{destination}</span>
              </div>
              <div className="text-[12px] text-[#5A6E82]">{planName}</div>
              <div className="flex items-center gap-3 text-[11px] text-[#5A6E82]">
                <span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> {duration} days / {nights} nights</span>
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {capacity} seats</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <div className="text-[12px] text-[#5A6E82]">
                  {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(startDate))} - {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(endDate))}
                </div>
                <div className="text-right">
                  <div className="text-[15px] font-bold text-[#2E7CF6]">₹{price.toLocaleString("en-IN")}</div>
                  <div className="text-[11px] text-[#8896A6]">per person</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                {tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white px-2 py-[3px] text-[11px] font-semibold text-[#2E7CF6]">{tag}</span>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[14px] border border-[#E4EAF1] bg-white p-4">
            <div className="mb-3 flex items-center gap-2 text-[#1A2B3D]">
              <CheckCircle2 className="h-4 w-4 text-[#2E7CF6]" />
              <h3 className="text-[14px] font-semibold">Publish checklist</h3>
            </div>
            <ul className="space-y-2 text-[12px] text-[#5A6E82]">
              {["Cover photo added", "At least 2 itinerary days", "Pricing & seats set", "Tags selected", "Visibility set to published"].map((item, idx) => (
                <li key={item} className="flex items-center gap-2 rounded-lg border border-[#E4EAF1] px-2.5 py-2">
                  <span className={cn("flex h-5 w-5 items-center justify-center rounded-full text-[11px]", idx < 3 || isPublished ? "bg-[#E7F8EC] text-[#1C8C4A]" : "bg-[#FFF4E5] text-[#C15B07]")}>{idx < 3 || isPublished ? <Check className="h-3 w-3" /> : idx + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {activityModalOpen && currentActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A2B3D]/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-[500px] bg-white rounded-[16px] shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-[#E4EAF1]">
              <div className="flex items-center gap-2">
                {currentActivity.type === "transfer" && <Clock3 className="h-4 w-4 text-[#2E7CF6]" />}
                {currentActivity.type === "sightseeing" && <MapPin className="h-4 w-4 text-[#10B981]" />}
                {currentActivity.type === "hotel" && <ImagePlus className="h-4 w-4 text-[#8B5CF6]" />}
                {currentActivity.type === "meal" && <Utensils className="h-4 w-4 text-[#F43F5E]" />}
                {currentActivity.type === "other" && <Sparkles className="h-4 w-4 text-[#F59E0B]" />}
                <h3 className="text-[16px] font-bold text-[#1A2B3D]">
                  {!currentActivity.id ? `Add ${currentActivity.type === "other" ? "Activity" : currentActivity.type.charAt(0).toUpperCase() + currentActivity.type.slice(1)}` : 
                   (currentActivity.title ? "Edit Activity" : `Add ${currentActivity.type === "other" ? "Activity" : currentActivity.type.charAt(0).toUpperCase() + currentActivity.type.slice(1)}`)}
                </h3>
              </div>
              <button 
                onClick={() => setActivityModalOpen(false)}
                className="text-[#5A6E82] hover:bg-[#F8FAFC] p-1 rounded-full transition"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-[#1A2B3D]">Activity Type</label>
                  <select 
                    value={currentActivity.type} 
                    onChange={(e) => setCurrentActivity({...currentActivity, type: e.target.value as any})}
                    className="w-full h-10 rounded-lg border border-[#E4EAF1] px-3 text-[13px] bg-white"
                  >
                    <option value="transfer">Transfer</option>
                    <option value="sightseeing">Sightseeing</option>
                    <option value="hotel">Hotel</option>
                    <option value="meal">Meal</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-[#1A2B3D]">Duration / Meta Info</label>
                  <div className="relative">
                    <Clock3 className="absolute left-3 top-2.5 h-4 w-4 text-[#8896A6]" />
                    <Input 
                      placeholder="e.g. 2 hrs, 1 Night" 
                      value={currentActivity.metaInfo || ""} 
                      onChange={(e) => setCurrentActivity({...currentActivity, metaInfo: e.target.value})}
                      className="pl-9 h-10 text-[13px]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-[#1A2B3D]">Title <span className="text-red-500">*</span></label>
                <Input 
                  placeholder={currentActivity.type === 'transfer' ? "Private Transfer Airport to Hotel" : currentActivity.type === 'hotel' ? "Hotel Check-in" : currentActivity.type === 'meal' ? "Lunch Buffet at Resort" : currentActivity.type === 'sightseeing' ? "Guided City Tour" : "Activity Name"} 
                  value={currentActivity.title} 
                  onChange={(e) => setCurrentActivity({...currentActivity, title: e.target.value})}
                  className={cn("h-10 font-medium text-[13px]", !currentActivity.title ? "border-red-200 focus:ring-red-500/20" : "")}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-[#1A2B3D]">Description / Inclusions</label>
                <textarea 
                  placeholder="Add details about what is included or what to expect..." 
                  value={currentActivity.description || ""} 
                  onChange={(e) => setCurrentActivity({...currentActivity, description: e.target.value})}
                  className="w-full min-h-[90px] rounded-lg border border-[#E4EAF1] bg-white px-3 py-2 text-[13px] text-[#1A2B3D] placeholder:text-[#8896A6] focus:border-[#2E7CF6] focus:outline-none focus:ring-2 focus:ring-[#2E7CF6]/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-[#1A2B3D]">Activity Images</label>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  <button 
                    type="button"
                    disabled={isUploading}
                    onClick={() => triggerUpload('activity')}
                    className="w-[80px] h-[80px] shrink-0 rounded-[10px] border border-dashed border-[#C8D2DE] bg-[#F8FAFC] flex flex-col items-center justify-center hover:bg-[#EBF3FE] hover:border-[#2E7CF6] transition text-[#5A6E82] hover:text-[#2E7CF6] disabled:opacity-50"
                  >
                    <ImagePlus className="h-5 w-5 mb-1" />
                    <span className="text-[10px] font-medium">{isUploading && uploadType.type === 'activity' ? '...' : 'Upload'}</span>
                  </button>
                  {currentActivity.images && currentActivity.images.map((img, i) => (
                    <div key={i} className="relative h-[80px] w-[80px] shrink-0 rounded-[10px] overflow-hidden border border-[#E4EAF1] group">
                      <img src={img} alt="" className="h-full w-full object-cover" />
                      <button 
                        onClick={() => setCurrentActivity({...currentActivity, images: currentActivity.images?.filter((_, idx) => idx !== i)})}
                        className="absolute top-1 right-1 hidden group-hover:flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#E4EAF1] bg-[#F8FAFC] rounded-b-[16px] flex justify-end gap-2">
              <Button variant="outline" onClick={() => setActivityModalOpen(false)} className="bg-white border-[#E4EAF1] text-[#5A6E82]">Cancel</Button>
              <Button onClick={saveActivity} disabled={!currentActivity.title} className="bg-[#2E7CF6] hover:bg-[#2569d9] text-white shadow-sm">Save Activity</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ToggleTile({ icon, title, description, active, onToggle }: { icon: React.ReactNode; title: string; description: string; active: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} className={cn("flex w-full items-start gap-2 rounded-[12px] border px-3 py-3 text-left transition", active ? "border-[#2E7CF6] bg-[#EBF3FE]" : "border-[#E4EAF1] bg-white hover:border-[#C8D2DE]")}>
      <div className="mt-[2px]">{icon}</div>
      <div className="flex-1">
        <p className="text-[13px] font-semibold text-[#1A2B3D]">{title}</p>
        <p className="text-[12px] text-[#5A6E82]">{description}</p>
      </div>
      <div className={cn("relative inline-flex h-5 w-9 items-center rounded-full", active ? "bg-[#2E7CF6]" : "bg-[#C8D2DE]")}>
        <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white shadow transition", active ? "translate-x-4" : "translate-x-1")} />
      </div>
    </button>
  )
}

function SwitchRow({ label, sub, checked, onChange }: { label: string; sub: string; checked: boolean; onChange: (next: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-[10px] border border-[#E4EAF1] px-3 py-2.5">
      <div>
        <p className="text-[12px] font-semibold text-[#1A2B3D]">{label}</p>
        <p className="text-[11px] text-[#5A6E82]">{sub}</p>
      </div>
      <button type="button" onClick={() => onChange(!checked)} className={cn("relative inline-flex h-6 w-11 items-center rounded-full transition", checked ? "bg-[#2E7CF6]" : "bg-[#C8D2DE]")}>
        <span className={cn("inline-block h-5 w-5 transform rounded-full bg-white shadow transition", checked ? "translate-x-5" : "translate-x-1")} />
      </button>
    </div>
  )
}

export default CreatePlanPage
