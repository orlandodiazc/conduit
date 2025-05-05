import type { UpdateCurrentUserMutationRequest } from '@/api/gen'
import { useUpdateCurrentUser } from '@/api/gen'
import { currentUserQueryOptions, removeStoredToken, useAuth } from '@/auth'
import { Button } from '@/components/ui/button'
import { useAppForm } from '@/hooks/form'
import { Separator } from '@radix-ui/react-select'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user, setUser } = useAuth()
  const queryClient = useQueryClient()
  const navigate = Route.useNavigate()

  const handleLogout = () => {
    setUser(null)
    removeStoredToken()
  }

  const { mutate } = useUpdateCurrentUser({
    mutation: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: currentUserQueryOptions.queryKey,
        })
        navigate({
          to: '/profile/$username',
          params: { username: data.user.username },
        })
      },
    },
  })

  const form = useAppForm({
    defaultValues: {
      email: user?.email ?? '',
      username: user?.username ?? '',
      password: '',
      bio: user?.bio ?? '',
    } as UpdateCurrentUserMutationRequest['user'],
    onSubmit: ({ value }) => {
      mutate({ data: { user: value } })
    },
  })

  return (
    <div className="max-w-md m-auto py-8">
      <h1 className="text-h1 mb-6">Edit your profile</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-3"
      >
        <form.AppField name="email">
          {(field) => <field.TextField label="Email" />}
        </form.AppField>

        <form.AppField name="username">
          {(field) => <field.TextField label="Username" />}
        </form.AppField>

        <form.AppField name="bio">
          {(field) => <field.TextField label="Bio" />}
        </form.AppField>

        <form.AppField name="password">
          {(field) => <field.PasswordField label="Password" />}
        </form.AppField>

        <form.AppForm>
          <form.SubscribeButton label="Submit" />
        </form.AppForm>
      </form>
      <Separator className="my-4" />
      <Button onClick={handleLogout} variant="destructive">
        Or click here to logout.
      </Button>
    </div>
  )
}
