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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
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
    <Button type="button" variant="outline" onClick={onClick} className="gap-2 font-medium">
      {icon}
      <span>{label}</span>
    </Button>
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

  const [user] = useState<any>(() => {
    const storedUser = localStorage.getItem("user")
    return storedUser ? JSON.parse(storedUser) : null
  })
  const isAuthorized = user?.isAuthorized === true

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
          setIsPublished(data.isPublic || false)

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
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/10 uppercase tracking-wider">{isEdit ? "Edit Plan" : "Create Plan"}</Badge>
                <span className="h-4 w-px bg-border" />
                <p className="text-xs font-medium text-secondary-foreground">{isEdit ? "Refining an existing experience" : "Crafting a new journey"}</p>
              </div>
              <h1 className="text-2xl font-extrabold text-foreground mt-2 tracking-tight">{planName || (isEdit ? "Loading..." : "Untitled travel plan")}</h1>
              <p className="text-sm text-secondary-foreground mt-1.5 leading-relaxed">{isEdit ? "Review and update every aspect of this curated package." : "Share the unique vibe, itinerary and pricing of your next big tour."}</p>
            </div>
            <div className="flex items-center gap-2.5">
              {isEdit && (
                <Button onClick={handleDelete} variant="ghost" size="sm" className="h-10 text-destructive/80 hover:bg-destructive/10 hover:text-destructive font-semibold">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              )}
              <div className="h-8 w-px bg-border mx-1" />
              {isAuthorized ? (
                <>
                  <Button variant="outline" size="sm" className="h-10 font-semibold px-5">Save Draft</Button>
                  <Button variant="secondary" size="sm" className="h-10 font-semibold px-5">Preview</Button>
                  <Button
                    onClick={handlePublish}
                    disabled={isSubmitting || isUploading}
                    size="sm"
                    className="h-10 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 font-bold px-6 transition-all"
                  >
                    {isSubmitting ? "Processing..." : (isEdit ? "Update Plan" : "Publish Plan")}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handlePublish}
                  disabled={isSubmitting || isUploading}
                  size="sm"
                  className="h-10 bg-warning hover:bg-warning/90 text-warning-foreground font-bold px-6 shadow-md transition-all animate-in fade-in"
                >
                  {isSubmitting ? "Saving Draft..." : (isEdit ? "Update Draft" : "Save Draft")}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main layout */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          {/* Basic details */}
          <Card className="shadow-sm">
            <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
              <div>
                <CardTitle className="text-base font-bold">Plan basics</CardTitle>
                <CardDescription>The foundational details travelers will see first.</CardDescription>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "uppercase tracking-widest",
                  !isAuthorized
                    ? "bg-warning/10 text-warning border-warning/30"
                    : isPublished
                      ? "bg-success/10 text-success border-success/30"
                      : "bg-warning/10 text-warning border-warning/30"
                )}
              >
                {!isAuthorized ? "Draft (Awaiting Auth)" : isPublished ? "Published" : "Draft"}
              </Badge>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-secondary-foreground">Plan Name</Label>
                  <Input value={planName} onChange={(e) => setPlanName(e.target.value)} placeholder="e.g., Alpine Trails & Lakes" className="h-11 bg-secondary/10 focus-visible:bg-background transition-all text-sm font-medium" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-secondary-foreground">Primary Destination</Label>
                  <Input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="City / Country" className="h-11 bg-secondary/10 focus-visible:bg-background transition-all text-sm font-medium" />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-secondary-foreground">Experience Description</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell a story about what makes this trip special..."
                    className="min-h-30 bg-secondary/10 focus-visible:bg-background text-sm leading-relaxed"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-secondary-foreground">Travel Category</Label>
                  <Select value={category} onChange={(e) => setCategory(e.target.value)} className="h-11 bg-secondary/10 text-sm font-medium">
                    <option>Adventure</option>
                    <option>Leisure</option>
                    <option>Cultural</option>
                    <option>Wellness</option>
                    <option>Workcation</option>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-secondary-foreground">Hook Tagline</Label>
                  <Input placeholder="Short punchy line" className="h-11 bg-secondary/10 focus-visible:bg-background transition-all text-sm font-medium" />
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-secondary-foreground">Search Tags</Label>
                <div className="flex flex-wrap gap-2.5 p-4 rounded-xl bg-muted/50 border border-border">
                  {tagOptions.map((tag) => {
                    const active = tags.includes(tag)
                    return (
                      <button key={tag} type="button" onClick={() => toggleTag(tag)} className={cn("rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-200", active ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105" : "border-border bg-card text-secondary-foreground hover:border-primary/50 hover:bg-muted")}>
                        {active && <Check className="mr-1.5 inline h-3.5 w-3.5" />}
                        {tag}
                      </button>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dates & pricing */}
          <Card className="shadow-sm">
            <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
              <div>
                <CardTitle className="text-base font-bold">Dates & pricing</CardTitle>
                <CardDescription>Set global availability, slots and what's included.</CardDescription>
              </div>
              <Badge variant="outline" className="gap-1.5 text-primary bg-primary/5 border-primary/10">
                <Eye className="h-3 w-3" /> LIVE PREVIEW
              </Badge>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-secondary-foreground">Departure Date</Label>
                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/70" />
                    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-11 pl-9 bg-secondary/10 text-sm font-medium" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-secondary-foreground">Return Date</Label>
                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/70" />
                    <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-11 pl-9 bg-secondary/10 text-sm font-medium" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-secondary-foreground">Duration</Label>
                  <div className="relative">
                     <Input type="number" min={1} value={duration} onChange={(e) => setDuration(Number(e.target.value) || 1)} className="h-11 bg-secondary/10 text-sm font-medium pr-12" />
                     <span className="absolute right-4 top-3 text-xs font-bold text-muted-foreground uppercase">Days</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-secondary-foreground">Base Price (INR)</Label>
                  <div className="relative">
                    <IndianRupee className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-success" />
                    <Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value) || 0)} className="h-11 pl-9 pr-20 bg-secondary/10 text-sm font-bold" />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground uppercase">Per Head</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-secondary-foreground">Total Capacity</Label>
                  <div className="relative">
                    <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                    <Input type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value) || 0)} className="h-11 pl-9 pr-16 bg-secondary/10 text-sm font-bold" />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground uppercase">Seats</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-secondary-foreground">Booking Terms</Label>
                  <Select className="h-11 bg-secondary/10 text-sm font-medium">
                    <option>Full payment upfront</option>
                    <option>50% to book, rest on arrival</option>
                    <option>EMI available</option>
                  </Select>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                <ToggleTile title="Stay included" description="Hotels & stays" icon={<Building2 className="h-4 w-4 text-primary" />} active={includeStay} onToggle={() => setIncludeStay((v) => !v)} />
                <ToggleTile title="Flights" description="Airfare handling" icon={<PlaneTakeoff className="h-4 w-4 text-primary" />} active={includeFlights} onToggle={() => setIncludeFlights((v) => !v)} />
                <ToggleTile title="Featured" description="Showcase on home" icon={<Sparkles className="h-4 w-4 text-primary" />} active={isFeatured} onToggle={() => setIsFeatured((v) => !v)} />
              </div>
            </CardContent>
          </Card>

          {/* Itinerary */}
          <Card className="shadow-sm overflow-hidden py-0 gap-0">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-foreground tracking-tight">Day-wise Itinerary</h3>
                <p className="text-xs text-secondary-foreground mt-0.5">Craft the narrative of each day with activities, stays, and meals.</p>
              </div>
              <Button
                type="button"
                onClick={addDay}
                variant="outline"
                size="sm"
                className="h-10 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 font-bold px-5 shadow-sm transition-all"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Next Day
              </Button>
            </div>

            <div className="flex flex-1 min-h-125">
              {/* Sidebar - Minimal List */}
              <div className="w-45 shrink-0 border-r border-border bg-muted/20 p-4 space-y-1 overflow-y-auto">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2 mb-3">Days</p>
                {itinerary.map((day, idx) => {
                  const isActive = idx === activeDayIndex
                  return (
                    <button
                      key={day.day}
                      onClick={() => setActiveDayIndex(idx)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-secondary-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <span>Day {day.day}</span>
                      <span className={cn("text-xs opacity-70", isActive ? "text-primary-foreground" : "text-muted-foreground")}>{day.activities.length}</span>
                    </button>
                  )
                })}
              </div>



              {/* Day Details - Content Area */}
              <div className="flex-1 p-8 bg-background/20 relative">
                {itinerary[activeDayIndex] && (
                  <div className="max-w-200 mx-auto space-y-8">
                    {/* Day Header */}
                    <div className="flex items-start justify-between gap-6 px-1">
                      <div className="space-y-4 flex-1">
                        <div>
                           <h2 className="text-lg font-bold text-foreground">Day Summary</h2>
                           <p className="text-xs text-muted-foreground mt-0.5">Define the main focus for Day {itinerary[activeDayIndex].day}</p>
                        </div>
                        <Input
                          value={itinerary[activeDayIndex].title}
                          onChange={(e) => updateItinerary(activeDayIndex, { title: e.target.value })}
                          placeholder="e.g. Arrival & Evening Dhow Cruise"
                          className="h-11 font-medium text-foreground text-sm bg-muted/30 px-4 transition-all"
                        />
                      </div>
                      {itinerary.length > 1 && (
                        <div className="pt-8">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeDay(activeDayIndex)}
                            className="text-destructive/60 hover:bg-destructive/10 hover:text-destructive rounded-full"
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
                           <h4 className="text-base font-bold text-foreground">Day Content</h4>
                           <p className="text-xs text-muted-foreground mt-0.5">Manage activities for this day</p>
                        </div>
                        <Badge variant="secondary" className="font-bold">{itinerary[activeDayIndex].activities.length} Activities</Badge>
                      </div>



                      {itinerary[activeDayIndex].activities.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center flex flex-col items-center justify-center">
                          <button
                            type="button"
                            onClick={() => openActivityModal(activeDayIndex, "other")}
                            className="h-16 w-16 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-primary/40 hover:text-primary hover:border-primary/40 hover:shadow-md transition-all group mb-4"
                          >
                            <Plus className="h-8 w-8 transition-transform group-hover:rotate-90" />
                          </button>
                          <p className="text-base font-bold text-foreground">Start building Day {activeDayIndex + 1}</p>
                          <p className="text-xs text-muted-foreground mt-1 max-w-70">Add transfers, sightseeing, hotels or meals to create a rich itinerary.</p>
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
                                          <h5 className="text-sm font-bold text-foreground leading-tight">{activity.title || "Untitled Activity"}</h5>
                                          <div className="flex items-center gap-2">
                                             <span className="text-xs font-bold uppercase text-muted-foreground tracking-widest">{activity.type}</span>
                                             {activity.metaInfo && (
                                               <>
                                                 <span className="h-1 w-1 rounded-full bg-border" />
                                                 <span className="text-xs font-medium text-primary/80">{activity.metaInfo}</span>
                                               </>
                                             )}
                                          </div>
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                       <Button variant="ghost" size="sm" onClick={() => openActivityModal(activeDayIndex, activity.type, activity)} className="h-8 px-2 text-xs">Edit</Button>
                                       <Button variant="ghost" size="icon" onClick={() => removeActivity(activeDayIndex, activity.id)} className="h-8 w-8 text-destructive/80 hover:text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                  </div>
                                  {activity.description && <p className="text-sm text-secondary-foreground mt-3 leading-relaxed border-l-2 border-border pl-4 ml-4">{activity.description}</p>}


                                  {activity.images && activity.images.length > 0 && (
                                    <div className="mt-4 flex gap-2 overflow-x-auto pb-2 pl-4 ml-4">
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
                                            className="absolute top-0.5 right-0.5 hidden group-hover/img:flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
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
          </Card>


          {/* Media */}
          <Card className="shadow-sm">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base font-bold">Cover & gallery</CardTitle>
                <CardDescription>Define the visual identity of this tour with a hero cover and supporting media.</CardDescription>
              </div>
              <div className="flex gap-2">
                 <Button variant="outline" size="sm" className="h-8 text-xs">
                    <Sparkles className="mr-1.5 h-3 w-3 text-primary" />
                    AI Enhance
                 </Button>
                 <Button variant="outline" size="sm" className="h-8 text-xs">Manage gallery</Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Full Width Cover Slot */}
              <div
                onDragOver={(e) => handleDrag(e, true, 'banner')}
                onDragLeave={(e) => handleDrag(e, false, 'banner')}
                onDrop={(e) => handleDrop(e, 'banner')}
                className={cn(
                  "group relative w-full h-80 overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 shadow-sm",
                  dragActive?.type === 'banner'
                    ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                    : "border-border bg-muted/20 hover:border-primary/40"
                )}
              >
                {bannerImages[0] ? (
                  <>
                    <img src={bannerImages[0]} alt="Cover" className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
                    <Badge className="absolute top-5 left-5 bg-primary/90 text-primary-foreground shadow-xl backdrop-blur-md border border-white/10">
                      MAIN COVER PHOTO
                    </Badge>
                    <div className="absolute bottom-6 right-6 flex gap-2 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <Button size="sm" variant="secondary" className="h-10 shadow-2xl font-bold px-5" onClick={() => triggerUpload('banner')}>
                        <ImagePlus className="h-4.5 w-4.5" /> Replace Cover
                      </Button>
                      <Button size="icon" variant="destructive" className="h-10 w-10 shadow-2xl" onClick={() => setBannerImages(prev => prev.filter((_, i) => i !== 0))}>
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                    {dragActive?.type === 'banner' && (
                      <div className="absolute inset-0 z-30 flex items-center justify-center bg-primary/20 backdrop-blur-xs">
                        <div className="bg-background px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
                          <ImagePlus className="h-6 w-6 text-primary" />
                          <span className="text-sm font-bold text-primary">Drop to set cover</span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center space-y-5 p-10 text-center bg-secondary/10 relative">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-card text-primary shadow-lg border border-border transition-transform group-hover:scale-110">
                      <ImagePlus className="h-10 w-10" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-bold text-foreground">Upload the main cover photo</p>
                      <p className="mx-auto max-w-80 text-sm text-secondary-foreground leading-relaxed">This image will be the first thing travelers see. High resolution (1920x1080) landscape photos work best.</p>
                    </div>
                    <Button
                      size="sm"
                      disabled={isUploading}
                      onClick={() => triggerUpload('banner')}
                      className="mt-2 px-10 h-11 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all font-bold"
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
                  <h4 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    Gallery Images
                    <Badge variant="secondary" className="rounded-full font-medium">{bannerImages.length > 1 ? bannerImages.length - 1 : 0} / 5</Badge>
                  </h4>
                  <p className="text-xs text-secondary-foreground">Add supporting photos to showcase the itinerary.</p>
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
                        "group relative h-35 w-55 overflow-hidden rounded-xl border transition-all duration-300 shadow-sm",
                        dragActive?.type === 'gallery' && dragActive?.index === idx
                          ? "border-primary bg-primary/5 ring-4 ring-primary/10 scale-105 z-10"
                          : "border-border bg-muted/20 hover:border-primary/40 hover:shadow-xl"
                      )}
                    >
                      <img src={img} alt={`Gallery ${idx + 1}`} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-all duration-300 translate-y-3 group-hover:translate-y-0 group-hover:opacity-100">
                         <button
                            onClick={() => triggerUpload('gallery', idx)}
                            className="rounded-full bg-background/95 p-2.5 text-foreground hover:bg-background shadow-xl hover:scale-110 transition-all"
                            title="Replace image"
                         >
                            <Plus className="h-4.5 w-4.5" />
                         </button>
                         <button
                          onClick={() => setBannerImages(prev => prev.filter((_, i) => i !== idx + 1))}
                          className="rounded-full bg-destructive/95 p-2.5 text-destructive-foreground hover:bg-destructive shadow-xl hover:scale-110 transition-all"
                          title="Delete image"
                         >
                          <Trash2 className="h-4.5 w-4.5" />
                         </button>
                      </div>
                      {dragActive?.type === 'gallery' && dragActive?.index === idx && (
                         <div className="absolute inset-0 z-30 flex items-center justify-center bg-primary/20 backdrop-blur-[1px]">
                            <Plus className="h-8 w-8 text-white" />
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
                        "group flex h-35 w-55 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-all duration-300",
                        dragActive?.type === 'gallery' && dragActive?.index === Math.max(0, bannerImages.length - 1)
                          ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                          : "border-border bg-muted/30 hover:bg-muted/50 hover:border-primary/40 hover:shadow-md"
                      )}
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-card border border-border text-secondary-foreground group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/30 transition-all shadow-sm">
                        <Plus className="h-6 w-6" />
                      </div>
                      <div className="text-center">
                        <span className="block text-xs font-bold text-foreground group-hover:text-primary transition-colors">Add Image</span>
                        <span className="text-xs text-muted-foreground">Supporting media</span>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right column */}
        <div className="space-y-4">
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Launch controls</h3>
                <Badge
                  variant="outline"
                  className={cn(
                    "uppercase",
                    !isAuthorized
                      ? "bg-warning/10 text-warning border-warning/30"
                      : isPublished
                        ? "bg-success/10 text-success border-success/30"
                        : "bg-warning/10 text-warning border-warning/30"
                  )}
                >
                  {!isAuthorized ? "Draft Only" : isPublished ? "Published" : "Draft"}
                </Badge>
              </div>

              <div className="mt-3 space-y-3">
                {isAuthorized ? (
                  <SwitchRow label="Visible to travelers" sub="Listed on search, booking open" checked={isPublished} onChange={setIsPublished} />
                ) : (
                  <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 bg-card opacity-60">
                    <div>
                      <p className="text-xs font-semibold text-foreground">Visible to travelers</p>
                      <p className="text-xs text-warning font-bold">Awaiting authorization</p>
                    </div>
                    <Switch checked={false} disabled />
                  </div>
                )}
                <SwitchRow label="Mark as featured" sub="Show on homepage hero" checked={isFeatured} onChange={setIsFeatured} />
                <SwitchRow label="Recommended Packages" sub="Show in the Recommended section" checked={isRecommended} onChange={setIsRecommended} />
                <SwitchRow label="Accept waitlist" sub="Collect leads when seats fill" checked={capacity <= 0} onChange={() => setCapacity((c) => (c === 0 ? 18 : 0))} />
              </div>

              {isAuthorized ? (
                <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-secondary/50 px-3 py-3">
                  <div className="space-y-0.5 text-xs text-secondary-foreground">
                    <p className="font-semibold text-foreground">Ready to publish?</p>
                    <p>{selectedTags || "Add at least one tag"}</p>
                  </div>
                  <Button size="sm" disabled={isSubmitting || isUploading} onClick={handlePublish}>Publish</Button>
                </div>
              ) : (
                <div className="mt-4 flex flex-col gap-2 rounded-xl border border-border bg-warning/5 p-3">
                  <div className="space-y-0.5 text-xs">
                    <p className="font-bold text-warning">Draft Saving Active</p>
                    <p className="text-warning/90 leading-relaxed">Your account is awaiting review. Your tour will be saved as a draft.</p>
                  </div>
                  <Button
                    size="sm"
                    disabled={isSubmitting || isUploading}
                    onClick={handlePublish}
                    className="w-full bg-warning hover:bg-warning/90 text-warning-foreground font-bold"
                  >
                    {isSubmitting ? "Saving..." : "Save Draft"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center gap-2 text-foreground">
                <Eye className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Listing preview</h3>
              </div>
              <div className="space-y-2 rounded-xl border border-border bg-secondary p-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{destination}</span>
                </div>
                <div className="text-xs text-secondary-foreground">{planName}</div>
                <div className="flex items-center gap-3 text-xs text-secondary-foreground">
                  <span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> {duration} days / {nights} nights</span>
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {capacity} seats</span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <div className="text-xs text-secondary-foreground">
                    {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(startDate))} - {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(endDate))}
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold text-primary">₹{price.toLocaleString("en-IN")}</div>
                    <div className="text-xs text-muted-foreground">per person</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="rounded-full text-primary border-transparent bg-card font-semibold">{tag}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center gap-2 text-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Publish checklist</h3>
              </div>
              <ul className="space-y-2 text-xs text-secondary-foreground">
                {["Cover photo added", "At least 2 itinerary days", "Pricing & seats set", "Tags selected", "Visibility set to published"].map((item, idx) => (
                  <li key={item} className="flex items-center gap-2 rounded-lg border border-border px-2.5 py-2">
                    <span className={cn("flex h-5 w-5 items-center justify-center rounded-full text-xs", idx < 3 || isPublished ? "bg-success/20 text-success" : "bg-warning/20 text-warning")}>{idx < 3 || isPublished ? <Check className="h-3 w-3" /> : idx + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={activityModalOpen && !!currentActivity} onOpenChange={setActivityModalOpen}>
        <DialogContent className="max-w-125">
          {currentActivity && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {currentActivity.type === "transfer" && <Clock3 className="h-4 w-4 text-primary" />}
                  {currentActivity.type === "sightseeing" && <MapPin className="h-4 w-4 text-primary" />}
                  {currentActivity.type === "hotel" && <Building2 className="h-4 w-4 text-primary" />}
                  {currentActivity.type === "meal" && <Utensils className="h-4 w-4 text-primary" />}
                  {currentActivity.type === "other" && <Sparkles className="h-4 w-4 text-primary" />}
                  {!currentActivity.id ? `Add ${currentActivity.type === "other" ? "Activity" : currentActivity.type.charAt(0).toUpperCase() + currentActivity.type.slice(1)}` :
                   (currentActivity.title ? "Edit Activity" : `Add ${currentActivity.type === "other" ? "Activity" : currentActivity.type.charAt(0).toUpperCase() + currentActivity.type.slice(1)}`)}
                </DialogTitle>
              </DialogHeader>

              <div className="px-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Activity Type</Label>
                    <Select
                      value={currentActivity?.type || "other"}
                      onChange={(e) => setCurrentActivity(prev => prev ? { ...prev, type: e.target.value as any } : null)}
                      className="h-10 text-sm"
                    >
                      <option value="transfer">Transfer</option>
                      <option value="sightseeing">Sightseeing</option>
                      <option value="hotel">Hotel</option>
                      <option value="meal">Meal</option>
                      <option value="other">Other</option>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Duration / Meta Info</Label>
                    <div className="relative">
                      <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="e.g. 2 hrs, 1 Night"
                        value={currentActivity?.metaInfo || ""}
                        onChange={(e) => setCurrentActivity(prev => prev ? { ...prev, metaInfo: e.target.value } : null)}
                        className="pl-9 h-10 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Title <span className="text-destructive">*</span></Label>
                  <Input
                    placeholder={currentActivity?.type === 'transfer' ? "Private Transfer Airport to Hotel" : currentActivity?.type === 'hotel' ? "Hotel Check-in" : currentActivity?.type === 'meal' ? "Lunch Buffet at Resort" : currentActivity?.type === 'sightseeing' ? "Guided City Tour" : "Activity Name"}
                    value={currentActivity?.title || ""}
                    onChange={(e) => setCurrentActivity(prev => prev ? { ...prev, title: e.target.value } : null)}
                    className={cn("h-10 font-medium text-sm", !currentActivity?.title ? "border-destructive/40" : "")}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Description / Inclusions</Label>
                  <Textarea
                    placeholder="Add details about what is included or what to expect..."
                    value={currentActivity?.description || ""}
                    onChange={(e) => setCurrentActivity(prev => prev ? { ...prev, description: e.target.value } : null)}
                    className="min-h-22.5 text-sm leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Activity Images</Label>
                  <div
                    onDragOver={(e) => handleDrag(e, true, 'activity')}
                    onDragLeave={(e) => handleDrag(e, false, 'activity')}
                    onDrop={(e) => handleDrop(e, 'activity')}
                    className={cn(
                      "flex gap-3 overflow-x-auto pb-6 pt-2 px-2 min-h-30 border-2 border-dashed transition-all duration-300 rounded-2xl",
                      dragActive?.type === 'activity' ? "border-primary bg-primary/10" : "border-transparent bg-muted/10"
                    )}
                  >
                    {currentActivity?.images && currentActivity.images.map((img, i) => (
                      <div key={i} className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden border border-border group">
                        <img src={img} alt="" className="h-full w-full object-cover" />
                        <button
                          onClick={() => setCurrentActivity(prev => prev ? ({...prev, images: prev.images?.filter((_, idx) => idx !== i)}) : null)}
                          className="absolute top-1 right-1 hidden group-hover:flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-lg"
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
                        "w-20 h-20 shrink-0 rounded-lg border border-dashed transition-all duration-300 flex flex-col items-center justify-center disabled:opacity-50",
                        dragActive?.type === 'activity'
                          ? "border-primary bg-primary/10 scale-105 z-10 shadow-lg"
                          : "border-input bg-secondary/50 text-secondary-foreground hover:bg-accent hover:border-primary hover:text-primary"
                      )}
                    >
                      <ImagePlus className="h-5 w-5 mb-1" />
                      <span className="text-xs font-medium">{isUploading && uploadType.type === 'activity' ? '...' : 'Upload'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setActivityModalOpen(false)} className="font-bold px-5">Cancel</Button>
                <Button onClick={saveActivity} disabled={!currentActivity?.title} className="shadow-lg shadow-primary/20 font-bold px-6">Save Activity</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ToggleTile({ icon, title, description, active, onToggle }: { icon: React.ReactNode; title: string; description: string; active: boolean; onToggle: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onToggle()
        }
      }}
      className={cn("flex w-full cursor-pointer items-start gap-2 rounded-xl border px-3 py-3 text-left transition", active ? "border-primary bg-accent" : "border-border bg-card hover:border-input")}
    >
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-secondary-foreground">{description}</p>
      </div>
      <Switch checked={active} onCheckedChange={onToggle} onClick={(e) => e.stopPropagation()} />
    </div>
  )
}

function SwitchRow({ label, sub, checked, onChange }: { label: string; sub: string; checked: boolean; onChange: (next: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 bg-card">
      <div>
        <p className="text-xs font-semibold text-foreground">{label}</p>
        <p className="text-xs text-secondary-foreground">{sub}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}

export default CreatePlanPage
