import { Link, createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { useAppForm } from '@/hooks/form'
import { useLogin } from '@/api/gen'
import { useAuth } from '@/auth'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

const schema = z.object({
  email: z.string().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
})

function RouteComponent() {
  const { mutate } = useLogin()
  const navigate = Route.useNavigate()
  const { setTokenValue } = useAuth()

  const form = useAppForm({
    defaultValues: { email: '', password: '' },
    validators: { onSubmit: schema, onBlur: schema },
    onSubmit: ({ value }) => {
      mutate(
        { data: { user: value } },
        {
          onSuccess: (data) => {
            setTokenValue(data.user.token)
            navigate({ to: '/' })
          },
        },
      )
    },
  })

  return (
    <div className="max-w-sm m-auto py-10">
      <h1 className="font-extrabold text-4xl mb-2">Login</h1>
      <div className="mb-4">
        <span className="text-muted-foreground">New here? </span>
        <Link to="/register" className="font-bold">
          Create an account!
        </Link>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-4 m-auto"
      >
        <form.AppField name="email">
          {(field) => <field.TextField label="Email" />}
        </form.AppField>

        <form.AppField name="password">
          {(field) => <field.PasswordField label="Password" />}
        </form.AppField>

        <form.AppForm>
          <form.SubscribeButton label="Submit" />
        </form.AppForm>
      </form>
    </div>
  )
}
