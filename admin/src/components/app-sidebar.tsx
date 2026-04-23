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
} from "lucide-react"

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


// Menu items according to the UI image
const items = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/" },
  { icon: Package, label: "Packages", to: "/packages", matchPaths: ["/packages"] },
  { icon: BookCheck, label: "Bookings", to: "/bookings" },
  { icon: CalendarDays, label: "Calendar", to: "/calendar" },
  { icon: Users, label: "Travelers", to: "/travelers" },
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

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

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
              {items.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    className="h-11 px-4 transition-all duration-200 group group-data-[collapsible=icon]:size-11!"
                  >
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
                  </SidebarMenuButton>
                  {!isCollapsed && item.badge && (
                    <SidebarMenuBadge className="right-4 bg-sidebar-primary text-sidebar-primary-foreground">
                      {item.badge}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
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
