import { useQuery } from "@tanstack/react-query"
import { TrendingUp, TrendingDown, IndianRupee, Calendar, Users } from "lucide-react"
import api from "@/lib/axios"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

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
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      icon: <Calendar className="h-[18px] w-[18px]" strokeWidth={1.8} />,
    },
    {
      label: "Total Travelers",
      value: totals.totalTravelers.toLocaleString(),
      change: null as string | null,
      positive: true,
      iconBg: "bg-success/10",
      iconColor: "text-success",
      icon: <Users className="h-[18px] w-[18px]" strokeWidth={1.8} />,
    },
    {
      label: "Total Earnings",
      value: `₹${totals.totalRevenue.toLocaleString('en-IN')}`,
      change: formatChange(revenueChange),
      positive: (revenueChange ?? 0) >= 0,
      iconBg: "bg-accent",
      iconColor: "text-accent-foreground",
      icon: <IndianRupee className="h-[18px] w-[18px]" strokeWidth={1.8} />,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {metricsList.map((m) => (
        <Card
          key={m.label}
          className="relative transition-transform duration-200 hover:scale-[1.015]"
        >
          <CardContent className="px-5 py-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  {m.label}
                </p>
                <p className="mt-0.5 text-2xl leading-tight font-bold text-foreground">
                  {m.value}
                </p>
              </div>
              <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", m.iconBg, m.iconColor)}>
                {m.icon}
              </div>
            </div>
            {m.change && (
              <div className="mt-1.5 flex items-center gap-1.5">
                {m.positive ? (
                  <TrendingUp className="h-3 w-3 text-success" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    m.positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                  )}
                >
                  {m.change}
                </span>
                <span className="text-xs text-muted-foreground">from last month</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
