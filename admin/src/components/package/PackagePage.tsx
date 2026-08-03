import { useEffect, useState } from "react"
import {
  MapPin,
  Star,
  MoreHorizontal,
  PlaneTakeoff,
  Loader2,
  Utensils,
  Home,
  Sparkles,
  Waves,
  Leaf,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Link } from "@tanstack/react-router"
import api from "@/lib/axios"
import { cn } from "@/lib/utils"

const featureList = [
  {
    title: "All-Inclusive",
    desc: "Enjoy gourmet meals, drinks, and activities included in your package",
    icon: Utensils,
  },
  {
    title: "Luxury Accommodation",
    desc: "Stay in a private oceanview villa with breathtaking ocean views",
    icon: Home,
  },
  {
    title: "Spa Treatments",
    desc: "Indulge in complementary spa treatments and wellness services",
    icon: Sparkles,
  },
  {
    title: "Water Sports",
    desc: "Access to snorkeling, diving, and other water sports",
    icon: Waves,
  },
  {
    title: "Sustainability",
    desc: "Eco-friendly resort with commitment to local communities",
    icon: Leaf,
  },
]

const popularPackages = [
  { title: "Alpine Escape", location: "Swiss Alps, Switzerland", rating: 4.8 },
  { title: "Caribbean Cruise", location: "Caribbean Islands", rating: 5 },
  { title: "Parisian Romance", location: "Paris, France", rating: 4.5 },
  { title: "Greek Island Hopping", location: "Greece (Santorini and Crete)", rating: 4.5 },
]

function StatusBadge({ isPublic, className }: { isPublic?: boolean; className?: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "uppercase tracking-wider shrink-0",
        isPublic
          ? "bg-success/10 text-success border-success/30"
          : "bg-warning/10 text-warning border-warning/30",
        className
      )}
    >
      {isPublic ? "Published" : "Draft"}
    </Badge>
  )
}

