import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Heart } from 'lucide-react'
import type { GetArticlesQueryResponse } from '@/api/gen'
import {
  getArticlesFeedQueryOptions,
  getArticlesQueryOptions,
  getTagsQueryOptions,
} from '@/api/gen'
import { useAuth } from '@/auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import UserAvatar from '@/components/UserAvatar'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/')({
  component: App,
  loader: ({ context }) => {
    const articlesPromise = context.queryClient.ensureQueryData(
      getArticlesQueryOptions(),
    )
    const tagsPromise = context.queryClient.ensureQueryData(
      getTagsQueryOptions(),
    )
    const promises = [articlesPromise, tagsPromise]
    if (context.isAuthenticated) {
      const articleFeed = context.queryClient.ensureQueryData(
        getArticlesFeedQueryOptions(),
      )
      promises.push(articleFeed)
    }
    return Promise.all(promises)
  },
})

function App() {
  const { isAuthenticated } = useAuth()
  const {
    data: { articles },
  } = useSuspenseQuery(getArticlesQueryOptions({}))
  const {
    data: { tags },
  } = useSuspenseQuery(getTagsQueryOptions())

  return (
    // <>
    //   <h2>Global</h2>
    //   {JSON.stringify(articles)}
    //   <h2>Tags</h2>
    //   {JSON.stringify(tags)}
    //   <h2>Feed</h2>
    //   {isAuthenticated && <Feed />}
    // </>
    <>
      <div>
        <h2>Tags</h2>
        <div className="flex gap-2">
          {tags.map((tagName) => (
            <Badge>{tagName}</Badge>
          ))}
        </div>
      </div>
      <Tabs defaultValue="global" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="feed">Feed</TabsTrigger>
        </TabsList>
        <TabsContent value="global" className="space-y-4">
          {articles.map((article) => (
            <ArticleCard article={article} key={article.slug} />
          ))}
        </TabsContent>
        <TabsContent value="feed">
          <Card>waiting for CardContent</Card>
        </TabsContent>
      </Tabs>
    </>
  )
}

function ArticleCard({
  article,
}: {
  article: GetArticlesQueryResponse['articles'][number]
}) {
  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div className="flex items-center gap-2">
          <Link
            to="/profile/$username"
            params={{ username: article.author.username }}
          >
            <UserAvatar
              src={article.author.image}
              fallbackName={article.author.username}
            />
          </Link>
          <div className="leading-tight grid">
            <div>
              <Link
                to="/profile/$username"
                params={{ username: article.author.username }}
                className="truncate text-sm font-medium"
              >
                {article.author.username}
              </Link>
            </div>
            <span className="truncate text-xs text-muted-foreground">
              {new Date(article.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
        <Button variant="secondary" size="sm">
          <Heart />
          {article.favoritesCount}
        </Button>
      </CardHeader>
      <CardContent className="mb-2">
        <Link to="/articles/$slug" params={{ slug: article.slug }}>
          <CardTitle className="mb-1">{article.title}</CardTitle>
        </Link>
        <CardDescription>{article.description}</CardDescription>
      </CardContent>
      <CardFooter className="justify-between items-center">
        <Link
          to="/articles/$slug"
          params={{ slug: article.slug }}
          className="text-sm text-muted-foreground"
        >
          Read more...
        </Link>
        <div className="flex gap-2">
          {article.tagList.map((tagName) => (
            <Badge variant="secondary">{tagName}</Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}

// function Feed() {
//   const {
//     data: { articles: articleFeed },
//   } = useSuspenseQuery(getArticlesFeedQueryOptions({}))

//   return <div>{JSON.stringify(articleFeed)}</div>
// }
