import { MetricCards } from "@/components/dashboard/MetricCards"
import { RevenueChart } from "@/components/dashboard/RevenueChart"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { RecentBookings } from "@/components/dashboard/RecentBookings"
import { CalendarWidget } from "@/components/dashboard/CalendarWidget"
import { TopDestinations } from "@/components/dashboard/TopDestinations"

export function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
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
