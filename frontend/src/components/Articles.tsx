import { Link, useNavigate } from '@tanstack/react-router'
import { Heart } from 'lucide-react'
import { Fragment } from 'react/jsx-runtime'
import UserAvatar from './UserAvatar'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Separator } from './ui/separator'

import type { MultipleArticlesResponse } from '@/api/gen'
import { useFavoriteArticle } from '@/api/gen'
import { useAuth } from '@/auth'

export default function ArticleList({
  articlePage,
}: {
  articlePage: MultipleArticlesResponse
}) {
  return (
    <>
      {articlePage.articles.map((article) => (
        <Fragment key={article.id}>
          <ArticleCard article={article} />
          <Separator />
        </Fragment>
      ))}
    </>
  )
}

export function ArticleAuthorInfo({
  article,
}: {
  article: MultipleArticlesResponse['articles'][number]
}) {
  return (
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
  )
}

function ArticleCard({
  article,
}: {
  article: MultipleArticlesResponse['articles'][number]
}) {
  const { isAuthenticated } = useAuth()
  const { mutate, isPending } = useFavoriteArticle()
  const navigate = useNavigate()
  function handleFavorite() {
    if (!isAuthenticated) {
      navigate({ to: '/login', search: { redirect: location.pathname } })
    } else {
      mutate({ id: Number(article.id) })
    }
  }
  return (
    <Card className="border-0">
      <CardHeader className="flex justify-between px-0">
        <ArticleAuthorInfo article={article} />
        <Button
          variant={article.favorited ? 'secondary' : 'outline'}
          size="sm"
          onClick={handleFavorite}
          disabled={isPending}
        >
          {article.favorited ? (
            <Heart className="fill-foreground" />
          ) : (
            <Heart />
          )}
          {article.favoritesCount}
        </Button>
      </CardHeader>
      <CardContent className="mb-2 px-0">
        <Link
          to="/articles/$id/$slug"
          params={{ slug: article.slug, id: String(article.id) }}
        >
          <CardTitle className="mb-1">{article.title}</CardTitle>
        </Link>
        <CardDescription>{article.description}</CardDescription>
      </CardContent>
      <CardFooter className="justify-between items-center px-0">
        <Link
          to="/articles/$id/$slug"
          params={{ slug: article.slug, id: String(article.id) }}
          className="text-sm text-muted-foreground"
        >
          Read more...
        </Link>
        <div className="flex gap-2">
          {article.tagList.map((tagName) => (
            <Badge key={tagName}>{tagName}</Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}
