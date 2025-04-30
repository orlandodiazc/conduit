import type { GetArticlesQueryResponse } from '@/api/gen'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Link } from '@tanstack/react-router'
import UserAvatar from './UserAvatar'
import { Button } from './ui/button'
import { Heart } from 'lucide-react'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'

export default function ArticleList({
  articlePage,
}: {
  articlePage: GetArticlesQueryResponse
}) {
  return (
    <>
      {articlePage.articles.map((article) => (
        <>
          <ArticleCard article={article} key={article.slug} />
          <Separator />
        </>
      ))}
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
