import {
  getArticlesQueryOptions,
  useCreateArticle,
  type CreateArticleMutationRequest,
} from '@/api/gen'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppForm } from '@/hooks/form'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/_auth/articles/create')({
  component: RouteComponent,
})

const defaultArticle: CreateArticleMutationRequest['article'] = {
  body: '',
  description: '',
  title: '',
}

function RouteComponent() {
  const { mutateAsync: createArticle } = useCreateArticle()
  const queryClient = useQueryClient()
  const navigate = Route.useNavigate()
  const form = useAppForm({
    defaultValues: defaultArticle,
    onSubmit: async ({ value }) => {
      const data = await createArticle({ data: { article: value } })
      const username = data.article.author.username
      queryClient.invalidateQueries({
        queryKey: getArticlesQueryOptions({
          author: username,
        }).queryKey,
      })
      navigate({ to: '/profile/$username', params: { username } })
    },
  })
  const [newTag, setNewTag] = useState('')
  return (
    <div className="py-8 max-w-sm m-auto">
      <h1 className="text-h1 mb-6">Create article</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-3"
      >
        <form.AppField name="title">
          {(field) => <field.TextField label="Title" />}
        </form.AppField>

        <form.AppField name="description">
          {(field) => <field.TextField label="Description" />}
        </form.AppField>

        <form.AppField name="body">
          {(field) => <field.TextArea label="Content" />}
        </form.AppField>

        <form.AppField name="tagList" mode="array">
          {(field) => (
            <>
              <div>
                <Label htmlFor="add-tag" className="mb-1 text-lg font-bold">
                  Add tag
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="add-tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                  />
                  <Button
                    onClick={() => {
                      field.pushValue(newTag)
                      setNewTag('')
                    }}
                    type="button"
                  >
                    <Plus />
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {field.state.value?.map((tagName, i) => (
                  <Button
                    asChild
                    size="xs"
                    className="hover:bg-destructive hover:text-white  dark:hover:bg-destructive/60"
                  >
                    <Badge onClick={() => field.removeValue(i)}>
                      {tagName} <X />
                    </Badge>
                  </Button>
                ))}
              </div>
            </>
          )}
        </form.AppField>

        <form.AppForm>
          <form.SubscribeButton label="Submit" />
        </form.AppForm>
      </form>
    </div>
  )
}
