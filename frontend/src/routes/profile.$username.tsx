import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import UserAvatar from '@/components/UserAvatar'
import {
  getArticlesQueryOptions,
  getProfileByUsernameQueryOptions,
  useFollowUserByUsername,
  useUnfollowUserByUsername,
} from '@/api/gen'
import { useAuth } from '@/auth'

export const Route = createFileRoute('/profile/$username')({
  component: RouteComponent,
  loader: async ({ context, params: { username } }) => {
    const profilePromise = context.queryClient.ensureQueryData(
      getProfileByUsernameQueryOptions(username),
    )
    const userArticles = context.queryClient.ensureQueryData(
      getArticlesQueryOptions({ author: username }),
    )
    return await Promise.all([profilePromise, userArticles])
  },
})

function RouteComponent() {
  const { username } = Route.useParams()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const {
    data: { profile },
  } = useSuspenseQuery(getProfileByUsernameQueryOptions(username))

  const { data: articlesPage } = useSuspenseQuery(
    getArticlesQueryOptions({ author: username }),
  )

  const followMutation = useFollowUserByUsername({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getProfileByUsernameQueryOptions(username).queryKey,
        })
      },
    },
  })
  const unfollowMutation = useUnfollowUserByUsername({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getProfileByUsernameQueryOptions(username).queryKey,
        })
      },
    },
  })
  return (
    <div>
      <UserAvatar src={profile.image} fallbackName={profile.username} />
      {JSON.stringify(profile)}
      {user?.username !== profile.username &&
        (!profile.following ? (
          <Button
            onClick={() => followMutation.mutate({ username })}
            disabled={followMutation.isPending}
          >
            Follow
          </Button>
        ) : (
          <Button
            onClick={() => unfollowMutation.mutate({ username })}
            disabled={unfollowMutation.isPending}
          >
            Unfollow
          </Button>
        ))}
      <br />
      {user?.username !== profile.username && (
        <Link to="/settings">Edit profile settings</Link>
      )}
      {JSON.stringify(articlesPage.articles)}
    </div>
  )
}
