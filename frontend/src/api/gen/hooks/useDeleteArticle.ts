/**
 * Generated by Kubb (https://kubb.dev/).
 * Do not edit manually.
 */

import client from '@kubb/plugin-client/clients/axios'
import type {
  DeleteArticleMutationResponse,
  DeleteArticlePathParams,
  DeleteArticle400,
  DeleteArticle404,
} from '../types/DeleteArticle.ts'
import type {
  RequestConfig,
  ResponseErrorConfig,
} from '@kubb/plugin-client/clients/axios'
import type { UseMutationOptions, QueryClient } from '@tanstack/react-query'
import { deleteArticle } from '../clients/deleteArticle.ts'
import { useMutation } from '@tanstack/react-query'

export const deleteArticleMutationKey = () =>
  [{ url: '/articles/{id}' }] as const

export type DeleteArticleMutationKey = ReturnType<
  typeof deleteArticleMutationKey
>

/**
 * {@link /articles/:id}
 */
export function useDeleteArticle<TContext>(
  options: {
    mutation?: UseMutationOptions<
      DeleteArticleMutationResponse,
      ResponseErrorConfig<DeleteArticle400 | DeleteArticle404>,
      { id: DeleteArticlePathParams['id'] },
      TContext
    > & { client?: QueryClient }
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const {
    mutation: { client: queryClient, ...mutationOptions } = {},
    client: config = {},
  } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? deleteArticleMutationKey()

  return useMutation<
    DeleteArticleMutationResponse,
    ResponseErrorConfig<DeleteArticle400 | DeleteArticle404>,
    { id: DeleteArticlePathParams['id'] },
    TContext
  >(
    {
      mutationFn: async ({ id }) => {
        return deleteArticle(id, config)
      },
      mutationKey,
      ...mutationOptions,
    },
    queryClient,
  )
}
