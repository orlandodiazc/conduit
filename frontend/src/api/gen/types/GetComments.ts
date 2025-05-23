/**
 * Generated by Kubb (https://kubb.dev/).
 * Do not edit manually.
 */

import type { MultipleCommentsResponse } from './MultipleCommentsResponse.ts'
import type { ProblemDetail } from './ProblemDetail.ts'

export type GetCommentsPathParams = {
  /**
   * @type integer, int32
   */
  articleId: number
}

/**
 * @description OK
 */
export type GetComments200 = MultipleCommentsResponse

/**
 * @description Bad Request
 */
export type GetComments400 = ProblemDetail

/**
 * @description Not Found
 */
export type GetComments404 = ProblemDetail

export type GetCommentsQueryResponse = GetComments200

export type GetCommentsQuery = {
  Response: GetComments200
  PathParams: GetCommentsPathParams
  Errors: GetComments400 | GetComments404
}
