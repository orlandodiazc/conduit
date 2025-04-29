import { createFileRoute } from '@tanstack/react-router'
import type { UpdateArticleMutationRequest } from '@/api/gen'
import { useAppForm } from '@/hooks/form'

export const Route = createFileRoute('/articles/$slug/edit')({
  component: RouteComponent,
})

const defaultArticle: UpdateArticleMutationRequest['article'] = {
  body: '',
  description: '',
  title: '',
}

function RouteComponent() {
  const form = useAppForm({ defaultValues: defaultArticle })
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
