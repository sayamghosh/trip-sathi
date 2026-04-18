import { createLazyFileRoute } from '@tanstack/react-router'
import ViewAllPackagesPage from '../pages/ViewAllPackagesPage'

export const Route = createLazyFileRoute('/allpackages')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ViewAllPackagesPage />
}
