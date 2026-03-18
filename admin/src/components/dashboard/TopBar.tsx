import { Search, Bell, ChevronDown } from "lucide-react"

export function TopBar() {
  return (
    <div className="flex items-center gap-3">
      {/* Search */}
      <div className="flex items-center gap-2 rounded-[10px] border border-[#E4EAF1] bg-white px-3 py-[7px]">
        <Search className="h-[14px] w-[14px] text-[#8896A6]" />
        <input
          type="text"
          placeholder="Search anything"
          className="w-[130px] border-none bg-transparent text-[12px] text-[#5A6E82] placeholder-[#8896A6] outline-none"
        />
      </div>

      {/* Notification */}
      <button className="relative flex h-[34px] w-[34px] items-center justify-center rounded-[10px] border border-[#E4EAF1] bg-white transition hover:bg-[#F0F4F8]">
        <Bell className="h-[15px] w-[15px] text-[#6B7F95]" strokeWidth={1.8} />
        <span className="absolute -top-[2px] -right-[2px] h-[8px] w-[8px] rounded-full bg-[#2E7CF6] ring-2 ring-white" />
      </button>

      {/* User */}
      <div className="flex items-center gap-2 rounded-[10px] border border-[#E4EAF1] bg-white px-2.5 py-[5px]">
        <div className="flex h-[32px] w-[32px] items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#2E7CF6] to-[#818CF8]">
          <span className="text-[12px] font-bold text-white">RH</span>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[12px] font-semibold text-[#1A2B3D]">
            Ruben Herwitz
          </span>
          <span className="text-[10px] text-[#8896A6]">Admin</span>
        </div>
        <ChevronDown className="ml-1 h-[14px] w-[14px] text-[#8896A6]" />
      </div>
    </div>
  )
}
