import { useQuery } from "@tanstack/react-query"
import { MapPin, PlaneTakeoff } from "lucide-react"
import { Link } from "@tanstack/react-router"
import api from "@/lib/axios"

interface TourPlan {
  _id: string
  title: string
  basePrice: number
  durationDays: number
  durationNights: number
  locations: string[]
  bannerImages?: string[]
  createdAt: string
}

export function TravelPackages() {
  const { data: plans = [] } = useQuery<TourPlan[]>({
    queryKey: ['tour-plans', 'mine'],
    queryFn: async () => {
      const { data } = await api.get('/api/tour-plans')
      return data as TourPlan[]
    },
  })

  const latest = [...plans]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  return (
    <div className="rounded-[14px] border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-foreground">
          Travel Packages
        </h3>
        <Link to="/packages" className="rounded-[8px] border border-border px-2.5 py-[4px] text-[11px] font-medium text-muted-foreground transition hover:bg-accent">
          View All
        </Link>
      </div>

      {latest.length === 0 ? (
        <p className="py-6 text-center text-[12px] text-muted-foreground">No packages published yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {latest.map((p) => (
            <Link
              key={p._id}
              to="/packages/$packageId"
              params={{ packageId: p._id }}
              className="group overflow-hidden rounded-[12px] border border-border transition hover:shadow-md"
            >
              <div
                className="relative flex h-[90px] items-center justify-center bg-accent bg-cover bg-center"
                style={p.bannerImages?.[0] ? { backgroundImage: `url(${p.bannerImages[0]})` } : undefined}
              >
                {!p.bannerImages?.[0] && <PlaneTakeoff className="h-8 w-8 text-primary/30" />}
              </div>

              <div className="px-3 py-2.5">
                <h4 className="truncate text-[12px] font-semibold text-foreground">{p.title}</h4>
                <div className="mt-[3px] flex items-center gap-1 text-[10px] text-muted-foreground">
                  <MapPin className="h-[10px] w-[10px] shrink-0" />
                  <span className="truncate">{p.locations?.join(", ") || "Not specified"}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <span className="text-[14px] font-bold text-primary">₹{p.basePrice.toLocaleString('en-IN')}</span>
                    <span className="ml-[2px] text-[9px] text-muted-foreground">/person</span>
                  </div>
                  <span className="text-[9px] text-muted-foreground">{p.durationDays}D / {p.durationNights}N</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
