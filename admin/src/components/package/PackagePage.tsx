import { useEffect, useState } from "react"
import {
  CheckCircle2,
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

  const heroPackage = packages[0]
  const featuredPackages = packages.slice(1, 3)
  let recommendedPackages = packages.filter((p: any) => p.isRecommended).slice(0, 4)
  if (recommendedPackages.length === 0) {
    recommendedPackages = packages.slice(3, 7)
  }

  return (
    <div className="space-y-4">
      {/* Top actions */}
      <div className="flex items-center justify-end gap-2 mb-2">
        <Button variant="outline" className="h-9 border-[#E4EAF1] text-[#1A2B3D] bg-white">
          <PlaneTakeoff className="mr-2 h-4 w-4" />
          Import itinerary
        </Button>
        <Link to="/plans/create">
          <Button className="h-9 bg-[#2E7CF6] text-white shadow-sm hover:bg-[#2569d9]">
            + Add package
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-dashed bg-white/50">
          <Loader2 className="h-8 w-8 animate-spin text-[#2E7CF6]" />
        </div>
      ) : (
        <>
          {/* Hero + side column */}
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-[15px] font-semibold text-[#1A2B3D]">New Package</h3>
              <div className="rounded-[14px] border border-[#E4EAF1] bg-white p-5 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-[200px_1.2fr_1fr] lg:grid-cols-[240px_1.2fr_1fr] gap-6">
                  {/* Left Column - Image */}
                  <div className="h-full min-h-[260px] rounded-[10px] bg-[#EBF3FE] relative flex flex-col justify-end p-3 bg-cover bg-center" style={{ backgroundImage: `url(${packages[0]?.bannerImages?.[0] || ''})` }}>
                     {!packages[0]?.bannerImages?.[0] && <div className="absolute inset-0 flex items-center justify-center"><PlaneTakeoff className="h-8 w-8 text-[#2E7CF6]/20" /></div>}
                     <div className="flex items-center gap-2 relative z-10 w-full h-[50px]">
                       <div className="h-full flex-1 rounded bg-white shadow-sm" />
                       <div className="h-full flex-1 rounded bg-white shadow-sm" />
                       <div className="h-full flex-1 rounded bg-white shadow-sm" />
                     </div>
                  </div>

                  {/* Middle Column - Details */}
                  <div className="flex flex-col">
                    <h3 className="text-[22px] font-bold text-[#1A2B3D] leading-tight mb-2">
                       {packages[0]?.title || "Tropical Paradise Retreat"}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#5A6E82] mb-4">
                       <MapPin className="h-3.5 w-3.5" />
                       <span>{packages[0]?.locations?.join(", ") || "Maldives"}</span>
                    </div>
                    <p className="text-[11px] text-[#8896A6] leading-relaxed mb-6 flex-1 pr-4 line-clamp-5">
                       {packages[0]?.description || "Escape to a tropical haven where pristine beaches, lush greenery, and luxurious accommodations await. Perfect for those looking to unwind and experience the ultimate relaxation"}
                    </p>
                    
                    <div className="flex items-end justify-between mb-4">
                       <div>
                         <p className="text-[10px] text-[#A0ABB8] mb-0.5">Price:</p>
                         <p className="text-[22px] font-bold text-[#2E7CF6] font-inter leading-none">
                           ₹{packages[0]?.basePrice?.toLocaleString() || "2,100"}
                         </p>
                         <p className="text-[10px] text-[#5A6E82] mt-0.5">per person</p>
                       </div>
                       <div className="text-right">
                         <p className="text-[10px] text-[#A0ABB8] mb-1">Duration:</p>
                         <p className="text-[11px] font-semibold text-[#1A2B3D]">
                           {heroPackage?.durationDays || "7"} Days / {Math.max((heroPackage?.durationDays || 7) - 1, 0)} Nights
                         </p>
                       </div>
                    </div>

                    <div className="space-y-2 mt-auto">
                      {packages[0]?._id ? (
                        <Link to="/plans/edit/$packageId" params={{ packageId: packages[0]._id }}>
                          <Button className="w-full bg-[#3FB1F5] hover:bg-[#2CA1E6] text-white rounded-lg h-[42px] shadow-none font-semibold">
                            Edit Detail
                          </Button>
                        </Link>
                      ) : (
                        <Button disabled className="w-full bg-[#3FB1F5]/50 text-white rounded-lg h-[42px]">
                          Edit Detail
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Right Column - Inclusions */}
                  <div className="flex flex-col gap-5 py-1">
                    {featureList.map((item) => (
                      <div key={item.title} className="flex gap-2.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#5A6E82] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[11px] font-semibold text-[#1A2B3D] leading-none mb-1.5">{item.title}</p>
                          <p className="text-[10px] text-[#A0ABB8] leading-snug">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-semibold text-[#1A2B3D]">Popular Packages</h3>
                <MoreHorizontal className="h-4 w-4 text-[#8896A6]" />
              </div>
              <div className="space-y-3">
                {popularPackages.map((pkg) => (
                  <div key={pkg.title} className="flex items-center gap-3 rounded-xl bg-white p-2.5 shadow-sm border border-[#E4EAF1]">
                    <div className="h-[46px] w-[50px] shrink-0 rounded-lg bg-[#EBF3FE] flex items-center justify-center text-[#2E7CF6]/20">
                      <PlaneTakeoff className="h-4 w-4" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-[13px] font-bold text-[#1A2B3D] truncate">{pkg.title}</p>
                      <div className="flex items-center gap-1 text-[10px] text-[#8896A6] mt-0.5">
                        <MapPin className="h-2.5 w-2.5" />
                        <span className="truncate">{pkg.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-[#F7B500] shrink-0 pr-1">
                      <Star className="h-2.5 w-2.5 fill-[#F7B500]" />
                      <Star className="h-2.5 w-2.5 fill-[#F7B500]" />
                      <Star className="h-2.5 w-2.5 fill-[#F7B500]" />
                      <Star className="h-2.5 w-2.5 fill-[#F7B500]" />
                      <Star className="h-2.5 w-2.5 fill-[#E4EAF1] text-[#E4EAF1]" />
                      <span className="text-[9px] font-bold text-[#8896A6] ml-1.5">{pkg.rating.toFixed(1)}/5</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div>
          </div>

          {/* Featured + Recommended */}
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-[15px] font-semibold text-[#1A2B3D]">Featured Packages</h3>
              <div className="space-y-3">
                {featuredPackages.map((pkg) => {
                  const card = (
                    <div className="flex flex-col sm:flex-row rounded-[14px] border border-[#E4EAF1] bg-white shadow-sm transition hover:shadow-md overflow-hidden min-h-[220px]">
                      {/* Left Image Section */}
                      <div 
                        className="w-full sm:w-[220px] shrink-0 bg-[#EBF3FE] bg-cover bg-center relative"
                        style={{ backgroundImage: `url(${pkg.bannerImages?.[0] || 'https://images.unsplash.com/photo-1542314831-c6a4d14cd44b?auto=format&fit=crop&w=400&q=80'})` }}
                      >
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-[8px] px-2 py-0.5 flex items-center gap-1 shadow-sm">
                          <Star className="h-3 w-3 fill-[#F7B500] text-[#F7B500]" />
                          <span className="text-[11px] font-bold text-[#1A2B3D]">4.5</span>
                        </div>
                      </div>

                      {/* Right Details Section */}
                      <div className="flex-1 p-5 flex flex-col">
                        {/* Header Row */}
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-[17px] font-bold text-[#1A2B3D]">{pkg.title}</h4>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#5A6E82]">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                <span>{pkg.durationDays} Days / {Math.max(pkg.durationDays - 1, 0)} Nights</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#5A6E82]">
                                <MapPin className="h-3 w-3" />
                                <span>{pkg.locations?.join(", ")}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[18px] font-bold text-[#2E7CF6]">₹{pkg.basePrice?.toLocaleString()}</p>
                            <p className="text-[10px] text-[#8896A6]">per person</p>
                          </div>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-2 flex-1">
                          <div className="space-y-3">
                            <div>
                              <p className="text-[10px] font-medium text-[#A0ABB8] mb-0.5">Accommodation</p>
                              <p className="text-[11px] text-[#1A2B3D] leading-snug">Stay in premium handpicked properties.</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-medium text-[#A0ABB8] mb-0.5">Included Meals</p>
                              <p className="text-[11px] text-[#1A2B3D] leading-snug">Daily breakfast and selected complementary dinners.</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-medium text-[#A0ABB8] mb-0.5">Extras</p>
                              <p className="text-[11px] text-[#1A2B3D] leading-snug">Free airport transfers and 24/7 assistance.</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] font-medium text-[#A0ABB8] mb-1.5">Activities</p>
                            <ul className="list-disc pl-3 text-[11px] text-[#1A2B3D] space-y-1.5 leading-snug">
                              {pkg.days && pkg.days.length > 0 ? (
                                pkg.days.slice(0, 4).map((d: any) => (
                                  <li key={d._id || Math.random()}>{d.title}</li>
                                ))
                              ) : (
                                <>
                                  <li>Curated sightseeing tours</li>
                                  <li>Local immersive experiences</li>
                                  <li>Leisure time for self-exploration</li>
                                </>
                              )}
                            </ul>
                          </div>
                        </div>

                        {/* Actions Row (Spacing only) */}
                        <div className="mt-4 pt-4 border-t border-[#E4EAF1] h-[45px]"></div>
                      </div>
                    </div>
                  )

                  return pkg._id ? (
                    <div key={pkg._id} className="relative group">
                      {card}
                      {/* Full card link overlay */}
                      <Link to="/packages/$packageId" params={{ packageId: pkg._id }} className="absolute inset-0 z-0"></Link>
                      
                      {/* Action Buttons overlay */}
                      <div className="absolute bottom-[21px] right-5 z-20 flex gap-2">
                          <Link to="/plans/edit/$packageId" params={{ packageId: pkg._id }} className="relative z-20">
                            <Button variant="outline" size="sm" className="h-7 text-[11px] px-3 font-medium text-[#2E7CF6] border-[#E4EAF1] bg-white">Edit</Button>
                          </Link>
                          <Button 
                            onClick={async (e) => {
                              e.preventDefault();
                              if (window.confirm("Delete this package?")) {
                                try {
                                  await api.delete(`/api/tour-plans/${pkg._id}`)
                                  window.location.reload()
                                } catch (err) {
                                  alert("Delete failed")
                                }
                              }
                            }}
                            variant="outline" 
                            size="sm" 
                            className="h-7 text-[11px] px-3 font-medium text-[#EF4444] border-red-100 hover:bg-red-50 hover:border-red-200 bg-white relative z-20"
                          >
                            Delete
                          </Button>
                      </div>
                    </div>
                  ) : (
                    <div key={pkg.title}>{card}</div>
                  )
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-semibold text-[#1A2B3D]">Recommended Packages</h3>
                <MoreHorizontal className="h-4 w-4 text-[#8896A6]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {recommendedPackages.map((pkg) => {
                  const card = (
                    <div className="rounded-[14px] border border-[#E4EAF1] bg-white overflow-hidden shadow-sm transition hover:shadow-md h-full flex flex-col">
                      <div 
                        className="h-[140px] w-full bg-[#EBF3FE] bg-cover bg-center flex items-center justify-center text-[#2E7CF6]/20"
                        style={{ backgroundImage: `url(${pkg.bannerImages?.[0] || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=200'})` }}
                      >
                        {!pkg.bannerImages?.[0] && <PlaneTakeoff className="h-8 w-8" />}
                      </div>
                      <div className="p-3.5 flex flex-col flex-1">
                        <h4 className="text-[13px] font-bold text-[#1A2B3D] truncate">{pkg.title}</h4>
                        <div className="flex items-center gap-1 text-[11px] text-[#A0ABB8] mt-1 mb-2">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          <span className="truncate">{pkg.locations?.join(", ") || "Various"}</span>
                        </div>
                        <div className="mt-auto pt-1">
                          <p className="text-[15px] font-bold text-[#2E7CF6]">
                            ₹{pkg.basePrice?.toLocaleString()} <span className="text-[10px] font-medium text-[#8896A6]">/person</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )

                  return pkg._id ? (
                    <Link key={pkg._id} to="/packages/$packageId" params={{ packageId: pkg._id }} className="block h-full">
                      {card}
                    </Link>
                  ) : (
                    <div key={pkg.title} className="h-full">{card}</div>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default PackagePage
