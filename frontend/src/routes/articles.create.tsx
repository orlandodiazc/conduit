import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/articles/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/articles/create"!</div>
}
