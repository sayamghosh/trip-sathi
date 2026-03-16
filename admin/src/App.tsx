import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import { MetricCards } from "@/components/dashboard/MetricCards"
import { RevenueChart } from "@/components/dashboard/RevenueChart"
import { TopDestinations } from "@/components/dashboard/TopDestinations"
import { TotalTrips } from "@/components/dashboard/TotalTrips"
import { Messages } from "@/components/dashboard/Messages"
import { TravelPackages } from "@/components/dashboard/TravelPackages"
import { RecentBookings } from "@/components/dashboard/RecentBookings"
import { CalendarWidget } from "@/components/dashboard/CalendarWidget"
import { UpcomingTrips } from "@/components/dashboard/UpcomingTrips"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { Footer } from "@/components/dashboard/Footer"

export function App() {
  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      {/* Left Sidebar - fixed 175px */}
      <Sidebar />

      {/* Everything right of sidebar */}
      <div className="flex min-h-screen flex-1 flex-col" style={{ marginLeft: 175 }}>


        {/* Header row - full width */}
        <div className="flex items-center justify-between px-5 pt-4 pb-0">
          <h1 className="text-[20px] font-bold text-[#1A2B3D]">Dashboard</h1>
          <TopBar />
        </div>

        {/* Middle: center content + right panel */}
        <div className="flex flex-1">
          {/* Center scrollable content */}
          <main className="flex-1 space-y-4 overflow-y-auto px-5 pt-4 pb-0">
            <MetricCards />

            {/* Charts: Revenue + Destinations */}
            <div className="grid grid-cols-2 gap-4">
              <RevenueChart />
              <TopDestinations />
            </div>

            {/* Total Trips + Messages */}
            <div className="grid grid-cols-2 gap-4">
              <TotalTrips />
              <Messages />
            </div>

            {/* Travel Packages */}
            <TravelPackages />

            {/* Recent Bookings */}
            <RecentBookings />
          </main>

          {/* Right Panel - fixed 270px */}
          <aside
            className="shrink-0 overflow-y-auto border-l border-[#E4EAF1] bg-white px-3 py-4"
            style={{ width: 270 }}
          >
            <div className="space-y-3">
              <CalendarWidget />
              <UpcomingTrips />
              <RecentActivity />
            </div>
          </aside>
        </div>

        {/* Footer - full width spanning center + right panel */}
        <Footer />
      </div>
    </div>
  )
}

export default App
