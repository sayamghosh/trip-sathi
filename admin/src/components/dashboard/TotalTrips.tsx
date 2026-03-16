import { MoreHorizontal } from "lucide-react"

const stats = [
  { label: "Done", value: 620, color: "#2E7CF6" },
  { label: "Booked", value: 465, color: "#22B357" },
  { label: "Cancelled", value: 115, color: "#EF4444" },
]
const total = 1200

export function TotalTrips() {
  return (
    <div className="rounded-[14px] border border-[#E4EAF1] bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-[14px] font-semibold text-[#1A2B3D]">
            Total Trips
          </h3>
          <span className="text-[20px] font-bold text-[#1A2B3D]">
            {total.toLocaleString()}
          </span>
        </div>
        <button className="rounded-[6px] p-1 text-[#8896A6] transition hover:bg-[#F0F4F8]">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-2.5 flex h-[10px] w-full overflow-hidden rounded-full">
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              width: `${(s.value / total) * 100}%`,
              backgroundColor: s.color,
            }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <div
              className="h-[8px] w-[8px] rounded-full"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-[11px] text-[#6B7F95]">{s.label}</span>
            <span className="text-[11px] font-bold text-[#1A2B3D]">
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
