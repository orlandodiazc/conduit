import { useLogin } from '@/api/gen'
import { removeStoredToken, useAuth } from '@/auth'
import { useAppForm } from '@/hooks/form'
import {
  Link,
  createFileRoute,
  redirect,
  useNavigate,
  useRouter,
} from '@tanstack/react-router'
import { z } from 'zod'

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: '/' })
    }
  },
  component: RouteComponent,
})

const schema = z.object({
  email: z.string().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
})

function RouteComponent() {
  const { mutate } = useLogin()
  const navigate = useNavigate()
  const search = Route.useSearch()
  const router = useRouter()
  const { setUser } = useAuth()
  const form = useAppForm({
    defaultValues: { email: '', password: '' },
    validators: { onSubmit: schema, onBlur: schema },
    onSubmit: ({ value }) => {
      mutate(
        { data: { user: value } },
        {
          onSuccess: (data) => {
            setUser(data.user)
            router.invalidate().then(() => {
              navigate({ to: search.redirect || '/' })
            })
          },
          onError: () => {
            removeStoredToken()
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
