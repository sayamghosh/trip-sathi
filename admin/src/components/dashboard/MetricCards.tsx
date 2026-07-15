import { useQuery } from "@tanstack/react-query"
import { TrendingUp, TrendingDown } from "lucide-react"
import api from "@/lib/axios"
import { cn } from "@/lib/utils"

interface BookingMetricsResponse {
  totals: { totalRevenue: number; totalBookings: number; totalParticipants: number; totalTravelers: number }
  monthly: { month: string; confirmed: number; cancelled: number; revenue: number }[]
}

function pctChange(current: number, previous: number): number | null {
  if (!previous) return null
  return ((current - previous) / previous) * 100
}

export function MetricCards() {
  const { data: metrics } = useQuery<BookingMetricsResponse>({
    queryKey: ['bookings', 'metrics'],
    queryFn: async () => {
      const { data } = await api.get('/api/bookings/metrics')
      return data as BookingMetricsResponse
    },
  })

  const totals = metrics?.totals || { totalRevenue: 0, totalBookings: 0, totalParticipants: 0, totalTravelers: 0 }
  const monthly = metrics?.monthly || []
  const thisMonth = monthly[monthly.length - 1]
  const lastMonth = monthly[monthly.length - 2]

  const revenueChange = thisMonth && lastMonth ? pctChange(thisMonth.revenue, lastMonth.revenue) : null
  const bookingsChange = thisMonth && lastMonth ? pctChange(thisMonth.confirmed, lastMonth.confirmed) : null

  const formatChange = (change: number | null) => (change === null ? null : `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`)

  const metricsList = [
    {
      label: "Total Booking",
      value: totals.totalBookings.toLocaleString(),
      change: formatChange(bookingsChange),
      positive: (bookingsChange ?? 0) >= 0,
      iconBg: "bg-[#D4E8FC]",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2E7CF6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
          <path d="m9 16 2 2 4-4" />
        </svg>
      ),
    },
    {
      label: "Total Travelers",
      value: totals.totalTravelers.toLocaleString(),
      change: null as string | null,
      positive: true,
      iconBg: "bg-[#C9EFDA]",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22B357" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" x2="19" y1="8" y2="14" />
          <line x1="22" x2="16" y1="11" y2="11" />
        </svg>
      ),
    },
    {
      label: "Total Earnings",
      value: `₹${totals.totalRevenue.toLocaleString('en-IN')}`,
      change: formatChange(revenueChange),
      positive: (revenueChange ?? 0) >= 0,
      iconBg: "bg-[#DDD4FC]",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C5CE7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" x2="12" y1="2" y2="22" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {metricsList.map((m) => (
        <div
          key={m.label}
          className="relative rounded-[14px] bg-card border border-border px-5 py-4 transition-transform duration-200 hover:scale-[1.015]"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-medium text-muted-foreground">
                {m.label}
              </p>
              <p className="mt-[2px] text-[26px] leading-tight font-bold text-foreground">
                {m.value}
              </p>
            </div>
            <div className={cn("flex h-[36px] w-[36px] items-center justify-center rounded-[10px]", m.iconBg, "dark:bg-primary/10")}>
              {m.icon}
            </div>
          </div>
          {m.change && (
            <div className="mt-1.5 flex items-center gap-1.5">
              {m.positive ? (
                <TrendingUp className="h-3 w-3 text-[#22B357]" />
              ) : (
                <TrendingDown className="h-3 w-3 text-[#EF4444]" />
              )}
              <span className={`rounded-full px-[8px] py-[2px] text-[10px] font-semibold ${m.positive ? "bg-[#C9EFDA]/20 text-[#22B357]" : "bg-[#FDD]/20 text-[#EF4444]"}`}>
                {m.change}
              </span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
