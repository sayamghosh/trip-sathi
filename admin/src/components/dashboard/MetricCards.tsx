import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import api from "@/lib/axios"
import { cn } from "@/lib/utils"

export function MetricCards() {
  const [totalPlans, setTotalPlans] = useState<number | string>("...")

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [plansRes, callbacksRes] = await Promise.all([
           api.get("/api/tour-plans"),
           api.get("/api/callbacks/mine")
        ])
        setTotalPlans(plansRes.data.length)
        setTotalGuests(callbacksRes.data.length || 0)
        
        const totalVolume = plansRes.data.reduce((acc: number, p: any) => acc + (p.basePrice || 0), 0)
        setGrossVolume(`₹${totalVolume.toLocaleString('en-IN')}`)
      } catch (error) {
        console.error("Error fetching stats:", error)
        setTotalPlans("ERR")
        setTotalGuests("ERR")
      }
    }
    fetchStats()
  }, [])

  const [totalGuests, setTotalGuests] = useState<number | string>("...")
  const [grossVolume, setGrossVolume] = useState<string>("...")

  const metrics = [
    {
      label: "Live Packages",
      value: totalPlans,
      change: "+2.98%",
      positive: true,
      bg: "bg-[#E8F2FE]",
      iconBg: "bg-[#D4E8FC]",
      iconColor: "#2E7CF6",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2E7CF6"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        </svg>
      ),
    },
    {
      label: "Total Guests",
      value: totalGuests,
      change: "-1.45%",
      positive: false,
      bg: "bg-[#E3F7EC]",
      iconBg: "bg-[#C9EFDA]",
      iconColor: "#22B357",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#22B357"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" x2="19" y1="8" y2="14" />
          <line x1="22" x2="16" y1="11" y2="11" />
        </svg>
      ),
    },
    {
      label: "Gross Volume",
      value: grossVolume,
      change: "+3.75%",
      positive: true,
      bg: "bg-[#EDE8FE]",
      iconBg: "bg-[#DDD4FC]",
      iconColor: "#7C5CE7",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#7C5CE7"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" x2="12" y1="2" y2="22" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {metrics.map((m) => (
        <div
          key={m.label}
          className={`relative rounded-[14px] bg-card border border-border px-5 py-4 transition-transform duration-200 hover:scale-[1.015]`}
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
            <div
              className={cn(
                "flex h-[36px] w-[36px] items-center justify-center rounded-[10px]",
                m.iconBg,
                "dark:bg-primary/10"
              )}
            >
              {m.icon}
            </div>
          </div>
          <div className="mt-1.5 flex items-center gap-1.5">
            {m.positive ? (
              <TrendingUp className="h-3 w-3 text-[#22B357]" />
            ) : (
              <TrendingDown className="h-3 w-3 text-[#EF4444]" />
            )}
            <span
              className={`rounded-full px-[8px] py-[2px] text-[10px] font-semibold ${
                m.positive
                  ? "bg-[#C9EFDA]/20 text-[#22B357]"
                  : "bg-[#FDD]/20 text-[#EF4444]"
              }`}
            >
              {m.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
