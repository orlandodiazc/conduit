/**
 * Generated by Kubb (https://kubb.dev/).
 * Do not edit manually.
 */

import type { GetCurrentUserQueryResponse } from '../types/GetCurrentUser.ts'
import { generateGetCurrentUserQueryResponseFakeData } from '../mocks/generateGetCurrentUser.ts'
import { http } from 'msw'

export function getCurrentUserHandler(
  data?:
    | GetCurrentUserQueryResponse
    | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Response),
) {
  return http.get('http://localhost:8080/user', function handler(info) {
    if (typeof data === 'function') return data(info)

    return new Response(
      JSON.stringify(data || generateGetCurrentUserQueryResponseFakeData(data)),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  })
}
