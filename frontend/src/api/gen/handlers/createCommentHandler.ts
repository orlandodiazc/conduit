/**
 * Generated by Kubb (https://kubb.dev/).
 * Do not edit manually.
 */

import type { CreateCommentMutationResponse } from '../types/CreateComment.ts'
import { generateCreateCommentMutationResponseFakeData } from '../mocks/generateCreateComment.ts'
import { http } from 'msw'

export function createCommentHandler(
  data?:
    | CreateCommentMutationResponse
    | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Response),
) {
  return http.post(
    'http://localhost:8080/articles/:articleId/comments',
    function handler(info) {
      if (typeof data === 'function') return data(info)

      return new Response(
        JSON.stringify(
          data || generateCreateCommentMutationResponseFakeData(data),
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
