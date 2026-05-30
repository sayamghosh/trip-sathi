import { useState, useEffect } from "react"
import { Link } from "@tanstack/react-router"
import { MetricCards } from "@/components/dashboard/MetricCards"
import { RevenueChart } from "@/components/dashboard/RevenueChart"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { RecentBookings } from "@/components/dashboard/RecentBookings"
import { CalendarWidget } from "@/components/dashboard/CalendarWidget"
import { TopDestinations } from "@/components/dashboard/TopDestinations"
import { Button } from "@/components/ui/button"
import { ShieldAlert, Plus, UserCog } from "lucide-react"

export function Dashboard() {
  const [user, setUser] = useState<any>(() => {
    const storedUser = localStorage.getItem("user")
    return storedUser ? JSON.parse(storedUser) : null
  })

  // Update user state if localStorage changes
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const isPending = user && user.isAuthorized === false

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {isPending && (
        <div className="flex flex-col gap-6 max-w-[1100px] mx-auto w-full py-2">
          {/* Verification Alert Card */}
          <div className="relative overflow-hidden rounded-[24px] border border-border bg-card/40 shadow-xl backdrop-blur-md p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 group">
            {/* Subtle background gradient glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(99,102,241,0.06),transparent_40%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_80%,rgba(245,158,11,0.03),transparent_35%)]" />
            
            {/* Glowing Animated Circle */}
            <div className="relative h-20 w-20 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.1)] transition-transform duration-500 group-hover:scale-105">
              <div className="absolute inset-0 rounded-full animate-ping bg-amber-500/5 opacity-40" />
              <ShieldAlert className="h-9 w-9 text-amber-500 animate-pulse" />
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-3.5 relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                Account Pending Review
              </div>
              <h2 className="text-3xl font-black tracking-tight text-foreground">Welcome to Trip Sathi, {user.name || "Guide"}!</h2>
              <p className="text-[14px] text-muted-foreground leading-relaxed max-w-[760px]">
                Your professional tour guide credentials are under review by our administrator. While pending verification, you can browse around, design travel itineraries, and construct base pricing plans. Your experiences will automatically become eligible for public release once authorized by the admin.
              </p>
            </div>
          </div>

          {/* Onboarding Steps Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            
            {/* Onboarding Step 1 */}
            <div className="relative bg-card/40 border border-border/80 rounded-2xl p-6 shadow-md flex flex-col justify-between gap-5 transition-all duration-300 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/2">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="h-9 w-9 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center font-extrabold text-[15px] text-indigo-400 border border-indigo-500/30">
                    1
                  </div>
                  <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">Profile Detail</span>
                </div>
                <h4 className="font-extrabold text-base text-foreground tracking-tight">Complete Business Profile</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Ensure your registered business telephone registry, physical business coordinates, and bio description are completely filled out.
                </p>
              </div>
              <Button variant="outline" size="sm" asChild className="w-full mt-2 h-10 border-indigo-500/20 hover:border-indigo-500/50 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 shadow-sm transition-all duration-200">
                <Link to="/profile">
                  <UserCog className="mr-2 h-4.5 w-4.5 text-indigo-400" /> Update Profile
                </Link>
              </Button>
            </div>

            {/* Onboarding Step 2 */}
            <div className="relative bg-card/40 border border-border/80 rounded-2xl p-6 shadow-md flex flex-col justify-between gap-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/2">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center font-extrabold text-[15px] text-primary border border-primary/30">
                    2
                  </div>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">Draft Mode</span>
                </div>
                <h4 className="font-extrabold text-base text-foreground tracking-tight">Draft Tour Plans</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Begin drafting your travel itineraries, scheduling locations, daily activity boards, base pricing, and aesthetic galleries.
                </p>
              </div>
              <Button size="sm" asChild className="w-full mt-2 h-10 bg-primary hover:bg-primary/95 text-white shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 font-bold">
                <Link to="/packages/new">
                  <Plus className="mr-1.5 h-4.5 w-4.5" /> Build Tour Package
                </Link>
              </Button>
            </div>

            {/* Onboarding Step 3 */}
            <div className="relative bg-card/40 border border-border/80 rounded-2xl p-6 shadow-md flex flex-col justify-between gap-5 transition-all duration-300 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/2">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="h-9 w-9 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center font-extrabold text-[15px] text-amber-400 border border-amber-500/30">
                    3
                  </div>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">Final Stage</span>
                </div>
                <h4 className="font-extrabold text-base text-foreground tracking-tight">Wait for Verification</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Once our administrator flips your account authorization toggle flag, your drafted packages can be published live in one single click!
                </p>
              </div>
              
              {/* Live pulsing indicator */}
              <div className="flex items-center gap-3 rounded-xl bg-amber-500/5 border border-amber-500/10 p-3 mt-2">
                <div className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Awaiting administrator approval</p>
                  <p className="text-[9px] text-muted-foreground leading-none">Usually completed in under 24 hours.</p>
                </div>
              </div>
            </div>

          </div>
          <div className="h-px bg-border w-full my-4" />
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
