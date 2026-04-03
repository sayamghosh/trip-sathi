import { useEffect, useState } from "react"
import {
  CheckCircle2,
  MapPin,
  Star,
  MoreHorizontal,
  Sparkles,
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
  const recommendedPackages = packages.slice(3, 7)

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
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-[14px] border border-[#E4EAF1] bg-white p-5 shadow-[0_12px_30px_-24px_rgba(26,43,61,0.15)]">
                <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
                  <div className="space-y-4">
                    <div 
                      className="h-48 rounded-xl bg-cover bg-center" 
                      style={{ backgroundImage: `url(${packages[0]?.bannerImages?.[0] || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800'})` }}
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-[#5A6E82]">
                        <MapPin className="h-4 w-4 text-[#2E7CF6]" />
                        <span className="text-sm">{packages[0]?.locations?.join(", ") || "Mainland"}</span>
                      </div>
                      <h3 className="mt-1 text-xl font-semibold text-[#1A2B3D]">{packages[0]?.title || "Select a package"}</h3>
                      <p className="mt-1 text-sm text-[#5A6E82] line-clamp-3">
                        {packages[0]?.description || "Choose a curated travel package to view its full itinerary and details."}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-lg bg-[#F7FAFD] px-3 py-2">
                        <p className="text-[#5A6E82]">Price</p>
                        <p className="text-[20px] font-bold text-[#2E7CF6] font-inter">
                          ₹{packages[0]?.basePrice?.toLocaleString() || "0"}
                        </p>
                        <p className="text-xs text-[#5A6E82]">per person</p>
                      </div>
                      <div className="rounded-lg bg-[#F7FAFD] px-3 py-2">
                        <p className="text-[#5A6E82]">Duration</p>
                        <p className="text-[20px] font-bold text-[#1A2B3D]">
                          {heroPackage?.durationDays || "0"} Days / {Math.max((heroPackage?.durationDays || 1) - 1, 0)} Nights
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-12 w-12 rounded-xl bg-[#E6F1FF]" />
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      {packages[0]?._id ? (
                        <>
                          <Link to="/packages/$packageId" params={{ packageId: packages[0]._id }}>
                            <Button className="h-10 px-6 rounded-lg bg-[#2E7CF6] text-white shadow-sm hover:bg-[#2569d9]">
                              View details
                            </Button>
                          </Link>
                          <Link to="/plans/edit/$packageId" params={{ packageId: packages[0]._id }}>
                            <Button variant="outline" className="h-10 px-4 border-[#E4EAF1] text-[#1A2B3D]">
                              Edit Detail
                            </Button>
                          </Link>
                          <Button 
                            onClick={async () => {
                              if (window.confirm("Are you sure you want to delete this package?")) {
                                try {
                                  await api.delete(`/api/tour-plans/${packages[0]._id}`)
                                  alert("Package deleted")
                                  window.location.reload()
                                } catch (e) {
                                  alert("Delete failed")
                                }
                              }
                            }}
                            variant="ghost" 
                            className="h-10 px-3 text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </Button>
                        </>
                      ) : (
                        <Button disabled className="h-10 rounded-lg bg-[#2E7CF6]/60 text-white">
                          View details
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[15px] font-semibold text-[#1A2B3D]">Inclusions</h4>
                    <div className="space-y-2">
                      {featureList.map((item) => (
                        <div
                          key={item.title}
                          className="flex gap-3 rounded-lg border border-[#E4EAF1] bg-[#F9FBFD] px-3 py-2"
                        >
                          <CheckCircle2 className="mt-[2px] h-4 w-4 text-[#2E7CF6]" />
                          <div>
                            <p className="text-sm font-semibold text-[#1A2B3D]">{item.title}</p>
                            <p className="text-xs text-[#5A6E82]">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[14px] border border-[#E4EAF1] bg-white p-4 shadow-[0_12px_30px_-24px_rgba(26,43,61,0.12)]">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-[15px] font-semibold text-[#1A2B3D]">Popular Packages</h4>
                  <MoreHorizontal className="h-5 w-5 text-[#5A6E82]" />
                </div>
                <div className="space-y-3">
                  {popularPackages.map((pkg) => (
                    <div key={pkg.title} className="flex items-start justify-between rounded-lg bg-[#F9FBFD] px-3 py-2">
                      <div>
                        <p className="text-sm font-semibold text-[#1A2B3D]">{pkg.title}</p>
                        <p className="text-xs text-[#5A6E82]">{pkg.location}</p>
                      </div>
                      <div className="flex items-center gap-1 text-[#F7B500]">
                        <Star className="h-4 w-4 fill-[#F7B500]" />
                        <span className="text-sm font-semibold text-[#1A2B3D]">{pkg.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[14px] border border-dashed border-[#C8D2DE] bg-[#F4F7FB] p-4 text-center">
                <p className="text-sm font-semibold text-[#1A2B3D]">Enhance your packages</p>
                <p className="mt-1 text-xs text-[#5A6E82]">Add upsells and loyalty perks for returning travelers.</p>
                <Button variant="secondary" className="mt-3 bg-white text-[#2E7CF6] shadow-none" asChild>
                  <Link to="/plans/create">Upgrade now</Link>
                </Button>
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
                    <div className="rounded-[14px] border border-[#E4EAF1] bg-white p-4 shadow-[0_12px_30px_-24px_rgba(26,43,61,0.15)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-24px_rgba(26,43,61,0.2)]">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2 text-[#5A6E82]">
                            <Star className="h-4 w-4 fill-[#F7B500] text-[#F7B500]" />
                            <span className="text-sm font-semibold text-[#1A2B3D]">4.5</span>
                            <span className="text-xs">  {pkg.durationDays} Days / {Math.max(pkg.durationDays - 1, 0)} Nights</span>
                            <span className="text-xs">  {pkg.locations?.join(", ")}</span>
                          </div>
                          <h4 className="text-[18px] font-semibold text-[#1A2B3D]">{pkg.title}</h4>
                        </div>
                          <div className="text-right flex flex-col items-end gap-1">
                            <p className="text-[12px] uppercase text-[#5A6E82]">from</p>
                            <p className="text-xl font-bold text-[#2E7CF6]">₹{pkg.basePrice?.toLocaleString()}</p>
                            <p className="text-xs text-[#5A6E82]">per person</p>
                          <div className="mt-2 flex items-center gap-2">
                             <Link to="/plans/edit/$packageId" params={{ packageId: pkg._id }}>
                               <Button variant="ghost" size="sm" className="h-7 px-2 text-[#2E7CF6] text-xs">Edit</Button>
                             </Link>
                             <Button 
                               onClick={async (e) => {
                                 e.preventDefault();
                                 if (window.confirm("Delete this package?")) {
                                   try {
                                     await api.delete(`/api/tour-plans/${pkg._id}`)
                                     window.location.reload()
                                   } catch (e) {
                                     alert("Delete failed")
                                   }
                                 }
                               }}
                               variant="ghost" 
                               size="sm" 
                               className="h-7 px-2 text-red-500 text-xs"
                             >
                               Delete
                             </Button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 rounded-lg border border-dashed border-[#E4EAF1] bg-[#FBFDFF] p-3 text-xs text-slate-500 line-clamp-2 italic">
                        {pkg.description}
                      </div>
                    </div>
                  )

                  return pkg._id ? (
                    <Link key={pkg._id} to="/packages/$packageId" params={{ packageId: pkg._id }} className="block">
                      {card}
                    </Link>
                  ) : (
                    <div key={pkg.title}>{card}</div>
                  )
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-semibold text-[#1A2B3D]">Recommended Packages</h3>
                <MoreHorizontal className="h-5 w-5 text-[#5A6E82]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {recommendedPackages.map((pkg) => {
                  const card = (
                    <div className="rounded-[14px] border border-[#E4EAF1] bg-white p-3 shadow-[0_12px_30px_-24px_rgba(26,43,61,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-24px_rgba(26,43,61,0.18)]">
                      <div 
                        className="flex h-20 items-center justify-center rounded-lg bg-cover bg-center text-[#2E7CF6]"
                        style={{ backgroundImage: `url(${pkg.bannerImages?.[0] || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=200'})` }}
                      >
                        {!pkg.bannerImages?.[0] && <PlaneTakeoff className="h-5 w-5" />}
                      </div>
                      <p className="mt-2 text-sm font-semibold text-[#1A2B3D] truncate">{pkg.title}</p>
                      <p className="text-xs text-[#5A6E82] truncate">{pkg.locations?.join(", ") || "Various"}</p>
                      <p className="mt-1 text-sm font-bold text-[#2E7CF6]">
                        ₹{pkg.basePrice?.toLocaleString()} <span className="text-xs font-normal text-[#5A6E82]">/person</span>
                      </p>
                    </div>
                  )

                  return pkg._id ? (
                    <Link key={pkg._id} to="/packages/$packageId" params={{ packageId: pkg._id }} className="block">
                      {card}
                    </Link>
                  ) : (
                    <div key={pkg.title}>{card}</div>
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
