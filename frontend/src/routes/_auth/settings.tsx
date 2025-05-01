import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useAppForm } from '@/hooks/form'
import { getCurrentUserQueryOptions, useUpdateCurrentUser } from '@/api/gen'
import { useAuth } from '@/auth'

export const Route = createFileRoute('/_auth/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()
  const navigate = Route.useNavigate()

  const { mutate } = useUpdateCurrentUser({
    mutation: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: getCurrentUserQueryOptions().queryKey,
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
      email: user?.email,
      username: user?.username,
      password: '',
      bio: user?.bio,
    },
    onSubmit: ({ value }) => {
      mutate({ data: { user: value } })
    },
  })

  function handleLogout() {
    router.invalidate()
    logout()
    navigate({ to: '/' })
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-3 max-w-sm m-auto py-8"
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
      <Button onClick={handleLogout}>Logout</Button>
    </>
  )
}
