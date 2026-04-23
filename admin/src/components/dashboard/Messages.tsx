import { MoreHorizontal } from "lucide-react"

const messages = [
  {
    name: "Europia Hotel",
    msg: "We are pleased to announc...",
    time: "11:00 AM",
    color: "#2E7CF6",
    init: "E",
    online: true,
  },
  {
    name: "Global Travel Co",
    msg: "We have updated our com...",
    time: "2:15 PM",
    color: "#22B357",
    init: "G",
    online: false,
  },
  {
    name: "Kalendra Umbora",
    msg: "Hi, I need assistance with c...",
    time: "9:45 AM",
    color: "#818CF8",
    init: "K",
    online: true,
  },
  {
    name: "Osman Farooq",
    msg: "Hello, I had an amazing tim...",
    time: "10:15 AM",
    color: "#F472B6",
    init: "O",
    online: false,
  },
  {
    name: "Mellinda Jenkins",
    msg: "Can you provide more deta...",
    time: "1:20 PM",
    color: "#FB923C",
    init: "M",
    online: true,
  },
  {
    name: "David Hernandez",
    msg: "I would like to upgrade my...",
    time: "10:00 AM",
    color: "#EF4444",
    init: "D",
    online: false,
  },
  {
    name: "Alexandra Green",
    msg: "Our company is interested i...",
    time: "9:10 PM",
    color: "#0EA5E9",
    init: "A",
    online: true,
  },
]

export function Messages() {
  return (
    <div className="rounded-[14px] border border-[#E4EAF1] bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-[#1A2B3D]">Messages</h3>
        <button className="rounded-[6px] p-1 text-[#8896A6] transition hover:bg-[#F0F4F8]">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-[1px]">
        {messages.map((m) => (
          <div
            key={m.name}
            className="flex items-center gap-2.5 rounded-[8px] px-1 py-[7px] transition hover:bg-[#F5F7FA]"
          >
            <div className="relative shrink-0">
              <div
                className="flex h-[34px] w-[34px] items-center justify-center rounded-full text-[12px] font-bold text-white"
                style={{ backgroundColor: m.color }}
              >
                {m.init}
              </div>
              {m.online && (
                <div className="absolute -right-[1px] -bottom-[1px] h-[10px] w-[10px] rounded-full border-2 border-white bg-[#22B357]" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="truncate text-[12px] font-semibold text-[#1A2B3D]">
                  {m.name}
                </span>
                <span className="ml-2 shrink-0 text-[10px] text-[#8896A6]">
                  {m.time}
                </span>
              </div>
              <p className="truncate text-[11px] text-[#8896A6]">{m.msg}</p>
            </div>

            <div className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#2E7CF6]">
              <span className="text-[8px] font-bold text-white">1</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
