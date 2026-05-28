import { MetricCards } from "@/components/dashboard/MetricCards"
import { RevenueChart } from "@/components/dashboard/RevenueChart"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { RecentBookings } from "@/components/dashboard/RecentBookings"
import { CalendarWidget } from "@/components/dashboard/CalendarWidget"
import { TopDestinations } from "@/components/dashboard/TopDestinations"
import { Link } from "@tanstack/react-router"

import { useState, useEffect } from "react"

export function Dashboard() {
  const [user, setUser] = useState(() => {
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  })
  const isPending = user?.verificationStatus === "pending"
  
  const credits = user?.credits ?? 0
  const planExpiresAt = user?.planExpiresAt
  const getDaysRemaining = () => {
    if (!planExpiresAt) return 0
    const diff = new Date(planExpiresAt).getTime() - new Date().getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 0
  }
  const daysRemaining = getDaysRemaining()
  const hasAccess = credits > 0 || daysRemaining > 0
  const isApproved = user?.verificationStatus === "approved"

  useEffect(() => {
    const handleUpdate = () => {
      const userStr = localStorage.getItem("user")
      setUser(userStr ? JSON.parse(userStr) : null)
    }
    window.addEventListener("user-updated", handleUpdate)
    return () => window.removeEventListener("user-updated", handleUpdate)
  }, [])


  return (
    <div className="flex flex-col gap-6">
      {isApproved && !hasAccess && (
        <div className="relative overflow-hidden rounded-3xl border border-red-500/10 bg-linear-to-br from-red-500/10 via-red-500/5 to-transparent p-6 sm:p-8 shadow-sm backdrop-blur-md animate-in slide-in-from-top duration-300">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-red-500/5 blur-3xl" />
          <div className="relative z-10 grid gap-6 md:grid-cols-[auto_1fr_auto] md:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 shadow-sm ring-1 ring-red-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                Display Visibility Suspended
              </div>
              <h2 className="text-[20px] font-extrabold text-foreground tracking-tight sm:text-2xl mt-2">
                Your Tour Plans are Hidden from the Portal
              </h2>
              <p className="text-[13px] font-medium leading-relaxed text-muted-foreground max-w-3xl">
                Every agent needs active display credits or a plan pass to display tour packages on our main marketplace. Since your credits are exhausted and subscription validity is inactive, all your published plans have been temporarily hidden. Please recharge to display them publicly again.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/billing" className="inline-flex h-10.5 items-center justify-center rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-5 shadow-sm shadow-red-950/20 transition-colors">
                Recharge Credits / Pass
              </Link>
            </div>
          </div>
        </div>
      )}

      {isPending && (
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/10 bg-linear-to-br from-amber-500/10 via-amber-500/5 to-transparent p-6 sm:p-8 shadow-sm backdrop-blur-md animate-in slide-in-from-top duration-300">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-amber-500/5 blur-3xl" />
          
          <div className="relative z-10 grid gap-6 md:grid-cols-[auto_1fr_auto] md:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 shadow-sm ring-1 ring-amber-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Pending Verification
              </div>
              <h2 className="text-[20px] font-extrabold text-foreground tracking-tight sm:text-2xl mt-2">
                Your Agent Account is Under Review
              </h2>
              <p className="text-[13px] font-medium leading-relaxed text-muted-foreground max-w-3xl">
                We are validating your phone number and business address. During this phase, you are fully authorized to create tour packages as drafts, customize itineraries, and fill out your profile details. They will instantly become visible to travellers once compliance verification is granted!
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link to="/packages/new" className="inline-flex h-10.5 items-center justify-center rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-5 shadow-sm shadow-amber-950/20 transition-colors">
                + Create Draft Package
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Section */}
      <MetricCards />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Chart Area */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Revenue Overview</h3>
            <div className="h-[350px]">
              <RevenueChart />
            </div>
          </div>
        </div>

        {/* Calendar/Sidebar Area */}
        <div className="flex flex-col gap-6">
          <CalendarWidget />
          <TopDestinations />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentBookings />
        <RecentActivity />
      </div>
    </div>
  )
}

export default Dashboard
