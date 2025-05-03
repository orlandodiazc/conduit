import { createFileRoute } from '@tanstack/react-router'
import type { UpdateArticleMutationRequest } from '@/api/gen'
import { useAppForm } from '@/hooks/form'

export const Route = createFileRoute('/_auth/articles/$id/$slug/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  const form = useAppForm({
    defaultValues: {
      body: '',
      description: '',
      title: '',
    } as UpdateArticleMutationRequest['article'],
  })
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-3 max-w-sm m-auto py-8"
    >
      <form.AppField name="title">
        {(field) => <field.TextField label="Email" />}
      </form.AppField>

      <form.AppField name="description">
        {(field) => <field.TextField label="Username" />}
      </form.AppField>

      <form.AppField name="body">
        {(field) => <field.TextField label="Bio" />}
      </form.AppField>

      <form.AppForm>
        <form.SubscribeButton label="Submit" />
      </form.AppForm>
    </form>
  )
}
