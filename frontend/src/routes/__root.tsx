import { createRootRoute, Outlet } from '@tanstack/react-router'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ScrollRestoration from '../components/ScrollRestoration'

export const Route = createRootRoute({
    component: () => (
        <>
            <ScrollRestoration />
            <Navbar />
            <Outlet />
            <Footer />
            {/* <TanStackRouterDevtools /> */}
        </>
    ),
})
