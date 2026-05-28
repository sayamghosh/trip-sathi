import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/TopBar"
import { Outlet, useLocation } from "@tanstack/react-router"
import { Link } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import api from "@/lib/axios"
import { Toaster } from "sonner"


export function App() {
  const location = useLocation()
  const pathname = location.pathname
  
  // Get title based on current path
  const getPageTitle = () => {
    if (pathname === "/") return "Dashboard Overview"
    if (pathname === "/packages/new") return "Create Package"
    if (pathname.startsWith("/packages/") && pathname.endsWith("/edit")) return "Edit Details"
    if (pathname === "/packages") return "Packages"
    if (pathname.startsWith("/packages/")) return "Package Details"
    if (pathname === "/bookings") return "Bookings"
    if (pathname === "/calendar") return "Calendar"
    if (pathname === "/billing") return "Billing & Subscription"
    if (pathname === "/travelers") return "Traveler Requests"
    return "Dashboard"

  }

  const buildBreadcrumbs = () => {
    if (pathname === "/") {
      return [{ label: "Dashboard" }]
    }

    const segments = pathname.split("/").filter(Boolean)
    const crumbs: { label: string; to?: string }[] = [{ label: "Dashboard", to: "/" }]
    const labelMap: Record<string, string> = {
      packages: "Packages",
      new: "New Package",
      edit: "Edit",
      bookings: "Bookings",
      calendar: "Calendar",
      billing: "Billing",
      travelers: "Travelers",
    }


    let currentPath = ""
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const previous = segments[index - 1]

      if (segment === "packages") {
        crumbs.push({ label: labelMap[segment], to: currentPath })
        return
      }

      if (segment === "bookings") {
        crumbs.push({ label: labelMap[segment], to: currentPath })
        return
      }

      if (segment === "calendar") {
        crumbs.push({ label: labelMap[segment], to: currentPath })
        return
      }

      if (segment === "billing") {
        crumbs.push({ label: labelMap[segment], to: currentPath })
        return
      }

      if (segment === "travelers") {
        crumbs.push({ label: labelMap[segment], to: currentPath })
        return
      }


      if (segment === "new") {
        crumbs.push({ label: labelMap.new })
        return
      }

      if (segment === "edit") {
        crumbs.push({ label: labelMap.edit })
        return
      }

      if (previous === "packages") {
        crumbs.push({ label: "Package Details" })
        return
      }
    })

    return crumbs
  }

  const breadcrumbs = buildBreadcrumbs()

  const [user, setUser] = useState<{ id?: string; verificationStatus?: string; credits?: number; planExpiresAt?: string } | null>(() => {
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  })
  const status = user?.verificationStatus
  const credits = user?.credits ?? 0
  const planExpiresAt = user?.planExpiresAt
  const getDaysRemaining = () => {
    if (!planExpiresAt) return 0
    const diff = new Date(planExpiresAt).getTime() - new Date().getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 0
  }
  const daysRemaining = getDaysRemaining()
  const hasAccess = credits > 0 || daysRemaining > 0

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    const fetchLatestProfile = async () => {
      try {
        const response = await api.get("/api/profile/me")
        const updatedUser = response.data.user
        if (updatedUser) {
          const currentStr = localStorage.getItem("user")
          const updatedStr = JSON.stringify(updatedUser)
          if (currentStr !== updatedStr) {
            localStorage.setItem("user", updatedStr)
            setUser(updatedUser)
            // Dispatch dynamic update event to synchronize other components instantly
            window.dispatchEvent(new Event("user-updated"))
          }
        }
      } catch (err: any) {
        console.error("Error fetching latest profile:", err)
        if (err.response?.status === 401 || err.response?.status === 404) {
          handleLogout()
        }
      }
    }

    // Initial fetch
    void fetchLatestProfile()

    // Poll every 3 seconds for instant updates
    const interval = setInterval(fetchLatestProfile, 3000)
    return () => clearInterval(interval)
  }, [])


  if (status === "rejected") {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-950 font-sans p-6">
        <div className="relative w-full max-w-lg overflow-hidden rounded-[32px] border border-red-500/20 bg-slate-900/60 p-8 text-center shadow-2xl shadow-red-950/20 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.1),transparent_50%)]" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500/10 text-red-500 shadow-inner shadow-red-500/20 ring-1 ring-red-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            
            <h1 className="mb-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Access Restricted
            </h1>
            
            <div className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-400">
              Account Not Approved
            </div>
            
            <p className="mb-8 text-sm leading-relaxed text-slate-400">
              Your travel agent/guide registration was not approved by our compliance team. Consequently, your dashboard access is restricted.
              <br className="hidden sm:inline" />
              If you believe this is an error or have questions regarding validation, please contact our support desk.
            </p>
            
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              <a 
                href="mailto:support@tripsathi.com?subject=Agent%20Account%20Verification%20Appeal"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm px-6 shadow-lg shadow-red-950/50 transition-colors"
              >
                Contact Support
              </a>
              <button 
                onClick={handleLogout}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800 text-slate-300 font-bold text-sm px-6 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="flex flex-col h-screen overflow-hidden">
        <header className="flex h-[72px] shrink-0 items-center justify-between gap-2 border-b px-5 bg-background">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex flex-col gap-1">
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) => {
                    const isLast = index === breadcrumbs.length - 1
                    const content = crumb.to && !isLast ? (
                      <BreadcrumbLink asChild>
                        <Link to={crumb.to}>{crumb.label}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    )

                    return (
                      <BreadcrumbItem key={`${crumb.label}-${index}`}>
                        {content}
                        {!isLast && <BreadcrumbSeparator />}
                      </BreadcrumbItem>
                    )
                  })}
                </BreadcrumbList>
              </Breadcrumb>
              <h1 className={cn("text-xl font-bold", breadcrumbs.length > 1 && "leading-tight")}>
                {getPageTitle()}
              </h1>
            </div>
          </div>
          <TopBar />
        </header>

        <main className="flex-1 overflow-y-auto px-5 pt-4 pb-6 bg-background">
          {status === "approved" && !hasAccess && (
            <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-red-500/10 bg-red-500/5 p-4 text-red-500 backdrop-blur-md animate-in slide-in-from-top duration-300">
              <div className="flex items-start sm:items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500 shadow-sm ring-1 ring-red-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-foreground">Display Visibility Suspended</h4>
                  <p className="text-[12.5px] font-medium text-muted-foreground/80 mt-0.5 leading-snug">
                    Your credits are exhausted and subscription validity is inactive. All your published tour plans are currently offline. Please recharge to display them publicly again.
                  </p>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <Link to="/billing">
                  <button className="h-8.5 px-4 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-[12px] transition-colors cursor-pointer border border-red-500/20">
                    Recharge Visibility
                  </button>
                </Link>
              </div>
            </div>
          )}

          {status === "pending" && (
            <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-amber-500/10 bg-amber-500/5 p-4 text-amber-500 backdrop-blur-md animate-in slide-in-from-top duration-300">
              <div className="flex items-start sm:items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 shadow-sm ring-1 ring-amber-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-foreground">Account Under Compliance Review</h4>
                  <p className="text-[12.5px] font-medium text-muted-foreground/80 mt-0.5 leading-snug">
                    Your agent credentials are currently being reviewed. You can draft packages and set up your profile, but these features will not be visible to public travellers until approved.
                  </p>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <Link to="/profile">
                  <button className="h-8.5 px-4 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-[12px] transition-colors cursor-pointer border border-amber-500/20">
                    View Verification Profile
                  </button>
                </Link>
              </div>
            </div>
          )}
          <Outlet />
        </main>
      </SidebarInset>
      <Toaster richColors position="top-right" />
    </SidebarProvider>
  )
}

export default App
