import { useState, useEffect, useRef } from "react"
import { Search, Bell, ChevronDown, Moon, Sun, User, Settings, CreditCard, LogOut } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Link, useNavigate } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function TopBar() {
  const [user, setUser] = useState<{ name: string; picture: string; role: string; email?: string } | null>(null)
  const { theme, setTheme } = useTheme()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: callbacks = [] } = useQuery({
    queryKey: ['callbacks'],
    queryFn: async () => {
      const { data } = await api.get('/api/callbacks/mine')
      return data
    }
  })

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/api/callbacks/${id}/read`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callbacks'] })
    }
  })

  const handleNotificationClick = (e: React.MouseEvent, req: any) => {
    // Stop propagation so this click doesn't bleed through the Sheet
    // closing animation onto buttons on the underlying page
    e.stopPropagation()

    if (!req.isRead) {
      // Optimistically mark as read in the local cache immediately
      queryClient.setQueryData(['callbacks'], (prev: any[]) =>
        prev?.map((c) => c._id === req._id ? { ...c, isRead: true } : c) ?? []
      )
      markAsReadMutation.mutate(req._id)
    }

    // Close the sheet first, then navigate after the close animation
    // finishes (~300ms). This prevents the click event from bleeding
    // through the Sheet onto buttons on the newly rendered page.
    setSheetOpen(false)
    setTimeout(() => {
      navigate({ to: '/travelers' })
    }, 300)
  }

  const unreadCount = callbacks.filter((c: any) => !c.isRead && c.status === 'pending').length
  const recentCallbacks = callbacks.slice(0, 10)

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
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <button className="relative flex h-[34px] w-[34px] items-center justify-center rounded-[10px] border border-border bg-card transition hover:bg-accent cursor-pointer">
            <Bell className="h-[15px] w-[15px] text-muted-foreground" strokeWidth={1.8} />
            {unreadCount > 0 && (
              <span className="absolute -top-[3px] -right-[3px] flex h-[15px] w-[15px] items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground ring-2 ring-card">
                {unreadCount}
              </span>
            )}
          </button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle>Notifications</SheetTitle>
            <SheetDescription>
              You have {unreadCount} unread callback {unreadCount === 1 ? 'request' : 'requests'}.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-3">
            {recentCallbacks.length === 0 ? (
              <div className="text-sm text-muted-foreground py-10 text-center flex flex-col items-center gap-2">
                <Bell className="h-8 w-8 text-muted-foreground/30" />
                No notifications found.
              </div>
            ) : (
              recentCallbacks.map((req: any) => {
                const isUnread = !req.isRead && req.status === 'pending'
                return (
                  <div 
                    key={req._id} 
                    onClick={(e) => handleNotificationClick(e, req)}
                    className={`flex flex-col gap-1.5 p-4 rounded-xl border transition-all shadow-sm cursor-pointer ${
                      isUnread 
                        ? 'bg-primary/5 border-primary/20 hover:bg-primary/10' 
                        : 'bg-card hover:bg-accent/50 opacity-75'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold flex items-center gap-2 ${isUnread ? 'text-primary' : 'text-foreground'}`}>
                        {isUnread && <span className="h-2 w-2 rounded-full bg-primary" />}
                        {req.requesterName || "Anonymous Traveler"}
                      </span>
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={`text-[13px] ${isUnread ? 'text-foreground/80' : 'text-muted-foreground'} pl-4`}>
                      Requested a callback for <span className="font-semibold">{req.tourPlanId?.title || "Unknown Plan"}</span>.
                    </p>
                    <p className="text-[12px] text-muted-foreground pl-4">
                      <span className="font-medium">{req.requesterEmail || "N/A"}</span>
                    </p>
                  </div>
                )
              })
            )}
          </div>
        </SheetContent>
      </Sheet>

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
