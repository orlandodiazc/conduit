import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { useAppForm } from '@/hooks/form'
import { useAuth } from '@/auth'
import { useRegister } from '@/api/gen'

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

const schema = z.object({
  email: z.string().min(1, 'Email is required'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

function RouteComponent() {
  const { mutate } = useRegister()
  const navigate = Route.useNavigate()
  const { setTokenValue } = useAuth()

  const form = useAppForm({
    defaultValues: { email: '', username: '', password: '' },
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
      <h1 className="font-extrabold text-4xl mb-2">Register</h1>
      <p className="text-muted-foreground mb-3">Please enter your details.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-4 m-auto mb-6"
      >
        <form.AppField name="email">
          {(field) => <field.TextField label="Email" />}
        </form.AppField>

        <form.AppField name="username">
          {(field) => <field.TextField label="Username" />}
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
