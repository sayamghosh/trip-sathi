import { MetricCards } from "@/components/dashboard/MetricCards"
import { RevenueChart } from "@/components/dashboard/RevenueChart"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { RecentBookings } from "@/components/dashboard/RecentBookings"
import { CalendarWidget } from "@/components/dashboard/CalendarWidget"
import { TopDestinations } from "@/components/dashboard/TopDestinations"
import { TotalTrips } from "@/components/dashboard/TotalTrips"
import { TravelPackages } from "@/components/dashboard/TravelPackages"
import { UpcomingTrips } from "@/components/dashboard/UpcomingTrips"

export function Dashboard() {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px] animate-in fade-in duration-500">
      {/* Main column */}
      <div className="flex flex-col gap-6 min-w-0">
        <MetricCards />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <TopDestinations />
        </div>

        <TotalTrips />
        <TravelPackages />
        <RecentBookings />
      </div>

      {/* Sidebar column */}
      <div className="flex flex-col gap-6 min-w-0">
        <CalendarWidget />
        <UpcomingTrips />
        <RecentActivity />
      </div>
    </div>
  )
}

export default Dashboard
