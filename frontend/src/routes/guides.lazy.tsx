import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/guides')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/guides"!</div>
}
