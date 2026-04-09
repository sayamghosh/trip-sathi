import { useEffect, useState, useMemo } from "react"
import api from "@/lib/axios"
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Search,
  TrendingDown,
  TrendingUp,
  ChevronDown,
  CalendarDays,
} from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function Bookings() {
  const [bookings, setBookings] = useState<any[]>([])

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await api.get('/api/callbacks/mine')
        setBookings(data)
      } catch (error) {
        console.error("Error fetching bookings:", error)
      }
    }
    fetchBookings()
  }, [])

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
        bgColor: "#EFF6FF",
        iconBg: "#DBEAFE",
        iconColor: "#3B82F6",
        chartData: [{ val: 0 }, { val: totalBooking }],
      },
      {
        title: "Total Participants",
        value: totalParticipants.toLocaleString(),
        change: "-0.00%",
        isUp: false,
        color: "#EF4444",
        bgColor: "#FEF2F2",
        iconBg: "#FEE2E2",
        iconColor: "#EF4444",
        chartData: [{ val: 0 }, { val: totalParticipants }],
      },
      {
        title: "Total Earnings",
        value: `₹${totalEarnings.toLocaleString()}`,
        change: "+0.00%",
        isUp: true,
        color: "#3B82F6",
        bgColor: "#EFF6FF",
        iconBg: "#DBEAFE",
        iconColor: "#3B82F6",
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
         if (b.status === 'contacted') trip.done++;
         else trip.canceled++;
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
    <div className="flex flex-col gap-6 p-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {computedMetrics.map((m, i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-[16px] border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-[8px]"
                  style={{ backgroundColor: m.iconBg }}
                >
                  <CalendarDays className="h-4 w-4" style={{ color: m.iconColor }} />
                </div>
                <span className="text-[13px] font-medium text-muted-foreground">
                  {m.title}
                </span>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-[28px] font-bold text-foreground leading-none">
                  {m.value}
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-[11px]">
                  {m.isUp ? (
                    <TrendingUp className="h-3 w-3 text-[#3B82F6]" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-[#EF4444]" />
                  )}
                  <span
                    className={`font-medium ${
                      m.isUp ? "text-[#3B82F6]" : "text-[#EF4444]"
                    }`}
                  >
                    {m.change}
                  </span>
                  <span className="text-muted-foreground">from last week</span>
                </div>
              </div>
              <div className="h-[40px] w-[80px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={m.chartData}>
                    <defs>
                      <linearGradient id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={m.color} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={m.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="val"
                      stroke={m.color}
                      strokeWidth={2}
                      fill={`url(#grad-${i})`}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Trips Overview */}
        <div className="rounded-[16px] border border-border bg-card p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-[16px] font-bold text-foreground">
              Trips Overview
            </h3>
            <button className="flex items-center gap-1.5 rounded-[8px] bg-[#3B82F6] px-3 py-1.5 text-[12px] font-medium text-white hover:bg-[#3B82F6]/90">
              Last 12 Months
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="h-0.5 w-3 bg-[#3B82F6]" />
              <span className="text-[12px] text-muted-foreground font-medium">Done</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-0.5 w-3 border-t-2 border-dashed border-gray-400" />
              <span className="text-[12px] text-muted-foreground font-medium">Canceled</span>
            </div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={computedTrips} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDone" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#6B7280" }}
                  dy={10}
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#6B7280" }}
                />
                <Tooltip
                   content={({ active, payload }) => {
                     if (active && payload && payload.length) {
                       return (
                         <div className="bg-white border rounded-lg p-3 shadow-lg">
                           <p className="font-semibold text-[14px] text-gray-900 mb-1">{payload[0].payload.done.toLocaleString()}</p>
                           <p className="text-[11px] text-gray-500">{payload[0].payload.month}</p>
                         </div>
                       )
                     }
                     return null
                   }}
                />
                <Area
                  type="monotone"
                  dataKey="done"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#colorDone)"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2, fill: "#fff", stroke: "#3B82F6" }}
                />
                <Line
                  type="monotone"
                  dataKey="canceled"
                  stroke="#9CA3AF"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Packages */}
        <div className="flex flex-col rounded-[16px] border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-bold text-foreground">
              Top Packages
            </h3>
            <button className="text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
          
          <div className="relative flex-1 flex flex-col items-center justify-center min-h-[220px]">
             <div className="absolute inset-0 flex items-center justify-center flex-col z-10 pointer-events-none mt-2">
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground mb-1">
                   This Week <ChevronDown className="w-3 h-3"/>
                </div>
                <div className="text-[24px] font-bold text-foreground leading-none mb-1">
                  {computedPackages.reduce((acc, p) => acc + p.participants, 0).toLocaleString()}
                </div>
                <div className="text-[10px] text-muted-foreground">Total Participants</div>
             </div>
             <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={computedPackages}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={4}
                >
                  {computedPackages.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {computedPackages.map((pkg, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="flex h-7 min-w-[36px] shrink-0 px-2 items-center justify-center rounded-[6px] text-[11px] font-semibold text-white"
                  style={{ backgroundColor: pkg.color }}
                >
                  {pkg.value}%
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-medium text-foreground">
                    {pkg.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {pkg.participants} Participants
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[18px] font-bold text-foreground">Bookings</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search name, package, etc"
                className="h-9 w-[250px] rounded-[8px] border border-border bg-[#F9FAFB] pl-9 pr-3 text-[13px] outline-none transition focus:border-primary/50"
              />
            </div>
            <button className="flex h-9 items-center gap-2 rounded-[8px] border border-border bg-card px-3 text-[13px] font-medium text-foreground hover:bg-accent hover:text-accent-foreground">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              Today
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
            <button className="flex h-9 items-center gap-1.5 rounded-[8px] bg-[#3B82F6] px-3.5 text-[13px] font-medium text-white hover:bg-[#3B82F6]/90">
              <Plus className="h-4 w-4" />
              Add Booking
            </button>
          </div>
        </div>

        <div className="rounded-[12px] border border-border bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#F8FAFC] font-medium text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-5 py-3.5 flex items-center gap-1 cursor-pointer">Name <ChevronDown className="h-3 w-3 opacity-50"/></th>
                  <th className="px-5 py-3.5">Booking Code <ChevronDown className="h-3 w-3 inline opacity-50 mb-[2px] ml-1"/></th>
                  <th className="px-5 py-3.5">Package <ChevronDown className="h-3 w-3 inline opacity-50 mb-[2px] ml-1"/></th>
                  <th className="px-5 py-3.5">Duration <ChevronDown className="h-3 w-3 inline opacity-50 mb-[2px] ml-1"/></th>
                  <th className="px-5 py-3.5">Date <ChevronDown className="h-3 w-3 inline opacity-50 mb-[2px] ml-1"/></th>
                  <th className="px-5 py-3.5">Price <ChevronDown className="h-3 w-3 inline opacity-50 mb-[2px] ml-1"/></th>
                  <th className="px-5 py-3.5">Status <ChevronDown className="h-3 w-3 inline opacity-50 mb-[2px] ml-1"/></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">
                      No bookings found.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking: any) => {
                    const statusClass = booking.status === "contacted" 
                      ? "bg-[#3B82F6] text-white" 
                      : booking.status === "pending"
                      ? "bg-[#DBEAFE] text-[#1D4ED8]"
                      : "bg-[#FEE2E2] text-[#EF4444]";
                      
                    const statusText = booking.status === "contacted" 
                      ? "Confirmed"
                      : booking.status === "pending"
                      ? "Pending"
                      : "Cancelled";

                    const dateString = booking.createdAt 
                      ? new Date(booking.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : "N/A";
                      
                    return (
                      <tr key={booking._id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-4 font-medium text-foreground">
                          {booking.requesterName || "Anonymous"}
                        </td>
                        <td className="px-5 py-4 text-muted-foreground">
                          BKG{booking._id?.toString().substring(0, 5).toUpperCase()}
                        </td>
                        <td className="px-5 py-4 text-muted-foreground">
                          {booking.tourPlanId?.title || "Custom Package"}
                        </td>
                        <td className="px-5 py-4 text-muted-foreground">
                          {booking.tourPlanId?.duration || "N/A"} Days
                        </td>
                        <td className="px-5 py-4 text-muted-foreground">
                          {dateString}
                        </td>
                        <td className="px-5 py-4 font-medium text-foreground">
                          {booking.tourPlanId?.basePrice ? `₹${booking.tourPlanId.basePrice.toLocaleString()}` : "N/A"}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusClass}`}
                          >
                            {statusText}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          <div className="flex items-center justify-between border-t border-border px-5 py-3">
            <div className="text-[13px] text-muted-foreground">
              Showing{" "}
              <select className="mx-1 rounded border border-border bg-transparent outline-none py-0.5 px-1">
                 <option>8</option>
              </select>{" "}
              out of 286
            </div>
            <div className="flex items-center gap-1">
              <button className="flex h-8 items-center gap-1 rounded-[6px] px-2.5 text-[13px] text-muted-foreground hover:bg-muted">
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#3B82F6] text-[13px] font-medium text-white hover:bg-[#3B82F6]/90">
                1
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[13px] font-medium text-muted-foreground hover:bg-muted">
                2
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[13px] font-medium text-muted-foreground hover:bg-muted">
                3
              </button>
              <span className="text-muted-foreground mx-1">...</span>
              <button className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[13px] font-medium text-muted-foreground hover:bg-muted">
                16
              </button>
              <button className="flex h-8 items-center gap-1 rounded-[6px] px-2.5 text-[13px] text-muted-foreground hover:bg-muted">
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
