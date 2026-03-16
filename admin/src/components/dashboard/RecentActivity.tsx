import { MoreHorizontal } from "lucide-react"

const items = [
  { user: "Alberto Cortez", action: "updated his profile and added a new payment method", time: "9:30 AM", color: "#FB923C", init: "A" },
  { user: "Camellia Swan", action: "booked the Venice Dreams package for June 25, 2024.", time: "10:00 AM", color: "#EF4444", init: "C" },
  { user: "Payment", action: "was processed for Ludwig Contessa's Alpine Escape package.", time: "11:15 AM", color: "#22B357", init: "P" },
  { user: "Armina Raul Meyes", action: "canceled her Caribbean Cruise package.", time: "12:45 PM", color: "#2E7CF6", init: "A" },
  { user: "Lydia Billings", action: "submitted a review for her recent package.", time: "2:30 PM", color: "#EF4444", init: "L" },
]

export function RecentActivity() {
  return (
    <div className="rounded-[14px] border border-[#E4EAF1] bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-[#1A2B3D]">Recent Activity</h3>
        <button className="rounded-[6px] p-0.5 text-[#8896A6] hover:bg-[#F0F4F8]">
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="mb-1.5 text-[11px] font-semibold text-[#5A6E82]">Today</p>
      <div>
        {items.map((a, i) => (
          <div key={i} className="flex gap-2.5 py-[7px]">
            <div className="flex flex-col items-center">
              <div
                className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: a.color }}
              >
                {a.init}
              </div>
              {i < items.length - 1 && <div className="mt-1 w-px flex-1 bg-[#E4EAF1]" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] leading-[1.5] text-[#5A6E82]">
                <span className="font-semibold text-[#1A2B3D]">{a.user}</span> {a.action}
              </p>
              <p className="mt-[2px] text-[9px] text-[#8896A6]">{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
