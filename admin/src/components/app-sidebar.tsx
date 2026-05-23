import {
  LayoutDashboard,
  Package,
  BookCheck,
  CalendarDays,
  Users,
  Compass,
  ImageIcon,
  MessageCircle,
  Percent,
  ThumbsUp,
  LogOut,
  Lock,
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  useSidebar,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "@tanstack/react-router"
import { cn } from "@/lib/utils"


// Base menu items
const baseItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/" },
  { icon: Package, label: "Packages", to: "/packages", matchPaths: ["/packages"] },
  { icon: BookCheck, label: "Bookings", to: "/bookings" },
  { icon: CalendarDays, label: "Calendar", to: "/calendar" },
  { icon: Users, label: "Travelers", to: "/travelers" }, // Badge will be injected dynamically
  { icon: Compass, label: "Guides", to: "/guides" },
  { icon: ImageIcon, label: "Gallery", to: "/gallery" },
  { icon: MessageCircle, label: "Messages", to: "/messages", badge: 7 },
  { icon: Percent, label: "Deals", to: "/deals" },
  { icon: ThumbsUp, label: "Feedback", to: "/feedback" },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const location = useLocation()
  const pathname = location.pathname

  const isActivePath = (path: string) => {
    if (path === "/") return pathname === "/"
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  // Fetch callbacks using react-query (this shares the cache with Travelers and Bookings pages)
  const { data: callbacks = [] } = useQuery({
    queryKey: ['callbacks'],
    queryFn: async () => {
      const { data } = await api.get('/api/callbacks/mine')
      return data
    }
  })

  const unreadCount = callbacks.filter((c: any) => !c.isRead && c.status === 'pending').length

  const items = baseItems.map(item => {
    if (item.label === "Travelers" && unreadCount > 0) {
      return { ...item, badge: unreadCount }
    }
    return item
  })

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  const userStr = localStorage.getItem("user")
  const user = userStr ? JSON.parse(userStr) : null
  const isUnverified = user?.verificationStatus === "pending" || user?.verificationStatus === "rejected"
  const restrictedLabels = ["Bookings", "Calendar", "Travelers"]

  return (
    <Sidebar collapsible="icon" className="border-r-0 border-sidebar-border transition-all duration-300 ease-in-out">
      <SidebarHeader className={cn("bg-sidebar px-6 py-8 transition-all duration-300", isCollapsed ? "p-0 py-8 flex items-center justify-center" : "items-start")}>
        <Link to="/" className="flex items-center">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
            <Compass className="h-5 w-5" />
          </div>
          <span className={cn(
            "text-xl font-bold tracking-tight text-sidebar-foreground transition-all duration-200 ease-in-out inline-block overflow-hidden whitespace-nowrap",
            isCollapsed ? "opacity-0 invisible w-0 -translate-x-4 scale-95" : "opacity-100 visible w-auto translate-x-0 ml-3 scale-100 delay-100"
          )}>
            TripSathi
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className={cn("bg-sidebar px-4 transition-all duration-300 ease-in-out", isCollapsed && "px-2")}>
        <SidebarGroup className="flex-1">
          <SidebarGroupContent className={cn("flex flex-col flex-1", isCollapsed ? "items-center gap-1" : "gap-1")}>
            <SidebarMenu className={cn("gap-1 w-full", isCollapsed && "flex flex-col items-center")}>
              {items.map((item) => {
                const isLocked = isUnverified && restrictedLabels.includes(item.label)
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild={!isLocked}
                      className={cn(
                        "h-11 px-4 transition-all duration-200 group group-data-[collapsible=icon]:size-11!",
                        isLocked && "cursor-not-allowed opacity-50 hover:bg-transparent text-sidebar-foreground/45"
                      )}
                    >
                      {isLocked ? (
                        <div
                          className={cn(
                            "flex w-full items-center justify-start text-sidebar-foreground/45 cursor-not-allowed",
                            isCollapsed && "justify-center px-0"
                          )}
                          title={user?.verificationStatus === "rejected" ? "Account rejected: access denied" : "Verification pending: this feature is restricted"}
                        >
                          <item.icon className="shrink-0 size-5!" />
                          <span className={cn(
                            "text-[15px] font-medium transition-all duration-200 ease-in-out inline-block overflow-hidden whitespace-nowrap",
                            isCollapsed ? "opacity-0 invisible w-0 -translate-x-4 scale-95" : "opacity-100 visible w-auto translate-x-0 ml-3 scale-100 delay-100"
                          )}>
                            {item.label}
                          </span>
                        </div>
                      ) : (
                        <Link
                          to={item.to as any}
                          className={cn(
                            "flex w-full items-center justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:bg-sidebar-accent focus-visible:text-sidebar-accent-foreground",
                            isCollapsed && "justify-center px-0",
                            (item.matchPaths ?? [item.to]).some(isActivePath)
                              ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                              : "text-sidebar-foreground/70"
                          )}
                        >
                          <item.icon className="shrink-0 size-5!" />
                          <span className={cn(
                            "text-[15px] font-medium transition-all duration-200 ease-in-out inline-block overflow-hidden whitespace-nowrap",
                            isCollapsed ? "opacity-0 invisible w-0 -translate-x-4 scale-95" : "opacity-100 visible w-auto translate-x-0 ml-3 scale-100 delay-100"
                          )}>
                            {item.label}
                          </span>
                        </Link>
                      )}
                    </SidebarMenuButton>
                    {!isCollapsed && isLocked && (
                      <SidebarMenuBadge className="right-4 bg-transparent text-sidebar-foreground/40 flex items-center justify-center shadow-none">
                        <Lock className="h-3.5 w-3.5" />
                      </SidebarMenuBadge>
                    )}
                    {!isCollapsed && !isLocked && item.badge && (
                      <SidebarMenuBadge className="right-4 bg-sidebar-primary text-sidebar-primary-foreground">
                        {item.badge}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={cn("bg-sidebar p-6 pt-0 transition-all duration-300", isCollapsed ? "p-0 py-8 pt-0 flex items-center justify-center" : "items-start")}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className={cn(
                "h-10 text-sidebar-foreground/80 hover:bg-red-500/10 hover:text-red-500 transition-colors px-4 group",
                isCollapsed && "px-0 justify-center group-data-[collapsible=icon]:size-10!"
              )}
              onClick={handleLogout}
            >
              <LogOut className={cn("size-5! transition-colors group-hover:text-red-500", !isCollapsed && "mr-3")} />
              <span className={cn(
                "text-[15px] font-medium transition-all duration-200 ease-in-out inline-block overflow-hidden whitespace-nowrap",
                isCollapsed ? "opacity-0 invisible w-0 -translate-x-4 scale-95" : "opacity-100 visible w-auto translate-x-0 ml-3 scale-100 delay-100"
              )}>
                Logout
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
