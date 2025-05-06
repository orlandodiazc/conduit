import { listArticlesQueryOptions } from '@/api/gen'
import ArticleList from '@/components/Articles'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Fragment } from 'react/jsx-runtime'
import { z } from 'zod'

export const Route = createFileRoute('/_homeLayout/')({
  validateSearch: z.object({
    limit: z.coerce.number().catch(10),
    offset: z.coerce.number().catch(0),
  }),
  component: App,
  loaderDeps: ({ search: { limit, offset } }) => ({ limit, offset }),
  loader: ({ context, deps }) =>
    context.queryClient.ensureQueryData(listArticlesQueryOptions(deps)),
})

export const generatePagination = (
  totalPages: number,
  currentPage: number,
): Array<'...' | number> => {
  // If the total number of pages is 7 or less,
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  // If the current page is among the first 3 pages,
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages]
  }

  // If the current page is among the last 3 pages,
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages]
  }

  // If the current page is somewhere in the middle
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ]
}

function App() {
  const search = Route.useSearch()
  const { data } = useSuspenseQuery(listArticlesQueryOptions(search))
  const totalPages = Math.ceil(data.totalArticles / 10)
  console.log(data.totalArticles)
  const currentPage = Math.floor(search.offset / search.limit) + 1
  const pageList = generatePagination(totalPages, currentPage)
  return (
    <div className="space-y-4">
      <ArticleList articlePage={data} />
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              to="/"
              search={(prev) => ({
                ...prev,
                offset: Math.max((prev.offset ?? 10) - (prev.limit ?? 0), 0),
              })}
              disabled={currentPage <= 1}
            />
          </PaginationItem>

          {pageList.map((value, index) => (
            <Fragment key={index}>
              {value === '...' ? (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem>
                  <PaginationLink
                    search={(prev) => ({
                      ...prev,
                      offset: (value - 1) * (prev.limit ?? 10),
                    })}
                    isActive={value === currentPage}
                  >
                    {value}
                  </PaginationLink>
                </PaginationItem>
              )}
            </Fragment>
          ))}

          <PaginationItem>
            <PaginationNext
              to="/"
              search={(prev) => ({
                ...prev,
                offset: (prev.offset ?? 0) + (prev.limit ?? 10),
              })}
              disabled={currentPage >= totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
