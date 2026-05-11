import { useState, useEffect } from "react"
import { MetricCards } from "@/components/dashboard/MetricCards"
import { RevenueChart } from "@/components/dashboard/RevenueChart"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { RecentBookings } from "@/components/dashboard/RecentBookings"
import { CalendarWidget } from "@/components/dashboard/CalendarWidget"
import { TopDestinations } from "@/components/dashboard/TopDestinations"
import { Link } from "@tanstack/react-router"
import { LogIn } from "lucide-react"

export function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = localStorage.getItem("user")
    setIsAuthenticated(!!user)
    setIsLoading(false)
  }, [])

  if (isLoading) return null

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center p-8 bg-card/50 rounded-3xl border border-dashed border-border backdrop-blur-sm">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
          <LogIn className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tight text-foreground">Welcome to TripSathi Admin</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Please sign in to your administrator account to view the dashboard metrics, bookings, and analytics.
          </p>
        </div>
        <Link
          to="/login"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-10 text-[15px] font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 active:scale-95"
        >
          Sign In to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
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
