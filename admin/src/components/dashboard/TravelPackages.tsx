import { useQuery } from "@tanstack/react-query"
import { MapPin, PlaneTakeoff } from "lucide-react"
import { Link } from "@tanstack/react-router"
import api from "@/lib/axios"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-semibold">Travel Packages</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link to="/packages">View All</Link>
        </Button>
      </CardHeader>

      <CardContent>
        {latest.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground">No packages published yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {latest.map((p) => (
              <Link
                key={p._id}
                to="/packages/$packageId"
                params={{ packageId: p._id }}
                className="group overflow-hidden rounded-lg border border-border transition hover:shadow-md"
              >
                <div
                  className="relative flex h-24 items-center justify-center bg-accent bg-cover bg-center"
                  style={p.bannerImages?.[0] ? { backgroundImage: `url(${p.bannerImages[0]})` } : undefined}
                >
                  {!p.bannerImages?.[0] && <PlaneTakeoff className="h-8 w-8 text-primary/30" />}
                </div>

                <div className="px-3 py-2.5">
                  <h4 className="truncate text-xs font-semibold text-foreground">{p.title}</h4>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-2.5 w-2.5 shrink-0" />
                    <span className="truncate">{p.locations?.join(", ") || "Not specified"}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-primary">₹{p.basePrice.toLocaleString('en-IN')}</span>
                      <span className="ml-0.5 text-xs text-muted-foreground">/person</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{p.durationDays}D / {p.durationNights}N</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
