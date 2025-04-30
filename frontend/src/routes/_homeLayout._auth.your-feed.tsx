import { getArticlesFeedQueryOptions } from '@/api/gen'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import ArticleList from '@/components/Articles'

export const Route = createFileRoute('/_homeLayout/_auth/your-feed')({
  component: RouteComponent,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(getArticlesFeedQueryOptions()),
})

function RouteComponent() {
  const { data: articlePage } = useSuspenseQuery(getArticlesFeedQueryOptions())
  return (
    <div>
      <ArticleList articlePage={articlePage} />
    </div>
  )
}
