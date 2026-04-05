import { useEffect, useState } from "react"
import {
  MapPin,
  Star,
  MoreHorizontal,
  PlaneTakeoff,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "@tanstack/react-router"
import api from "@/lib/axios"

const featureList = [
  {
    title: "All-Inclusive",
    desc: "Enjoy gourmet meals, drinks, and activities included in your package",
  },
  {
    title: "Luxury Accommodation",
    desc: "Stay in a private oceanview villa with breathtaking ocean views",
  },
  {
    title: "Spa Treatments",
    desc: "Indulge in complementary spa treatments and wellness services",
  },
  {
    title: "Water Sports",
    desc: "Access to snorkeling, diving, and other water sports",
  },
  {
    title: "Sustainability",
    desc: "Eco-friendly resort with commitment to local communities",
  },
]

const popularPackages = [
  { title: "Alpine Escape", location: "Swiss Alps, Switzerland", rating: 4.8 },
  { title: "Caribbean Cruise", location: "Caribbean Islands", rating: 5 },
  { title: "Parisian Romance", location: "Paris, France", rating: 4.5 },
  { title: "Greek Island Hopping", location: "Greece (Santorini and Crete)", rating: 4.5 },
]

export function PackagePage() {
  const [packages, setPackages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
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
                <h3 className="text-[17px] font-bold text-foreground">New Package</h3>
                <Link to="/plans/create">
                    <Button className="h-[34px] bg-primary hover:bg-primary/90 text-white text-[12px] font-semibold px-4 rounded-lg shadow-none">
                      + Add Package
                    </Button>
                  </Link>
              </div>
              
              {source.length > 0 ? (
                <div className="relative group rounded-[14px] border border-border bg-card p-5 shadow-sm transition hover:shadow-md">
                  <Link to="/packages/$packageId" params={{ packageId: heroPackage._id }} className="absolute inset-0 z-10" />
                  <div className="grid grid-cols-1 md:grid-cols-[200px_1.2fr_1fr] lg:grid-cols-[240px_1.2fr_1fr] gap-6 relative">
                    {/* Left Column - Image */}
                    <div className="h-full min-h-[260px] rounded-[10px] bg-accent relative flex flex-col justify-end p-3 bg-cover bg-center" style={{ backgroundImage: `url(${heroPackage?.bannerImages?.[0] || ""})` }}>
                      {!heroPackage?.bannerImages?.[0] && <div className="absolute inset-0 flex items-center justify-center"><PlaneTakeoff className="h-8 w-8 text-primary/20" /></div>}
                      <div className="flex items-center gap-2 relative z-10 w-full h-[50px]">
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
                      <h3 className="text-[26px] font-bold text-foreground leading-tight mb-2">
                        {heroPackage?.title || "Tropical Paradise Retreat"}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[12px] font-medium text-secondary-foreground mb-5">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{heroPackage?.locations?.[0] || "Maldives"}</span>
                      </div>
                      <p className="text-[12px] text-muted-foreground leading-[1.6] mb-8 flex-1 pr-6 line-clamp-6">
                        {heroPackage?.description || "Escape to a tropical haven where pristine beaches, lush greenery, and luxurious accommodations await. Perfect for those looking to unwind and experience the ultimate relaxation."}
                      </p>
                      
                      <div className="flex items-end justify-between mb-8 pr-4">
                        <div>
                          <p className="text-[11px] font-medium text-muted-foreground/60 mb-1">Price:</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-[28px] font-bold text-primary leading-none">₹{heroPackage?.basePrice?.toLocaleString() || "2,100"}</span>
                            <span className="text-[11px] font-medium text-muted-foreground">per person</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] font-medium text-muted-foreground/60 mb-1.5">Duration:</p>
                          <p className="text-[13px] font-bold text-foreground">
                            {heroPackage?.durationDays || "7"} Days / {heroPackage?.durationNights || "6"} Nights
                          </p>
                        </div>
                      </div>
 
                      <div className="mt-auto relative z-20">
                        <Link to="/plans/edit/$packageId" params={{ packageId: heroPackage._id }}>
                          <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-[10px] h-12 shadow-none text-[15px] font-bold">
                            Edit Detail
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Right Column - Inclusions */}
                    <div className="flex flex-col gap-6 py-2 px-2 bg-secondary/50 rounded-xl">
                      {featureList.map((item) => (
                        <div key={item.title} className="flex gap-3">
                          <div className="h-8 w-8 rounded-lg bg-card flex items-center justify-center shadow-sm text-primary shrink-0">
                            {item.title === "All-Inclusive" && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 14h18M5 14v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7M9 9l3 3 3-3"/><path d="M12 12V3"/></svg>}
                            {item.title === "Luxury Accommodation" && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
                            {item.title === "Spa Treatments" && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10 10-4.48 10-10z"/><path d="M7 12h10M12 7v10"/></svg>}
                            {item.title === "Water Sports" && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-2 6-2 6 2 10 2 4-2 4-2M2 18s3-2 6-2 6 2 10 2 4-2 4-2"/></svg>}
                            {item.title === "Sustainability" && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12s4.48-10 10-10z"/><path d="M12 6l3 3-3 3M9 6h3"/></svg>}
                          </div>
                          <div>
                            <p className="text-[12px] font-bold text-foreground leading-none mb-1.5">{item.title}</p>
                            <p className="text-[11px] text-muted-foreground/60 leading-[1.4] pr-2">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center rounded-[14px] border border-dashed bg-card">
                   <p className="text-[14px] text-muted-foreground">No packages found match your search.</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-[17px] font-bold text-foreground">Popular Packages</h3>
                  <MoreHorizontal className="h-5 w-5 text-muted-foreground cursor-pointer" />
                </div>
                <div className="space-y-3">
                  {popularPackages.map((pkg) => (
                    <Link key={pkg.title} to="/packages/$packageId" params={{ packageId: "mock-id" }} className="block">
                      <div className="flex items-center gap-4 rounded-[14px] bg-card p-3 shadow-sm border border-border transition hover:shadow-md cursor-pointer h-full">
                        <div className="h-[60px] w-[60px] shrink-0 rounded-xl bg-accent flex items-center justify-center text-primary/20">
                          <PlaneTakeoff className="h-6 w-6" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-[14px] font-bold text-foreground truncate">{pkg.title}</p>
                          <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{pkg.location}</span>
                          </div>
                          <div className="flex items-center mt-2">
                            <div className="flex items-center text-[#F7B500]">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-[11px] w-[11px] ${i < Math.floor(pkg.rating) ? 'fill-[#F7B500]' : 'fill-border text-border'}`} />
                              ))}
                            </div>
                            <span className="text-[10px] font-bold text-muted-foreground ml-1.5">{pkg.rating.toFixed(1)}/5</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[17px] font-bold text-foreground">Featured Packages</h3>
                <MoreHorizontal className="h-5 w-5 text-muted-foreground cursor-pointer" />
              </div>
              <div className="space-y-3">
                {featuredPackages.map((pkg) => {
                  const card = (
                    <div className="flex flex-col sm:flex-row rounded-[14px] border border-border bg-card shadow-sm transition hover:shadow-md overflow-hidden min-h-[220px]">
                      <div
                        className="w-full sm:w-[220px] shrink-0 bg-accent bg-cover bg-center relative"
                        style={{ backgroundImage: `url(${pkg.bannerImages?.[0] || "https://images.unsplash.com/photo-1542314831-c6a4d14cd44b?auto=format&fit=crop&w=400&q=80"})` }}
                      >
                        <div className="absolute top-3 right-3 bg-card/90 backdrop-blur rounded-[8px] px-2 py-0.5 flex items-center gap-1 shadow-sm">
                          <Star className="h-3 w-3 fill-[#F7B500] text-[#F7B500]" />
                          <span className="text-[11px] font-bold text-foreground">4.5</span>
                        </div>
                      </div>
                      <div className="flex-1 p-5 flex flex-col">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-[17px] font-bold text-foreground">{pkg.title}</h4>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center gap-1.5 text-[11px] font-medium text-secondary-foreground">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                <span>{pkg.durationDays} Days / {pkg.durationNights} Nights</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[11px] font-medium text-secondary-foreground">
                                <MapPin className="h-3 w-3" />
                                <span>{pkg.locations?.join(", ")}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[18px] font-bold text-primary">₹{pkg.basePrice?.toLocaleString()}</p>
                            <p className="text-[10px] text-muted-foreground">per person</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-12 gap-y-6 mt-4 flex-1">
                           <div className="space-y-4">
                             <div>
                               <p className="text-[12px] font-bold text-foreground mb-1.5">Accommodation</p>
                               <p className="text-[11px] text-secondary-foreground leading-relaxed">Stay in a charming boutique hotel along the Grand Canal</p>
                             </div>
                             <div>
                               <p className="text-[12px] font-bold text-foreground mb-1.5">Included Meals</p>
                               <p className="text-[11px] text-secondary-foreground leading-relaxed">Daily breakfast and one traditional Venetian dinner</p>
                             </div>
                             <div>
                               <p className="text-[12px] font-bold text-foreground mb-1.5">Extras</p>
                               <p className="text-[11px] text-secondary-foreground leading-relaxed">Free airport transfers and a complimentary welcome drink</p>
                             </div>
                           </div>
                           <div>
                             <p className="text-[12px] font-bold text-foreground mb-2.5">Activities</p>
                             <ul className="space-y-2 text-[11px] text-secondary-foreground leading-relaxed">
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
                           <Link to="/plans/edit/$packageId" params={{ packageId: pkg._id }}>
                             <Button variant="outline" size="sm" className="h-8 text-[11px] text-[#2E7CF6]">Edit</Button>
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
                              variant="outline" size="sm" className="h-8 text-[11px] text-red-500 border-red-100 hover:bg-red-50"
                           >
                             Delete
                           </Button>
                        </div>
                      </div>
                    </div>
                  )

                  return (
                    <div key={pkg._id} className="relative group">
                       <Link to="/packages/$packageId" params={{ packageId: pkg._id }} className="absolute inset-0 z-10" />
                       <div className="relative">
                        {card}
                       </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[17px] font-bold text-foreground">Recommended Packages</h3>
                <MoreHorizontal className="h-5 w-5 text-muted-foreground cursor-pointer" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {recommendedPackages.map((pkg) => (
                  <Link key={pkg._id} to="/packages/$packageId" params={{ packageId: pkg._id }} className="block h-full">
                    <div className="rounded-[16px] border border-border bg-card overflow-hidden shadow-sm transition hover:shadow-md h-full flex flex-col p-2">
                      <div
                        className="h-[140px] w-full bg-accent bg-cover bg-center rounded-xl flex items-center justify-center text-primary/20"
                        style={{ backgroundImage: `url(${pkg.bannerImages?.[0] || ""})` }}
                      >
                        {!pkg.bannerImages?.[0] && <PlaneTakeoff className="h-8 w-8" />}
                      </div>
                      <div className="p-2.5 flex flex-col flex-1">
                        <h4 className="text-[14px] font-bold text-foreground truncate">{pkg.title}</h4>
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground mt-1.5 mb-3">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{pkg.locations?.[0] || "Location"}</span>
                        </div>
                        <div className="mt-auto pt-1">
                          <p className="text-[16px] font-bold text-primary">
                            ₹{pkg.basePrice?.toLocaleString()} <span className="text-[11px] font-medium text-muted-foreground">/person</span>
                          </p>
                        </div>
                      </div>
                    </div>
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
