import { Button } from './ui/button'
import type { CreateArticleMutationRequest } from '@/api/gen'
import { useAppForm } from '@/hooks/form'

const defaultArticle: CreateArticleMutationRequest['article'] = {
  body: '',
  description: '',
  title: '',
  tagList: undefined,
}

export default function ArticleForm() {
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

      <form.AppField name="tagList" mode="array">
        {(field) => {
          return (
            <div>
              {field.state.value?.map((_, i) => {
                return (
                  <form.AppField key={i} name={`tagList[${i}]`}>
                    {(subField) => {
                      return (
                        <Button onClick={() => field.removeValue(i)}>
                          {subField.state.value}
                        </Button>
                      )
                    }}
                  </form.AppField>
                )
              })}
              <Button onClick={() => field.pushValue('test')} type="button">
                Add person
              </Button>
            </div>
          )
        }}
      </form.AppField>

      <form.AppForm>
        <form.SubscribeButton label="Submit" />
      </form.AppForm>
    </form>
  )
}
