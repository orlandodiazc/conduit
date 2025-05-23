/**
 * Generated by Kubb (https://kubb.dev/).
 * Do not edit manually.
 */

import client from '@kubb/plugin-client/clients/axios'
import type {
  CreateArticleMutationRequest,
  CreateArticleMutationResponse,
  CreateArticle400,
  CreateArticle404,
} from '../types/CreateArticle.ts'
import type {
  RequestConfig,
  ResponseErrorConfig,
} from '@kubb/plugin-client/clients/axios'
import type { UseMutationOptions, QueryClient } from '@tanstack/react-query'
import { createArticle } from '../clients/createArticle.ts'
import { useMutation } from '@tanstack/react-query'

export const createArticleMutationKey = () => [{ url: '/articles' }] as const

export type CreateArticleMutationKey = ReturnType<
  typeof createArticleMutationKey
>

/**
 * {@link /articles}
 */
export function useCreateArticle<TContext>(
  options: {
    mutation?: UseMutationOptions<
      CreateArticleMutationResponse,
      ResponseErrorConfig<CreateArticle400 | CreateArticle404>,
      { data: CreateArticleMutationRequest },
      TContext
    > & { client?: QueryClient }
    client?: Partial<RequestConfig<CreateArticleMutationRequest>> & {
      client?: typeof client
    }
  } = {},
) {
  const {
    mutation: { client: queryClient, ...mutationOptions } = {},
    client: config = {},
  } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? createArticleMutationKey()

  return useMutation<
    CreateArticleMutationResponse,
    ResponseErrorConfig<CreateArticle400 | CreateArticle404>,
    { data: CreateArticleMutationRequest },
    TContext
  >(
    {
      mutationFn: async ({ data }) => {
        return createArticle(data, config)
      },
      mutationKey,
      ...mutationOptions,
    },
    queryClient,
  )
}
