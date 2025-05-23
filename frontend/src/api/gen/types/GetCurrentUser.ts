/**
 * Generated by Kubb (https://kubb.dev/).
 * Do not edit manually.
 */

import type { CurrentUserResponse } from './CurrentUserResponse.ts'
import type { ProblemDetail } from './ProblemDetail.ts'

/**
 * @description OK
 */
export type GetCurrentUser200 = CurrentUserResponse

/**
 * @description Bad Request
 */
export type GetCurrentUser400 = ProblemDetail

/**
 * @description Not Found
 */
export type GetCurrentUser404 = ProblemDetail

export type GetCurrentUserQueryResponse = GetCurrentUser200

export type GetCurrentUserQuery = {
  Response: GetCurrentUser200
  Errors: GetCurrentUser400 | GetCurrentUser404
}
