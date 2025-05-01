import type {
  GetArticleCommentsQueryResponse,
  GetArticlesQueryResponse,
} from '@/api/gen'
import {
  getArticleCommentsQueryOptions,
  getArticleQueryOptions,
  getArticlesQueryOptions,
  useCreateArticleFavorite,
  useDeleteArticle,
  useDeleteArticleFavorite,
  useFollowUserByUsername,
} from '@/api/gen'
import { useAuth } from '@/auth'
import { ArticleAuthorInfo } from '@/components/Articles'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import UserAvatar from '@/components/UserAvatar'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Edit, Trash, Trash2 } from 'lucide-react'

export const Route = createFileRoute('/articles/$slug')({
  component: RouteComponent,
  loader: ({ context, params }) => {
    const articlesPromise = context.queryClient.ensureQueryData(
      getArticleQueryOptions(params.slug),
    )
    const commentsPromise = context.queryClient.ensureQueryData(
      getArticleCommentsQueryOptions(params.slug),
    )
    return Promise.all([articlesPromise, commentsPromise])
  },
})

function RouteComponent() {
  const { slug } = Route.useParams()
  const {
    data: { article },
  } = useSuspenseQuery(getArticleQueryOptions(slug))
  const {
    data: { comments },
  } = useSuspenseQuery(getArticleCommentsQueryOptions(slug))
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="grid space-y-6 py-6">
      <h1 className="text-3xl mb-2 font-extrabold">{article.title}</h1>
      <ArticleMetaActions article={article} />
      <p>{article.description}</p>
      <div className="flex gap-2 flex-wrap">
        {article.tagList.map((tagName) => (
          <Badge key={tagName}>{tagName}</Badge>
        ))}
      </div>
      <Separator />
      <div className="m-auto mb-6">
        <ArticleMetaActions article={article} />
      </div>
      <div className="m-auto min-w-3xl">
        <div className="space-y-3">
          {comments.map((comment) => (
            <Card className="py-0 gap-2">
              <CardContent className="pt-3">
                <p>{comment.body}</p>
              </CardContent>
              <CardFooter className="bg-accent py-3 rounded-b-xl flex justify-between items-center">
                <CommentAuthorInfo comment={comment} />
                {user?.username === comment.author.username && (
                  <Button variant="destructive" className="size-8">
                    <Trash2 />
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
          {!isAuthenticated && (
            <p className="text-sm text-muted-foreground mt-5">
              <Link to="/login" className="hover:underline text-foreground">
                Login
              </Link>{' '}
              or{' '}
              <Link to="/register" className="hover:underline text-foreground">
                Register
              </Link>{' '}
              to add comments on this article.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function CommentAuthorInfo({
  comment,
}: {
  comment: GetArticleCommentsQueryResponse['comments'][number]
}) {
  return (
    <div className="flex gap-2 items-center">
      <Link
        to="/profile/$username"
        params={{ username: comment.author.username }}
      >
        <UserAvatar
          className="size-5"
          src={comment.author.image}
          fallbackName={comment.author.username}
        />
      </Link>
      <Link
        to="/profile/$username"
        params={{ username: comment.author.username }}
        className="truncate text-xs font-medium"
      >
        {comment.author.username}
      </Link>
      <span className="truncate text-xs text-muted-foreground">
        {new Date(comment.createdAt).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </span>
    </div>
  )
}

function ArticleMetaActions({
  article,
}: {
  article: GetArticlesQueryResponse['articles'][number]
}) {
  const { user } = useAuth()
  const navigate = useNavigate()

  const isArticleAuthor = user?.username === article.author.username
  const deleteArticleMutation = useDeleteArticle({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getArticlesQueryOptions({
            author: article.author.username,
          }).queryKey,
        })
        navigate({
          to: '/profile/$username',
          params: { username: article.author.username },
        })
      },
    },
  })
  const favoriteArticleMutation = useCreateArticleFavorite()
  const deleteFavoriteArticleMutation = useDeleteArticleFavorite()
  const followAuthorMutation = useFollowUserByUsername()
  const queryClient = useQueryClient()
  function handleDeleteArticle() {
    deleteArticleMutation.mutate({ slug: article.slug })
  }

  function handleFavoriteArticle() {
    const mutation = article.favorited
      ? deleteFavoriteArticleMutation
      : favoriteArticleMutation

    mutation.mutate(
      { slug: article.slug },
      {
        onSuccess: (data) => {
          queryClient.setQueryData(
            getArticleQueryOptions(article.slug).queryKey,
            data,
          )
          navigate({
            to: '/articles/$slug',
            params: { slug: article.slug },
          })
        },
      },
    )
  }

  function handleFollowAuthor() {
    followAuthorMutation.mutate({ username: article.author.username })
  }

  return (
    <div className="flex gap-16">
      <ArticleAuthorInfo article={article} />
      <div className="flex gap-4">
        {article.author.username !== user?.username && (
          <Button
            variant={article.author.following ? 'destructive' : 'secondary'}
            disabled={
              followAuthorMutation.isPending ||
              deleteFavoriteArticleMutation.isPending
            }
            onClick={handleFollowAuthor}
          >
            {article.author.following
              ? `Follow ${article.author.username}`
              : `Unfollow ${article.author.username}`}
          </Button>
        )}
        <Button
          disabled={favoriteArticleMutation.isPending}
          onClick={handleFavoriteArticle}
          variant={article.favorited ? 'destructive' : 'default'}
        >
          {article.favorited
            ? `Unfavorite post (${article.favoritesCount})`
            : `Favorite post (${article.favoritesCount})`}
        </Button>
        {isArticleAuthor && (
          <>
            <Button asChild variant="secondary">
              <Link to="/articles/$slug/edit" params={{ slug: article.slug }}>
                <Edit /> Edit article
              </Link>
            </Button>
            <Button
              variant="destructive"
              disabled={deleteArticleMutation.isPending}
              onClick={handleDeleteArticle}
            >
              <Trash /> Delete article
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
