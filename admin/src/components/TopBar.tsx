import { useState, useEffect, useRef } from "react"
import { Search, Bell, ChevronDown, Moon, Sun, User, Settings, CreditCard, LogOut } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Link } from "@tanstack/react-router"

export function TopBar() {
  const [user, setUser] = useState<{ name: string; picture: string; role: string; email?: string } | null>(null)
  const { theme, setTheme } = useTheme()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Failed to parse user from localStorage", e)
      }
    }
    
    // Click outside handler
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
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

  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/login"
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

      {/* User Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`flex items-center gap-2 rounded-[10px] border border-border bg-card px-2.5 py-[5px] transition-colors hover:bg-accent ${isDropdownOpen ? 'bg-accent' : ''}`}
        >
          <div className="flex h-[32px] w-[32px] items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-primary to-[#818CF8]">
            {user?.picture ? (
              <img src={user.picture} alt={user.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <span className="text-[12px] font-bold text-white">
                {getInitials(user?.name || "Ruben Herwitz")}
              </span>
            )}
          </div>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-[12px] font-semibold text-foreground">
              {user?.name || "Ruben Herwitz"}
            </span>
            <span className="text-[10px] capitalize text-muted-foreground">
              {user?.role || "Admin"}
            </span>
          </div>
          <ChevronDown className={`ml-1 h-[14px] w-[14px] text-muted-foreground transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-[12px] border border-border bg-card shadow-lg shadow-black/5 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-in fade-in zoom-in-95 duration-200">
            {/* User Header */}
            <div className="px-4 py-3 border-b border-border">
              <p className="text-[13px] font-bold text-foreground">
                {user?.name || "Ruben Herwitz"}
              </p>
              <p className="text-[11px] font-medium text-muted-foreground truncate">
                {user?.email || "admin@example.com"}
              </p>
            </div>
            
            {/* Menu Items */}
            <div className="py-1">
              <Link 
                to="/profile"
                onClick={() => setIsDropdownOpen(false)}
                className="group flex w-full items-center gap-2 px-4 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-accent hover:text-primary"
              >
                <User className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                My Profile
              </Link>
              <button 
                onClick={() => setIsDropdownOpen(false)}
                className="group flex w-full items-center gap-2 px-4 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-accent hover:text-primary"
              >
                <Settings className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                Account Settings
              </button>
              <button 
                onClick={() => setIsDropdownOpen(false)}
                className="group flex w-full items-center gap-2 px-4 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-accent hover:text-primary"
              >
                <CreditCard className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                Billing
              </button>
            </div>
            
            <div className="border-t border-border py-1">
              <button 
                onClick={handleLogout}
                className="group flex w-full items-center gap-2 px-4 py-2 text-[13px] font-bold text-red-600 transition-colors hover:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-400/10"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
