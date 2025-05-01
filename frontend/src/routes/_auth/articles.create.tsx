import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/articles/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/articles/create"!</div>
}
