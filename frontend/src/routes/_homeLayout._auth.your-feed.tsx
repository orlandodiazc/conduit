import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { listArticleFeedQueryOptions } from '@/api/gen'

import ArticleList from '@/components/Articles'

export const Route = createFileRoute('/_homeLayout/_auth/your-feed')({
  component: RouteComponent,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(listArticleFeedQueryOptions()),
})

function RouteComponent() {
  const { data: articlePage } = useSuspenseQuery(listArticleFeedQueryOptions())
  return (
    <div>
      <ArticleList articlePage={articlePage} />
    </div>
  )
}
