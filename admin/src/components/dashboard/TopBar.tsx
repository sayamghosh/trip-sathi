import { useState, useEffect } from "react"
import { Search, Bell, ChevronDown } from "lucide-react"

export function TopBar() {
  const [user, setUser] = useState<{ name: string; picture: string; role: string } | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Failed to parse user from localStorage", e)
      }
    }
  }, [])

  const getInitials = (name: string) => {
    if (!name) return "RH"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

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
          {user?.picture ? (
            <img src={user.picture} alt={user.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <span className="text-[12px] font-bold text-white">
              {getInitials(user?.name || "")}
            </span>
          )}
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[12px] font-semibold text-[#1A2B3D]">
            {user?.name || "Ruben Herwitz"}
          </span>
          <span className="text-[10px] capitalize text-[#8896A6]">
            {user?.role || "Admin"}
          </span>
        </div>
        <ChevronDown className="ml-1 h-[14px] w-[14px] text-[#8896A6]" />
      </div>
    </div>
  )
}

