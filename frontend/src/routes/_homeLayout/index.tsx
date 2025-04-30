import { getArticlesQueryOptions } from '@/api/gen'
import ArticleList from '@/components/Articles'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_homeLayout/')({
  component: App,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(getArticlesQueryOptions()),
})

function App() {
  const { data: articlePage } = useSuspenseQuery(getArticlesQueryOptions({}))

  return (
    <div>
      <ArticleList articlePage={articlePage} />
    </div>
  )
}
