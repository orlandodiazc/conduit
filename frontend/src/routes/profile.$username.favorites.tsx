import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { listArticlesQueryOptions } from '@/api/gen'
import ArticleList from '@/components/Articles'

export const Route = createFileRoute('/profile/$username/favorites')({
  component: RouteComponent,
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      listArticlesQueryOptions({ favorited: params.username }),
    ),
})

function RouteComponent() {
  const { username } = Route.useParams()
  const { data: articlePage } = useSuspenseQuery(
    listArticlesQueryOptions({ favorited: username }),
  )
  return (
    <div>
      <ArticleList articlePage={articlePage} />
    </div>
  )
}
