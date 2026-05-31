import { useState, useEffect } from "react"
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
import api from "@/lib/axios"

export function App() {
  const location = useLocation()
  const pathname = location.pathname

  const [user, setUser] = useState<any>(() => {
    const storedUser = localStorage.getItem("user")
    return storedUser ? JSON.parse(storedUser) : null
  })

  useEffect(() => {
    const fetchFreshProfile = async () => {
      try {
        const response = await api.get("/api/profile/me")
        localStorage.setItem("user", JSON.stringify(response.data))
        setUser(response.data)
      } catch (error) {
        console.error("Failed to fetch fresh user profile:", error)
      }
    }
    fetchFreshProfile()
  }, [pathname])
  
  // Get title based on current path
  const getPageTitle = () => {
    if (pathname === "/") return "Dashboard Overview"
    if (pathname === "/packages/new") return "Create Package"
    if (pathname.startsWith("/packages/") && pathname.endsWith("/edit")) return "Edit Details"
    if (pathname === "/packages") return "Packages"
    if (pathname.startsWith("/packages/")) return "Package Details"
    if (pathname === "/bookings") return "Bookings"
    if (pathname === "/calendar") return "Calendar"
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
          {user && user.isActive === false && (
            <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-md p-5 text-sm text-red-300 flex items-start gap-4 shadow-[0_8px_30px_rgb(239,68,68,0.03)] animate-in slide-in-from-top-4 duration-500">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-semibold shadow-sm">
                ❌
              </div>
              <div className="space-y-1">
                <p className="font-bold text-[14px] text-red-400">Your validity has expired !</p>
                <p className="text-[12px] text-red-300/80 leading-relaxed max-w-[900px]">
                  Your validity has expired. Please contact the support team. 9477273201
                </p>
              </div>
            </div>
          )}
          {user && user.isAuthorized === false && (
            <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-md p-5 text-sm text-amber-300 flex items-start gap-4 shadow-[0_8px_30px_rgb(245,158,11,0.03)] animate-in slide-in-from-top-4 duration-500">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold shadow-sm">
                ⚠️
              </div>
              <div className="space-y-1">
                <p className="font-bold text-[14px] text-amber-400">Verification in Progress • Estimated Time: 1–48 Hours</p>
                <p className="text-[12px] text-amber-300/80 leading-relaxed max-w-[900px]">
                  Your guide portfolio is currently undergoing verification by our administrators. While under review, you can design and save travel experiences, manage business coordinates, and inspect stats. Tour packages will remain hidden from travelers until your profile has been authorized.
                </p>
              </div>
            </div>
          )}
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App
