import { useSuspenseQuery } from '@tanstack/react-query'
import {
  Link,
  Outlet,
  createFileRoute,
  useParams,
} from '@tanstack/react-router'
import { getTagsQueryOptions } from '@/api/gen'
import { useAuth } from '@/auth'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/_homeLayout')({
  component: RouteComponent,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(getTagsQueryOptions()),
})

function RouteComponent() {
  const {
    data: { tags },
  } = useSuspenseQuery(getTagsQueryOptions())
  const { tag } = useParams({ strict: false })
  const { isAuthenticated } = useAuth()
  return (
    <div>
      <h1 className="text-h1 mb-6">Browse</h1>
      <div className="grid grid-flow-col grid-cols-1 gap-6">
        <div>
          <div className="text-muted-foreground border-b flex">
            <div className="p-2">
              <Link to="/" className="[&.active]:text-foreground">
                Global Feed
              </Link>
            </div>
            {isAuthenticated && (
              <div className="p-2">
                <Link to="/your-feed" className="[&.active]:text-foreground">
                  Your Feed
                </Link>
              </div>
            )}
            {tag && (
              <div className="p-2">
                <Link
                  to="/tag-feed/$tag"
                  params={{ tag }}
                  className="[&.active]:text-foreground"
                >
                  #{tag}
                </Link>
              </div>
            )}
          </div>
          <Outlet />
        </div>
        <aside className="self-start p-4 rounded-lg bg-sidebar w-2xs">
          <h2 className="text-h3 mb-2">Popular tags</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tagName) => (
              <Badge asChild variant="outline" key={tagName}>
                <Link
                  to="/tag-feed/$tag"
                  params={{ tag: tagName }}
                  className="[&.active]:bg-foreground [&.active]:text-background [&.active]:hover:bg-foreground [&.active]:hover:text-background"
                >
                  {tagName}
                </Link>
              </Badge>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
