import React, { useMemo, useState } from "react"
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
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface ItineraryItem {
  day: number
  title: string
  detail: string
}

const defaultItinerary: ItineraryItem[] = [
  {
    day: 1,
    title: "Arrival & City Stroll",
    detail: "Airport pickup, hotel check-in, evening guided walk through old town with welcome dinner.",
  },
  {
    day: 2,
    title: "Signature Experience",
    detail: "Morning hike to sunrise viewpoint, brunch with locals, afternoon museum pass, night market crawl.",
  },
]

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

export function CreatePlanPage() {
  const [planName, setPlanName] = useState("Bali Discovery Escape")
  const [destination, setDestination] = useState("Bali, Indonesia")
  const [category, setCategory] = useState("Adventure")
  const [startDate, setStartDate] = useState("2026-05-10")
  const [endDate, setEndDate] = useState("2026-05-16")
  const [price, setPrice] = useState(1299)
  const [capacity, setCapacity] = useState(18)
  const [duration, setDuration] = useState(7)
  const [includeFlights, setIncludeFlights] = useState(false)
  const [includeStay, setIncludeStay] = useState(true)
  const [isFeatured, setIsFeatured] = useState(true)
  const [isPublished, setIsPublished] = useState(false)
  const [tags, setTags] = useState<string[]>(["Adventure", "Nature"])
  const [itinerary, setItinerary] = useState<ItineraryItem[]>(defaultItinerary)

  const nights = useMemo(() => Math.max(duration - 1, 1), [duration])
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
        title: "New experience",
        detail: "Describe the activity, inclusions, meeting point, and timing.",
      },
    ])
  }

  const removeDay = (index: number) => {
    setItinerary((prev) => prev.filter((_, i) => i !== index).map((item, i) => ({ ...item, day: i + 1 })))
  }

  const handlePublish = () => {
    setIsPublished(true)
  }

  return (
    <div className="space-y-4">
      {/* Hero header */}
      <div className="rounded-[14px] border border-[#E4EAF1] bg-white px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wide text-[#2E7CF6]">Create travel plan</p>
            <h1 className="text-2xl font-bold text-[#1A2B3D] mt-1">{planName || "New travel plan"}</h1>
            <p className="text-[12px] text-[#5A6E82] mt-1">Publish curated packages with dates, pricing, and a day-by-day itinerary.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 border-[#E4EAF1]">Save draft</Button>
            <Button variant="secondary" size="sm" className="h-9">Preview</Button>
            <Button onClick={handlePublish} size="sm" className="h-9">Publish plan</Button>
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
          <section className="rounded-[14px] border border-[#E4EAF1] bg-white p-5 shadow-[0_12px_30px_-24px_rgba(26,43,61,0.15)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-semibold text-[#1A2B3D]">Itinerary builder</h3>
                <p className="text-[12px] text-[#5A6E82]">Add day-by-day highlights and logistics.</p>
              </div>
              <Button size="sm" variant="outline" onClick={addDay} className="border-[#E4EAF1]">
                <Plus className="h-4 w-4" /> Add day
              </Button>
            </div>

            <div className="space-y-3">
              {itinerary.map((item, index) => (
                <div key={item.day} className="rounded-[12px] border border-[#E4EAF1] bg-[#F8FAFC] p-4">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-white px-2.5 py-1 text-[12px] font-semibold text-[#2E7CF6]">Day {item.day}</span>
                      <Input value={item.title} onChange={(e) => updateItinerary(index, { title: e.target.value })} className="h-9 min-w-[220px]" />
                    </div>
                    <button type="button" onClick={() => removeDay(index)} className="text-[#EF4444] transition hover:text-[#c13232]">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <textarea value={item.detail} onChange={(e) => updateItinerary(index, { detail: e.target.value })} className="w-full rounded-lg border border-[#E4EAF1] bg-white px-3 py-2 text-[13px] text-[#1A2B3D] placeholder:text-[#8896A6] focus:border-[#2E7CF6] focus:outline-none focus:ring-2 focus:ring-[#2E7CF6]/20" rows={3} />
                </div>
              ))}
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
              <div className="col-span-2 flex items-center justify-center rounded-[12px] border border-dashed border-[#C8D2DE] bg-[#F8FAFC] p-6 text-center">
                <div className="space-y-2">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#EBF3FE] text-[#2E7CF6]"><ImagePlus className="h-5 w-5" /></div>
                  <p className="text-[13px] font-semibold text-[#1A2B3D]">Drop cover photo</p>
                  <p className="text-[12px] text-[#5A6E82]">JPG, PNG up to 5MB - 1920x1080 recommended</p>
                  <Button size="sm">Upload cover</Button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map((slot) => (
                  <div key={slot} className="flex flex-1 items-center justify-between rounded-[10px] border border-[#E4EAF1] bg-white px-3 py-2 text-[12px] text-[#5A6E82]">
                    <span>Gallery slot {slot}</span>
                    <Button size="xs" variant="ghost" className="h-7 px-2 text-[11px] text-[#2E7CF6]">Upload</Button>
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
              <SwitchRow label="Accept waitlist" sub="Collect leads when seats fill" checked={capacity <= 0} onChange={() => setCapacity((c) => (c === 0 ? 18 : 0))} />
            </div>

            <div className="mt-4 flex items-center justify-between rounded-[12px] border border-[#E4EAF1] bg-[#F8FAFC] px-3 py-3">
              <div className="space-y-0.5 text-[12px] text-[#5A6E82]">
                <p className="font-semibold text-[#1A2B3D]">Ready to publish?</p>
                <p>{selectedTags || "Add at least one tag"}</p>
              </div>
              <Button size="sm" onClick={handlePublish}>Publish</Button>
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
