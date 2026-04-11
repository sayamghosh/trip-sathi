import {
  createRouter,
  createRoute,
  createRootRoute,
  redirect,
  Outlet,
} from "@tanstack/react-router"
import { App } from "./App"
import { Login } from "./pages/Login"
import { Dashboard } from "./pages/Dashboard"
import CreatePlanPage from "@/components/package/CreatePlanPage"
import { PackagePage } from "@/components/package/PackagePage"
import PackageDetailPage from "@/components/package/PackageDetailPage"
import Bookings from "./pages/Bookings"
import Calendar from "./pages/Calendar"


const rootRoute = createRootRoute({
  component: Outlet,
})

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: App,
  beforeLoad: () => {
    const token = localStorage.getItem("token")
    if (!token) {
      throw redirect({
        to: "/login",
      })
    }
  },
})

const indexRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: Dashboard,
})

const createPlanRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/packages/new",
  component: CreatePlanPage,
})

const editPlanRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/packages/$packageId/edit",
  component: CreatePlanPage,
})

const packagesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/packages",
  component: PackagePage,
})

const packageDetailRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/packages/$packageId",
  component: PackageDetailPage,
})

const bookingsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/bookings",
  component: Bookings,
})

const calendarRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/calendar",
  component: Calendar,
})


const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
  beforeLoad: () => {
    const token = localStorage.getItem("token")
    if (token) {
      throw redirect({
        to: "/",
      })
    }
  },
})

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    indexRoute,
    createPlanRoute,
    editPlanRoute,
    packagesRoute,
    packageDetailRoute,
    bookingsRoute,
    calendarRoute,
  ]),

  loginRoute,
])

export const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
