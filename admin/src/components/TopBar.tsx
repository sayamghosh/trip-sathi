import { useState, useEffect } from "react"
import { Search, Bell, ChevronDown, Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export function TopBar() {
  const [user, setUser] = useState<{ name: string; picture: string; role: string } | null>(null)
  const { theme, setTheme } = useTheme()

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
      <div className="flex items-center gap-2 rounded-[10px] border border-border bg-card px-3 py-[7px]">
        <Search className="h-[14px] w-[14px] text-muted-foreground" />
        <input
          type="text"
          placeholder="Search anything"
          className="w-[130px] border-none bg-transparent text-[12px] text-secondary-foreground placeholder-muted-foreground outline-none"
        />
      </div>

      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="relative flex h-[34px] w-[34px] items-center justify-center rounded-[10px] border border-border bg-card transition hover:bg-accent"
      >
        {theme === "dark" ? (
          <Sun className="h-[15px] w-[15px] text-muted-foreground" strokeWidth={1.8} />
        ) : (
          <Moon className="h-[15px] w-[15px] text-muted-foreground" strokeWidth={1.8} />
        )}
      </button>

      {/* Notification */}
      <button className="relative flex h-[34px] w-[34px] items-center justify-center rounded-[10px] border border-border bg-card transition hover:bg-accent">
        <Bell className="h-[15px] w-[15px] text-muted-foreground" strokeWidth={1.8} />
        <span className="absolute -top-[2px] -right-[2px] h-[8px] w-[8px] rounded-full bg-primary ring-2 ring-card" />
      </button>

      {/* User */}
      <div className="flex items-center gap-2 rounded-[10px] border border-border bg-card px-2.5 py-[5px]">
        <div className="flex h-[32px] w-[32px] items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-primary to-[#818CF8]">
          {user?.picture ? (
            <img src={user.picture} alt={user.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <span className="text-[12px] font-bold text-white">
              {getInitials(user?.name || "")}
            </span>
          )}
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[12px] font-semibold text-foreground">
            {user?.name || "Ruben Herwitz"}
          </span>
          <span className="text-[10px] capitalize text-muted-foreground">
            {user?.role || "Admin"}
          </span>
        </div>
        <ChevronDown className="ml-1 h-[14px] w-[14px] text-muted-foreground" />
      </div>
    </div>
  )
}

