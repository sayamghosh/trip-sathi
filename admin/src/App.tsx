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

        <main className="flex-1 overflow-y-auto px-5 pt-4 pb-6 bg-slate-50/50">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App
