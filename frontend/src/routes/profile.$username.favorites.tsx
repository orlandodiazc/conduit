import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { getArticlesQueryOptions } from '@/api/gen'

export const Route = createFileRoute('/profile/$username/favorites')({
  component: RouteComponent,
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      getArticlesQueryOptions({ favorited: params.username }),
    ),
})

function RouteComponent() {
  const { username } = Route.useParams()
  const { data } = useSuspenseQuery(
    getArticlesQueryOptions({ favorited: username }),
  )
  return <div>{JSON.stringify(data)}</div>
}
