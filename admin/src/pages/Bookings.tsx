import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"
import { BookingMetrics } from "@/components/booking/BookingMetrics"
import { TripsOverview } from "@/components/booking/TripsOverview"
import { TopPackages } from "@/components/booking/TopPackages"
import { BookingsTable, type Booking, type BookingFilters } from "@/components/booking/BookingsTable"
import { CreateBookingModal, type GuideTourPlan } from "@/components/booking/CreateBookingModal"

interface BookingsResponse {
  data: Booking[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

interface BookingMetricsResponse {
  totals: { totalRevenue: number; totalBookings: number; totalParticipants: number }
  monthly: { month: string; confirmed: number; cancelled: number; revenue: number }[]
  topPackages: { tourPlanId: string; title: string; count: number; participants: number }[]
}

const DEFAULT_FILTERS: BookingFilters = {
  page: 1,
  limit: 8,
  search: "",
  status: "confirmed",
  dateFrom: "",
  dateTo: "",
}

export default function Bookings() {
  const [filters, setFilters] = useState<BookingFilters>(DEFAULT_FILTERS)
  const [addModalOpen, setAddModalOpen] = useState(false)

  const { data: bookingsResp } = useQuery<BookingsResponse>({
    queryKey: ['bookings', filters],
    queryFn: async () => {
      const { data } = await api.get('/api/bookings/mine', { params: filters })
      return data as BookingsResponse
    }
  })

  const { data: metrics } = useQuery<BookingMetricsResponse>({
    queryKey: ['bookings', 'metrics'],
    queryFn: async () => {
      const { data } = await api.get('/api/bookings/metrics')
      return data as BookingMetricsResponse
    }
  })

  const { data: tourPlans = [] } = useQuery<GuideTourPlan[]>({
    queryKey: ['tour-plans', 'mine'],
    queryFn: async () => {
      const { data } = await api.get('/api/tour-plans')
      return data as GuideTourPlan[]
    }
  })

  const { computedMetrics, computedTrips, computedPackages } = useMemo(() => {
    const totals = metrics?.totals || { totalRevenue: 0, totalBookings: 0, totalParticipants: 0 }

    const metricsData = [
      {
        title: "Total Booking",
        value: totals.totalBookings.toLocaleString(),
        change: "",
        isUp: true,
        color: "var(--chart-1)",
        chartData: [{ val: 0 }, { val: totals.totalBookings }],
      },
      {
        title: "Total Participants",
        value: totals.totalParticipants.toLocaleString(),
        change: "",
        isUp: true,
        color: "var(--chart-2)",
        chartData: [{ val: 0 }, { val: totals.totalParticipants }],
      },
      {
        title: "Total Earnings",
        value: `₹${totals.totalRevenue.toLocaleString()}`,
        change: "",
        isUp: true,
        color: "var(--chart-1)",
        chartData: [{ val: 0 }, { val: totals.totalRevenue }],
      },
    ]

    const trips = (metrics?.monthly || []).map(m => ({
      month: m.month,
      done: m.confirmed,
      canceled: m.cancelled,
    }))

    const rawPackages = metrics?.topPackages || []
    const totalPings = rawPackages.reduce((acc, p) => acc + p.count, 0)
    const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"]

    let packagesArray = rawPackages.map((p, i) => ({
      name: p.title,
      count: p.count,
      participants: p.participants,
      value: totalPings === 0 ? 0 : Math.round((p.count / totalPings) * 100),
      color: colors[i % colors.length],
    }))

    if (packagesArray.length === 0) {
      packagesArray = [{ name: "No data", count: 0, participants: 0, value: 100, color: "var(--muted)" }]
    }

    return { computedMetrics: metricsData, computedTrips: trips, computedPackages: packagesArray }
  }, [metrics])

  return (
    <div className="flex flex-col gap-6 pt-2">
      <BookingMetrics metrics={computedMetrics} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <TripsOverview data={computedTrips} />
        <TopPackages data={computedPackages} />
      </div>

      <BookingsTable
        bookings={bookingsResp?.data ?? []}
        pagination={bookingsResp?.pagination}
        filters={filters}
        onFiltersChange={(next) => setFilters(prev => ({ ...prev, ...next }))}
        onAddBooking={() => setAddModalOpen(true)}
      />

      <CreateBookingModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        guideTourPlans={tourPlans}
      />
    </div>
  )
}
