import {
  createRouter,
  createRoute,
  createRootRoute,
  redirect,
  Outlet,
} from "@tanstack/react-router"
import { App } from "./App"
import { Login } from "./pages/Login"

const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
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

const routeTree = rootRoute.addChildren([indexRoute, loginRoute])

export const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
