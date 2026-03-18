import { TrendingUp, TrendingDown } from "lucide-react"

const metrics = [
  {
    label: "Total Booking",
    value: "1,200",
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
    label: "Total New Customers",
    value: "2,845",
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
    label: "Total Earnings",
    value: "$12,890",
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

export function MetricCards() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {metrics.map((m) => (
        <div
          key={m.label}
          className={`relative rounded-[14px] ${m.bg} px-5 py-4 transition-transform duration-200 hover:scale-[1.015]`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-medium text-[#5A6E82]">
                {m.label}
              </p>
              <p className="mt-[2px] text-[26px] leading-tight font-bold text-[#1A2B3D]">
                {m.value}
              </p>
            </div>
            <div
              className={`flex h-[36px] w-[36px] items-center justify-center rounded-[10px] ${m.iconBg}`}
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
                  ? "bg-[#C9EFDA] text-[#22B357]"
                  : "bg-[#FDD] text-[#EF4444]"
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
