import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
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
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        {" "}
        {/* Header row - full width */}
        <header className="flex shrink-0 items-center justify-between gap-2 border-b px-5 py-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>
          <TopBar />
        </header>
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
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App
