import { useState, useEffect } from "react"
import { Search, Bell, Moon, Sun, User, Settings, CreditCard, LogOut } from "lucide-react"
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function TopBar() {
  const [user, setUser] = useState<{ name: string; picture: string; role: string; email?: string } | null>(null)
  const { theme, setTheme } = useTheme()
  const [sheetOpen, setSheetOpen] = useState(false)
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
  }, [])

  const getInitials = (name: string) => {
    if (!name) return ""
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  return (
    <div className="flex items-center gap-3">
      {/* Search */}
      <div className="relative flex items-center">
        <Search className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search anything"
          className="w-36 pl-8"
        />
      </div>

      {/* Theme Toggle */}
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? (
          <Sun className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
        ) : (
          <Moon className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
        )}
      </Button>

      {/* Notification */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="relative h-9 w-9">
            <Bell className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 justify-center rounded-full p-0 text-xs leading-none ring-2 ring-card">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
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
                      <span className="text-xs font-medium text-muted-foreground">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={`text-sm ${isUnread ? 'text-foreground/80' : 'text-muted-foreground'} pl-4`}>
                      Requested a callback for <span className="font-semibold">{req.tourPlanId?.title || "Unknown Plan"}</span>.
                    </p>
                    <p className="text-xs text-muted-foreground pl-4">
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex h-auto items-center gap-2 rounded-lg px-2.5 py-1.5 data-[state=open]:bg-accent"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.picture} alt={user?.name} referrerPolicy="no-referrer" />
              <AvatarFallback className="bg-linear-to-br from-primary to-primary/60 text-xs font-bold text-primary-foreground">
                {getInitials(user?.name || "")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-left leading-tight">
              <span className="text-xs font-semibold text-foreground">
                {user?.name || "User"}
              </span>
              <span className="text-xs capitalize text-muted-foreground">
                {user?.role || "Agent"}
              </span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex flex-col gap-0.5">
            <span className="text-sm font-bold text-foreground">
              {user?.name || "User"}
            </span>
            <span className="truncate text-xs font-medium text-muted-foreground">
              {user?.email || ""}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/profile" className="cursor-pointer">
              <User className="h-4 w-4 text-muted-foreground" />
              My Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="h-4 w-4 text-muted-foreground" />
            Account Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            Billing
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer font-bold text-destructive focus:bg-destructive/10 focus:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
