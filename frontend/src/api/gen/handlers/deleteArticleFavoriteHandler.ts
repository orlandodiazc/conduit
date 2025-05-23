/**
 * Generated by Kubb (https://kubb.dev/).
 * Do not edit manually.
 */

import type { DeleteArticleFavoriteMutationResponse } from '../types/DeleteArticleFavorite.ts'
import { generateDeleteArticleFavoriteMutationResponseFakeData } from '../mocks/generateDeleteArticleFavorite.ts'
import { http } from 'msw'

export function deleteArticleFavoriteHandler(
  data?:
    | DeleteArticleFavoriteMutationResponse
    | ((info: Parameters<Parameters<typeof http.delete>[1]>[0]) => Response),
) {
  return http.delete(
    'http://localhost:8080/articles/:id/favorite',
    function handler(info) {
      if (typeof data === 'function') return data(info)

      return new Response(
        JSON.stringify(
          data || generateDeleteArticleFavoriteMutationResponseFakeData(data),
        ),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    },
  )
}
