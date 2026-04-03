import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import { Outlet, useLocation } from "@tanstack/react-router"

export function App() {
  const location = useLocation()
  
  // Get title based on current path
  const getPageTitle = () => {
    const path = location.pathname
    if (path === "/") return "Dashboard Overview"
    if (path === "/plans/create") return "Create Travel Plan"
    if (path.startsWith("/plans/edit/")) return "Edit Details"
    if (path === "/packages") return "Packages"
    if (path.startsWith("/packages/")) return "Package Details"
    return "Dashboard"
  }

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex shrink-0 items-center justify-between gap-2 border-b px-5 py-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-bold">{getPageTitle()}</h1>
          </div>
          <TopBar />
        </header>

        <main className="flex-1 overflow-y-auto px-5 pt-4 pb-6 bg-slate-50/50">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App
