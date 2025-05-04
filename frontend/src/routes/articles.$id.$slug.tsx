import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Edit, Trash, Trash2 } from 'lucide-react'

import {
  getArticleQueryOptions,
  getCommentsQueryOptions,
  listArticlesQueryOptions,
  useCreateUserFollow,
  useDeleteArticle,
  useDeleteArticleFavorite,
  useDeleteUserFollow,
  useFavoriteArticle,
  type CreateCommentMutationRequest,
  type GetCommentsQueryResponse,
  type ListArticlesQueryResponse,
} from '@/api/gen'
import { useAuth } from '@/auth'
import { ArticleAuthorInfo } from '@/components/Articles'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import UserAvatar from '@/components/UserAvatar'
import { useAppForm } from '@/hooks/form'

export const Route = createFileRoute('/articles/$id/$slug')({
  component: RouteComponent,
  loader: ({ context, params }) => {
    const articlesPromise = context.queryClient.ensureQueryData(
      getArticleQueryOptions(Number(params.id)),
    )
    const commentsPromise = context.queryClient.ensureQueryData(
      getCommentsQueryOptions(Number(params.id)),
    )
    return Promise.all([articlesPromise, commentsPromise])
  },
})

function RouteComponent() {
  const { id } = Route.useParams()
  const {
    data: { article },
  } = useSuspenseQuery(getArticleQueryOptions(Number(id)))
  const {
    data: { comments },
  } = useSuspenseQuery(getCommentsQueryOptions(Number(id)))
  const { isAuthenticated, user } = useAuth()

  const form = useAppForm({
    defaultValues: {
      body: '',
    } as CreateCommentMutationRequest['comment'],
  })

  return (
    <div className="grid space-y-6 py-6 px-10">
      <h1 className="text-3xl mb-5 font-extrabold">{article.title}</h1>
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
          {user && (
            <Card className="border-0 p-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  form.handleSubmit()
                }}
                className="space-y-3"
              >
                <CardContent className="p-0 mb-0">
                  <form.AppField name="body">
                    {(field) => (
                      <field.TextArea
                        placeholder="Type your thoughts"
                        className="rounded-none"
                      />
                    )}
                  </form.AppField>
                </CardContent>
                <CardFooter className="bg-accent py-3 rounded-b-xl flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <Link
                      to="/profile/$username"
                      params={{ username: user.username }}
                    >
                      <UserAvatar
                        className="size-5"
                        src={user.image}
                        fallbackName={user.username}
                      />
                    </Link>
                    <Link
                      to="/profile/$username"
                      params={{ username: user.username }}
                      className="truncate text-xs font-medium"
                    >
                      {user.username}
                    </Link>
                  </div>
                  <Button>Post comment</Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {comments.map((comment) => (
            <Card className="py-0 gap-2" key={comment.id}>
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
  comment: GetCommentsQueryResponse['comments'][number]
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
  article: ListArticlesQueryResponse['articles'][number]
}) {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const isArticleAuthor = user?.username === article.author.username
  const deleteArticleMutation = useDeleteArticle({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: listArticlesQueryOptions({
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
  const favoriteArticleMutation = useFavoriteArticle()
  const deleteArticleFavoriteMutation = useDeleteArticleFavorite()
  const createUserFollowMutation = useCreateUserFollow()
  const deleteUserFollowMutation = useDeleteUserFollow()
  const queryClient = useQueryClient()
  function handleDeleteArticle() {
    deleteArticleMutation.mutate({ id: Number(article.id) })
  }

  function handleFavoriteArticle() {
    if (!isAuthenticated) {
      navigate({ to: '/login' })
      return
    }
    const mutation = article.favorited
      ? deleteArticleFavoriteMutation
      : favoriteArticleMutation

    mutation.mutate(
      { id: Number(article.id) },
      {
        onSuccess: (data) => {
          queryClient.setQueryData(
            getArticleQueryOptions(Number(article.id)).queryKey,
            data,
          )
          navigate({
            to: '/articles/$id/$slug',
            params: { id: String(article.id), slug: article.slug },
          })
        },
      },
    )
  }

  function handleFollowAuthor() {
    if (!isAuthenticated) {
      navigate({ to: '/login' })
      return
    }
    const mutation = article.author.following
      ? deleteUserFollowMutation
      : createUserFollowMutation

    mutation.mutate(
      { username: article.author.username },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getArticleQueryOptions(article.id).queryKey,
          })
          navigate({
            to: '/articles/$id/$slug',
            params: { id: String(article.id), slug: article.slug },
          })
        },
      },
    )
  }
  return (
    <div className="flex gap-10">
      <ArticleAuthorInfo article={article} />
      <div className="flex gap-4">
        <Button
          variant={article.author.following ? 'destructive' : 'secondary'}
          disabled={
            createUserFollowMutation.isPending ||
            deleteUserFollowMutation.isPending
          }
          onClick={handleFollowAuthor}
        >
          {article.author.following
            ? `Unfollow ${article.author.username}`
            : `Follow ${article.author.username}`}
        </Button>
        <Button
          disabled={favoriteArticleMutation.isPending}
          onClick={handleFavoriteArticle}
          variant={article.favorited ? 'destructive' : 'default'}
        >
          {article.favorited
            ? `Unfavorite article (${article.favoritesCount})`
            : `Favorite article (${article.favoritesCount})`}
        </Button>
        {isArticleAuthor && (
          <>
            <Button asChild variant="secondary">
              <Link
                to="/articles/$id/$slug/edit"
                params={{ slug: article.slug, id: String(article.id) }}
              >
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
