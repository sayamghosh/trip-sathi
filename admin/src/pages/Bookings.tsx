import { useState, useEffect, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"
import { BookingMetrics } from "@/components/booking/BookingMetrics"
import { TripsOverview } from "@/components/booking/TripsOverview"
import { TopPackages } from "@/components/booking/TopPackages"
import { BookingsTable } from "@/components/booking/BookingsTable"
import { Link } from "@tanstack/react-router"
import { BookCheck } from "lucide-react"

type CallbackStatus = 'pending' | 'positive' | 'negative' | 'contacted'

interface CallbackRequest {
  _id: string
  createdAt?: string
  status: CallbackStatus
  tourPlanId?: {
    title?: string
    basePrice?: number
  }
}

export default function Bookings() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckLoading, setIsCheckLoading] = useState(true)

  useEffect(() => {
    const user = localStorage.getItem("user")
    setIsAuthenticated(!!user)
    setIsCheckLoading(false)
  }, [])

  const { data: bookings = [] } = useQuery<CallbackRequest[]>({
    queryKey: ['callbacks'],
    queryFn: async () => {
      const { data } = await api.get('/api/callbacks/mine')
      return data as CallbackRequest[]
    },
    enabled: isAuthenticated
  })

  const { computedMetrics, computedTrips, computedPackages } = useMemo(() => {
    // 1. Metrics
    const totalBooking = bookings.length;
    const totalParticipants = bookings.length * 2; // Assuming 2 avg
    const totalEarnings = bookings.reduce((sum, b) => sum + (b.tourPlanId?.basePrice || 0), 0);

    const metricsData = [
      {
        title: "Total Booking",
        value: totalBooking.toLocaleString(),
        change: "+0.00%",
        isUp: true,
        color: "#3B82F6",
        chartData: [{ val: 0 }, { val: totalBooking }],
      },
      {
        title: "Total Participants",
        value: totalParticipants.toLocaleString(),
        change: "-0.00%",
        isUp: false,
        color: "#EF4444",
        chartData: [{ val: 0 }, { val: totalParticipants }],
      },
      {
        title: "Total Earnings",
        value: `₹${totalEarnings.toLocaleString()}`,
        change: "+0.00%",
        isUp: true,
        color: "#3B82F6",
        chartData: [{ val: 0 }, { val: totalEarnings }],
      },
    ]

    // 2. Trips Overview (Last 12 months)
    const trips: { month: string; done: number; canceled: number }[] = [];
    for (let i = 11; i >= 0; i--) {
       const d = new Date();
       d.setMonth(d.getMonth() - i);
       const m = d.toLocaleString('default', { month: 'short' });
       const y = d.getFullYear().toString().slice(-2);
       trips.push({ month: `${m} ${y}`, done: 0, canceled: 0 });
    }
    
    bookings.forEach(b => {
      const date = b.createdAt ? new Date(b.createdAt) : new Date();
      const m = date.toLocaleString('default', { month: 'short' });
      const y = date.getFullYear().toString().slice(-2);
      const key = `${m} ${y}`;
      const trip = trips.find(t => t.month === key);
      if (trip) {
         if (b.status === 'positive') trip.done++;
         else if (b.status === 'negative') trip.canceled++;
      }
    });

    // 3. Packages
    const packageCounts: Record<string, number> = {};
    bookings.forEach(b => {
       const name = b.tourPlanId?.title || 'Custom Package';
       packageCounts[name] = (packageCounts[name] || 0) + 1;
    });
    
    let packagesArray = Object.entries(packageCounts)
       .map(([name, count]) => ({ name, count, participants: count * 2, value: 0, color: "" }))
       .sort((a,b) => b.count - a.count)
       .slice(0, 4);
       
    const totalPings = packagesArray.reduce((acc, p) => acc + p.count, 0);
    const colors = ["#1D4ED8", "#3B82F6", "#93C5FD", "#E0E7FF"];
    
    packagesArray.forEach((p, i) => {
       p.value = totalPings === 0 ? 0 : Math.round((p.count / totalPings) * 100);
       p.color = colors[i % colors.length];
    });

    if (packagesArray.length === 0) {
      packagesArray = [{ name: "No data", count: 0, participants: 0, value: 100, color: "#E5E7EB" }];
    }

    return { computedMetrics: metricsData, computedTrips: trips, computedPackages: packagesArray };
  }, [bookings])

  if (isCheckLoading) return null

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center p-8 bg-card/50 rounded-3xl border border-dashed border-border backdrop-blur-sm">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
          <BookCheck className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tight text-foreground">Sign in to view Bookings</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Please sign in with your administrator account to view and manage booking requests and earnings.
          </p>
        </div>
        <Link
          to="/login"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-10 text-[15px] font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 active:scale-95"
        >
          Sign In
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 pt-2">
      <BookingMetrics metrics={computedMetrics} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <TripsOverview data={computedTrips} />
        <TopPackages data={computedPackages} />
      </div>

      <BookingsTable bookings={bookings} />
    </div>
  )
}
