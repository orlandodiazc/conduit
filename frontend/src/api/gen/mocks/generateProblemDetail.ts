/**
 * Generated by Kubb (https://kubb.dev/).
 * Do not edit manually.
 */

import type { ProblemDetail } from '../types/ProblemDetail.ts'
import { faker } from '@faker-js/faker'

export function generateProblemDetailFakeData(
  data?: Partial<ProblemDetail>,
): ProblemDetail {
  return {
    ...{
      type: faker.internet.url(),
      title: faker.string.alpha(),
      status: faker.number.int(),
      detail: faker.string.alpha(),
      instance: faker.internet.url(),
      properties: {},
    },
    ...(data || {}),
  }
}
