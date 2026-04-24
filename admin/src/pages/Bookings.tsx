import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"
import { BookingMetrics } from "@/components/booking/BookingMetrics"
import { TripsOverview } from "@/components/booking/TripsOverview"
import { TopPackages } from "@/components/booking/TopPackages"
import { BookingsTable } from "@/components/booking/BookingsTable"

export default function Bookings() {
  const { data: bookings = [] } = useQuery({
    queryKey: ['callbacks'],
    queryFn: async () => {
      const { data } = await api.get('/api/callbacks/mine')
      return data
    }
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