export function PackagePage() {
  const [packages, setPackages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [user] = useState<any>(() => {
    const storedUser = localStorage.getItem("user")
    return storedUser ? JSON.parse(storedUser) : null
  })
  const isAuthorized = user?.isAuthorized === true

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await api.get("/api/tour-plans")
        setPackages(response.data)
      } catch (error) {
        console.error("Error fetching packages:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPackages()
  }, [])

  // Re-map slices
  const source = packages
  const heroPackage = source[0]
  const featuredPackages = source.slice(1, 3)
  let recommendedPackages = source.filter((p: any) => p.isRecommended).slice(0, 4)
  if (recommendedPackages.length === 0 && source.length > 3) {
    recommendedPackages = source.slice(3, 7)
  }

  return (
    <div className="space-y-4">
      {/* Top spacing - Adjusted since global header is present */}
      <div className="pt-2" />

      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-dashed bg-card/50">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Hero + side column */}
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">New Package</h3>
                <Link to="/packages/new">
                  <Button size="sm" className="text-xs font-semibold px-4 shadow-none">
                    + Add Package
                  </Button>
                </Link>
              </div>

              {source.length > 0 ? (
                <Card className="relative group p-5 shadow-sm transition hover:shadow-md">
                  <Link to="/packages/$packageId" params={{ packageId: heroPackage._id }} className="absolute inset-0 z-10" />
                  <div className="grid grid-cols-1 md:grid-cols-[200px_1.2fr_1fr] lg:grid-cols-[240px_1.2fr_1fr] gap-6 relative">
                    {/* Left Column - Image */}
                    <div className="h-full min-h-65 rounded-lg bg-accent relative flex flex-col justify-end p-3 bg-cover bg-center" style={{ backgroundImage: `url(${heroPackage?.bannerImages?.[0] || ""})` }}>
                      {!heroPackage?.bannerImages?.[0] && <div className="absolute inset-0 flex items-center justify-center"><PlaneTakeoff className="h-8 w-8 text-primary/20" /></div>}
                      <div className="flex items-center gap-2 relative z-10 w-full h-12.5">
                        {[1, 2, 3].map((idx) => (
                          <div
                            key={idx}
                            className="h-full flex-1 rounded bg-card/90 shadow-sm bg-cover bg-center border border-white/20 overflow-hidden"
                            style={heroPackage?.bannerImages?.[idx] ? { backgroundImage: `url(${heroPackage.bannerImages[idx]})` } : {}}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Middle Column - Details */}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-2xl font-bold text-foreground leading-tight">
                          {heroPackage?.title || "Tropical Paradise Retreat"}
                        </h3>
                        <StatusBadge isPublic={heroPackage?.isPublic} />
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-secondary-foreground mb-5">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{heroPackage?.locations?.[0] || "Maldives"}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-8 flex-1 pr-6 line-clamp-6">
                        {heroPackage?.description || "Escape to a tropical haven where pristine beaches, lush greenery, and luxurious accommodations await. Perfect for those looking to unwind and experience the ultimate relaxation."}
                      </p>

                      <div className="flex items-end justify-between mb-8 pr-4">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Price:</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-primary leading-none">₹{heroPackage?.basePrice?.toLocaleString() || "2,100"}</span>
                            <span className="text-xs font-medium text-muted-foreground">per person</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium text-muted-foreground mb-1.5">Duration:</p>
                          <p className="text-sm font-bold text-foreground">
                            {heroPackage?.durationDays || "7"} Days / {heroPackage?.durationNights || "6"} Nights
                          </p>
                        </div>
                      </div>

                      <div className="mt-auto relative z-20 flex gap-2 w-full">
                        <Link to="/packages/$packageId/edit" params={{ packageId: heroPackage._id }} className="flex-1">
                          <Button className="w-full h-11 shadow-none text-sm font-bold">
                            Edit Detail
                          </Button>
                        </Link>
                        {isAuthorized && (
                          <Button
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                const targetState = !heroPackage.isPublic
                                await api.patch(`/api/tour-plans/${heroPackage._id}/publish`, { isPublic: targetState })
                                setPackages(prev => prev.map(p => p._id === heroPackage._id ? { ...p, isPublic: targetState } : p))
                                alert(`Package ${targetState ? "published" : "unpublished"} successfully!`)
                              } catch (err: any) {
                                alert(err.response?.data?.message || "Failed to update publication status")
                              }
                            }}
                            variant="outline"
                            className={cn(
                              "h-11 px-4 text-sm font-bold border shrink-0 transition-all",
                              heroPackage?.isPublic
                                ? "border-warning/30 text-warning hover:bg-warning/10"
                                : "border-success/30 text-success hover:bg-success/10 bg-success/5"
                            )}
                          >
                            {heroPackage?.isPublic ? "Unpublish" : "Publish"}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Right Column - Inclusions */}
                    <div className="flex flex-col gap-6 py-2 px-2 bg-secondary/50 rounded-xl">
                      {featureList.map((item) => (
                        <div key={item.title} className="flex gap-3">
                          <div className="h-8 w-8 rounded-lg bg-card flex items-center justify-center shadow-sm text-primary shrink-0">
                            <item.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground leading-none mb-1.5">{item.title}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed pr-2">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ) : (
                <div className="flex h-64 items-center justify-center rounded-xl border border-dashed bg-card">
                  <p className="text-sm text-muted-foreground">No packages found match your search.</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-foreground">Popular Packages</h3>
                  <MoreHorizontal className="h-5 w-5 text-muted-foreground cursor-pointer" />
                </div>
                <div className="space-y-3">
                  {popularPackages.map((pkg) => (
                    <Link key={pkg.title} to="/packages/$packageId" params={{ packageId: "mock-id" }} className="block">
                      <Card className="flex items-center gap-4 p-3 shadow-sm transition hover:shadow-md cursor-pointer h-full flex-row">
                        <div className="h-15 w-15 shrink-0 rounded-xl bg-accent flex items-center justify-center text-primary/20">
                          <PlaneTakeoff className="h-6 w-6" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-bold text-foreground truncate">{pkg.title}</p>
                          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{pkg.location}</span>
                          </div>
                          <div className="flex items-center mt-2">
                            <div className="flex items-center text-warning">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={cn("h-2.75 w-2.75", i < Math.floor(pkg.rating) ? "fill-warning" : "fill-border text-border")} />
                              ))}
                            </div>
                            <span className="text-xs font-bold text-muted-foreground ml-1.5">{pkg.rating.toFixed(1)}/5</span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">Featured Packages</h3>
                <MoreHorizontal className="h-5 w-5 text-muted-foreground cursor-pointer" />
              </div>
              <div className="space-y-3">
                {featuredPackages.map((pkg) => (
                  <div key={pkg._id} className="relative group">
                    <Link to="/packages/$packageId" params={{ packageId: pkg._id }} className="absolute inset-0 z-10" />
                    <Card className="relative flex flex-col sm:flex-row shadow-sm transition hover:shadow-md overflow-hidden min-h-72 p-0 gap-0">
                      <div
                        className="w-full sm:w-80 shrink-0 bg-accent bg-cover bg-center relative"
                        style={{ backgroundImage: `url(${pkg.bannerImages?.[0] || "https://images.unsplash.com/photo-1542314831-c6a4d14cd44b?auto=format&fit=crop&w=400&q=80"})` }}
                      >
                        <Badge className="absolute top-3 right-3 bg-card/90 text-foreground backdrop-blur shadow-sm gap-1">
                          <Star className="h-3 w-3 fill-warning text-warning" />
                          4.5
                        </Badge>
                      </div>
                      <div className="flex-1 p-5 flex flex-col">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h4 className="text-lg font-bold text-foreground">{pkg.title}</h4>
                              <StatusBadge isPublic={pkg.isPublic} />
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center gap-1.5 text-xs font-medium text-secondary-foreground">
                                <Users className="h-3 w-3" />
                                <span>{pkg.durationDays} Days / {pkg.durationNights} Nights</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs font-medium text-secondary-foreground">
                                <MapPin className="h-3 w-3" />
                                <span>{pkg.locations?.join(", ")}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">₹{pkg.basePrice?.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">per person</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-12 gap-y-6 mt-4 flex-1">
                          <div className="space-y-4">
                            <div>
                              <p className="text-xs font-bold text-foreground mb-1.5">Accommodation</p>
                              <p className="text-xs text-secondary-foreground leading-relaxed">Stay in a charming boutique hotel along the Grand Canal</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-foreground mb-1.5">Included Meals</p>
                              <p className="text-xs text-secondary-foreground leading-relaxed">Daily breakfast and one traditional Venetian dinner</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-foreground mb-1.5">Extras</p>
                              <p className="text-xs text-secondary-foreground leading-relaxed">Free airport transfers and a complimentary welcome drink</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground mb-2.5">Activities</p>
                            <ul className="space-y-2 text-xs text-secondary-foreground leading-relaxed">
                              <li className="flex gap-2">
                                <span className="h-1.5 w-1.5 mt-1.5 shrink-0 rounded-full bg-border" />
                                <span>Gondola ride through the canals</span>
                              </li>
                              <li className="flex gap-2">
                                <span className="h-1.5 w-1.5 mt-1.5 shrink-0 rounded-full bg-border" />
                                <span>Guided tour of St. Mark's Basilica and Doge's Palace</span>
                              </li>
                              <li className="flex gap-2">
                                <span className="h-1.5 w-1.5 mt-1.5 shrink-0 rounded-full bg-border" />
                                <span>Visit to the Murano glass-blowing factory</span>
                              </li>
                              <li className="flex gap-2">
                                <span className="h-1.5 w-1.5 mt-1.5 shrink-0 rounded-full bg-border" />
                                <span>Leisure time for exploring local markets and cafes</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-border flex justify-end gap-2 relative z-20">
                          {isAuthorized && (
                            <Button
                              onClick={async (e) => {
                                e.stopPropagation()
                                try {
                                  const targetState = !pkg.isPublic
                                  await api.patch(`/api/tour-plans/${pkg._id}/publish`, { isPublic: targetState })
                                  setPackages(prev => prev.map(p => p._id === pkg._id ? { ...p, isPublic: targetState } : p))
                                  alert(`Package ${targetState ? "published" : "unpublished"} successfully!`)
                                } catch (err: any) {
                                  alert(err.response?.data?.message || "Failed to update publication status")
                                }
                              }}
                              variant="outline"
                              size="sm"
                              className={cn(
                                "h-8 text-xs font-bold border",
                                pkg.isPublic
                                  ? "border-warning/30 text-warning hover:bg-warning/10"
                                  : "border-success/30 text-success hover:bg-success/10 bg-success/5"
                              )}
                            >
                              {pkg.isPublic ? "Unpublish" : "Publish"}
                            </Button>
                          )}
                          <Link to="/packages/$packageId/edit" params={{ packageId: pkg._id }}>
                            <Button variant="outline" size="sm" className="h-8 text-xs text-primary">Edit</Button>
                          </Link>
                          <Button
                            onClick={async (e) => {
                              e.stopPropagation() // Prevent card click
                              if (window.confirm("Delete this package?")) {
                                try {
                                  await api.delete(`/api/tour-plans/${pkg._id}`)
                                  window.location.reload()
                                } catch (err) {
                                  alert("Delete failed")
                                }
                              }
                            }}
                            variant="outline" size="sm" className="h-8 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">Recommended Packages</h3>
                <MoreHorizontal className="h-5 w-5 text-muted-foreground cursor-pointer" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {recommendedPackages.map((pkg) => (
                  <Link key={pkg._id} to="/packages/$packageId" params={{ packageId: pkg._id }} className="block h-full">
                    <Card className="overflow-hidden shadow-sm transition hover:shadow-md h-full flex flex-col p-2 gap-0">
                      <div
                        className="h-35 w-full bg-accent bg-cover bg-center rounded-lg flex items-center justify-center text-primary/20"
                        style={{ backgroundImage: `url(${pkg.bannerImages?.[0] || ""})` }}
                      >
                        {!pkg.bannerImages?.[0] && <PlaneTakeoff className="h-8 w-8" />}
                      </div>
                      <div className="p-2.5 flex flex-col flex-1">
                        <div className="flex items-center justify-between gap-2 overflow-hidden mb-1">
                          <h4 className="text-sm font-bold text-foreground truncate flex-1">{pkg.title}</h4>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs uppercase tracking-wider shrink-0 px-1.5",
                              pkg.isPublic
                                ? "bg-success/10 text-success border-success/30"
                                : "bg-warning/10 text-warning border-warning/30"
                            )}
                          >
                            {pkg.isPublic ? "Pub" : "Draft"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mt-1.5 mb-3">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{pkg.locations?.[0] || "Location"}</span>
                        </div>
                        <div className="mt-auto pt-1">
                          <p className="text-base font-bold text-primary">
                            ₹{pkg.basePrice?.toLocaleString()} <span className="text-xs font-medium text-muted-foreground">/person</span>
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default PackagePage
