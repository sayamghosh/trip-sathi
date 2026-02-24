import { createLazyFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/guides')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
