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
} from "@/components/ui/sidebar"
import { Link } from "@tanstack/react-router"


// Menu items according to the UI image
const items = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/" },
  { icon: Package, label: "Packages", to: "/packages" },
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
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="bg-white px-6 py-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3B82F6] text-white shadow-lg shadow-blue-200">
            <Compass className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#1A2B3D]">Travelie</span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="bg-white px-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    className="h-11 px-4 transition-all duration-200 hover:bg-slate-50 group"
                  >
                    <Link
                      to={item.to as any}
                      activeProps={{
                        className: "bg-[#3B82F6] text-white hover:bg-[#3B82F6] shadow-md shadow-blue-100",
                      }}
                      inactiveProps={{
                         className: "text-[#8896A6] hover:text-[#1A2B3D]",
                      }}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span className="text-[15px] font-medium">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.badge && (
                    <SidebarMenuBadge className="right-4 bg-[#3B82F6] text-white">
                      {item.badge}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-white p-6 pt-0">


        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-10 text-[#8896A6] hover:bg-red-50 hover:text-red-500 transition-colors px-4 group"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3 transition-colors group-hover:text-red-500" />
              <span className="text-[15px] font-medium">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
