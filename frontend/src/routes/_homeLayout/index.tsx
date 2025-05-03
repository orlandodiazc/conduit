import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { listArticlesQueryOptions } from '@/api/gen'
import ArticleList from '@/components/Articles'

export const Route = createFileRoute('/_homeLayout/')({
  component: App,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(listArticlesQueryOptions()),
})

function App() {
  const { data: articlePage } = useSuspenseQuery(listArticlesQueryOptions())

  return (
    <div>
      <ArticleList articlePage={articlePage} />
    </div>
  )
}
