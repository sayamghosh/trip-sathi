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

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Package, label: "Packages" },
  { icon: BookOpen, label: "Bookings" },
  { icon: CalendarDays, label: "Calendar" },
  { icon: Users, label: "Travelers" },
  { icon: Compass, label: "Guides" },
  { icon: ImageIcon, label: "Gallery" },
  { icon: MessageCircle, label: "Messages", badge: 7 },
  { icon: Tag, label: "Deals" },
  { icon: MessageSquareText, label: "Feedback" },
]

export function Sidebar() {
  return (
    <aside
      style={{ width: 175 }}
      className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-[#E4EAF1] bg-white"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 pb-2 pt-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2E7CF6]">
          <Compass className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="text-[15px] font-bold tracking-tight text-[#1A2B3D]">
          Travelie
        </span>
      </div>

      {/* Nav */}
      <nav className="mt-3 flex-1 overflow-y-auto px-2.5">
        <ul className="space-y-[2px]">
          {navItems.map((item) => (
            <li key={item.label}>
              <button
                className={`flex w-full items-center gap-2.5 rounded-[10px] px-2.5 py-[9px] text-[13px] font-medium transition-all ${
                  item.active
                    ? "bg-[#2E7CF6] text-white shadow-[0_2px_8px_rgba(46,124,246,0.35)]"
                    : "text-[#6B7F95] hover:bg-[#F0F4F8] hover:text-[#1A2B3D]"
                }`}
              >
                <item.icon className="h-[16px] w-[16px]" strokeWidth={1.8} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-auto flex h-[18px] w-[18px] items-center justify-center rounded-full text-[9px] font-bold ${
                      item.active
                        ? "bg-white/20 text-white"
                        : "bg-[#2E7CF6] text-white"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Upgrade Card */}
      <div className="mx-2.5 mb-2.5">
        <div className="rounded-[14px] bg-gradient-to-br from-[#2E7CF6] to-[#1B5FCC] px-4 py-4 text-white">
          <p className="text-[12px] font-semibold leading-[1.4]">
            Enhance Your
            <br />
            Travelie Experience!
          </p>
          <button className="mt-3 rounded-[8px] bg-white px-4 py-[6px] text-[11px] font-semibold text-[#2E7CF6] transition hover:bg-blue-50">
            Upgrade Now
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="border-t border-[#E4EAF1] px-2.5 py-2.5">
        <button className="flex w-full items-center gap-2.5 rounded-[10px] px-2.5 py-[9px] text-[13px] font-medium text-[#6B7F95] transition hover:bg-red-50 hover:text-red-500">
          <LogOut className="h-[16px] w-[16px]" strokeWidth={1.8} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
