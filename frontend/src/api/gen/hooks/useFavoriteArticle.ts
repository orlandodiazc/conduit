/**
 * Generated by Kubb (https://kubb.dev/).
 * Do not edit manually.
 */

import client from '@kubb/plugin-client/clients/axios'
import type {
  FavoriteArticleMutationResponse,
  FavoriteArticlePathParams,
  FavoriteArticle400,
  FavoriteArticle404,
} from '../types/FavoriteArticle.ts'
import type {
  RequestConfig,
  ResponseErrorConfig,
} from '@kubb/plugin-client/clients/axios'
import type { UseMutationOptions, QueryClient } from '@tanstack/react-query'
import { favoriteArticle } from '../clients/favoriteArticle.ts'
import { useMutation } from '@tanstack/react-query'

export const favoriteArticleMutationKey = () =>
  [{ url: '/articles/{id}/favorite' }] as const

export type FavoriteArticleMutationKey = ReturnType<
  typeof favoriteArticleMutationKey
>

/**
 * {@link /articles/:id/favorite}
 */
export function useFavoriteArticle<TContext>(
  options: {
    mutation?: UseMutationOptions<
      FavoriteArticleMutationResponse,
      ResponseErrorConfig<FavoriteArticle400 | FavoriteArticle404>,
      { id: FavoriteArticlePathParams['id'] },
      TContext
    > & { client?: QueryClient }
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const {
    mutation: { client: queryClient, ...mutationOptions } = {},
    client: config = {},
  } = options ?? {}
  const mutationKey =
    mutationOptions?.mutationKey ?? favoriteArticleMutationKey()

  return useMutation<
    FavoriteArticleMutationResponse,
    ResponseErrorConfig<FavoriteArticle400 | FavoriteArticle404>,
    { id: FavoriteArticlePathParams['id'] },
    TContext
  >(
    {
      mutationFn: async ({ id }) => {
        return favoriteArticle(id, config)
      },
      mutationKey,
      ...mutationOptions,
    },
    queryClient,
  )
}
