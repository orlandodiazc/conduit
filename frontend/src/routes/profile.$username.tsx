import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import UserAvatar from '@/components/UserAvatar'
import {
  getProfileQueryOptions,
  useCreateUserFollow,
  useDeleteUserFollow,
} from '@/api/gen'
import { useAuth } from '@/auth'

export const Route = createFileRoute('/profile/$username')({
  component: RouteComponent,
  loader: ({ context, params: { username } }) => {
    return context.queryClient.ensureQueryData(getProfileQueryOptions(username))
  },
})

function RouteComponent() {
  const { user, isAuthenticated } = useAuth()
  const { username } = Route.useParams()
  const queryClient = useQueryClient()
  const {
    data: { profile },
  } = useSuspenseQuery(getProfileQueryOptions(username))
  const navigate = Route.useNavigate()

  const followMutation = useCreateUserFollow()
  const unfollowMutation = useDeleteUserFollow()

  function handleFollowToggle() {
    if (!isAuthenticated) {
      navigate({ to: '/login', search: { redirect: location.pathname } })
      return
    }
    const mutation = profile.following ? unfollowMutation : followMutation

    mutation.mutate(
      { username },
      {
        onSuccess: (data) => {
          queryClient.setQueryData(
            getProfileQueryOptions(username).queryKey,
            data,
          )
          navigate({
            to: '/profile/$username',
            params: { username },
          })
        },
      },
    )
  }
  return (
    <div className="py-10 max-w-4xl m-auto">
      <div className="flex flex-col items-center gap-3">
        <div>
          <UserAvatar
            src={profile.image}
            fallbackName={profile.username}
            className="size-20"
          />
        </div>
        <h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          {profile.username}
        </h1>
        <p className="text-muted-foreground">{profile.bio}</p>

        <div className="self-end flex gap-2">
          {user?.username === profile.username && (
            <Button asChild variant="outline">
              <Link to="/settings">Edit profile settings</Link>
            </Button>
          )}

          <Button
            variant={profile.following ? 'destructive' : 'secondary'}
            disabled={followMutation.isPending || unfollowMutation.isPending}
            onClick={handleFollowToggle}
          >
            {profile.following
              ? `Unfollow ${profile.username}`
              : `Follow ${profile.username}`}
          </Button>
        </div>
      </div>
      <div className="grid grid-flow-col grid-cols-1 gap-6 mt-10">
        <div>
          <div className="text-muted-foreground border-b flex">
            <div className="p-2">
              <Link
                to="/profile/$username"
                params={{ username }}
                className="[&.active]:text-foreground"
              >
                My Articles
              </Link>
            </div>

            <div className="p-2">
              <Link
                to="/profile/$username/favorites"
                params={{ username }}
                className="[&.active]:text-foreground"
              >
                My Favorites
              </Link>
            </div>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
