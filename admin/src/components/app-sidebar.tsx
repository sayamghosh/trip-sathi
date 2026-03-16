import {
  LayoutDashboard,
  Package,
  BookOpen,
  CalendarDays,
  Users,
  Compass,
  ImageIcon,
  MessageCircle,
  Tag,
  MessageSquareText,
  LogOut,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  { icon: LayoutDashboard, label: "Dashboard", url: "#", active: true },
  { icon: Package, label: "Packages", url: "#" },
  { icon: BookOpen, label: "Bookings", url: "#" },
  { icon: CalendarDays, label: "Calendar", url: "#" },
  { icon: Users, label: "Travelers", url: "#" },
  { icon: Compass, label: "Guides", url: "#" },
  { icon: ImageIcon, label: "Gallery", url: "#" },
  { icon: MessageCircle, label: "Messages", url: "#", badge: 7 },
  { icon: Tag, label: "Deals", url: "#" },
  { icon: MessageSquareText, label: "Feedback", url: "#" },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Compass className="size-4" />
          </div>
          <span className="text-sm font-semibold truncate">
            Travelie
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild isActive={item.active}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                  {item.badge && (
                    <SidebarMenuBadge>
                      {item.badge}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
