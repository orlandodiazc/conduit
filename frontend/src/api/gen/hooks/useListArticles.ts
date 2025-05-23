/**
 * Generated by Kubb (https://kubb.dev/).
 * Do not edit manually.
 */

import client from '@kubb/plugin-client/clients/axios'
import type {
  ListArticlesQueryResponse,
  ListArticlesQueryParams,
  ListArticles400,
  ListArticles404,
} from '../types/ListArticles.ts'
import type {
  RequestConfig,
  ResponseErrorConfig,
} from '@kubb/plugin-client/clients/axios'
import { listArticles } from '../clients/listArticles.ts'
import { queryOptions } from '@tanstack/react-query'

export const listArticlesQueryKey = (params?: ListArticlesQueryParams) =>
  [{ url: '/articles' }, ...(params ? [params] : [])] as const

export type ListArticlesQueryKey = ReturnType<typeof listArticlesQueryKey>

export function listArticlesQueryOptions(
  params?: ListArticlesQueryParams,
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = listArticlesQueryKey(params)
  return queryOptions<
    ListArticlesQueryResponse,
    ResponseErrorConfig<ListArticles400 | ListArticles404>,
    ListArticlesQueryResponse,
    typeof queryKey
  >({
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return listArticles(params, config)
    },
  })
}
