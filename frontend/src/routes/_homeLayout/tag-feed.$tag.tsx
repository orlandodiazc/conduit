import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { listArticlesQueryOptions } from '@/api/gen'
import ArticleList from '@/components/Articles'

export const Route = createFileRoute('/_homeLayout/tag-feed/$tag')({
  component: RouteComponent,
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      listArticlesQueryOptions({ tag: params.tag }),
    ),
})

function RouteComponent() {
  const { tag } = Route.useParams()
  const { data: articlePage } = useSuspenseQuery(
    listArticlesQueryOptions({ tag }),
  )
  return (
    <div>
      <ArticleList articlePage={articlePage} />
    </div>
  )
}
